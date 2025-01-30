import json
import os

import aws_cdk.aws_codebuild as codebuild
from aws_cdk import CfnOutput, SecretValue, Stack, aws_amplify
from aws_cdk import aws_amplify_alpha as amplify
from aws_cdk import aws_iam as iam
from aws_cdk import aws_secretsmanager as secretsmanager
from constructs import Construct


class InfraStack(Stack):

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        *,
        owner: str,
        repository: str,
        github_oauth_token_name: str,
        environment_variables: dict[str, str],
        github_oidc_arn: str | None = None,
    ) -> None:
        super().__init__(scope, construct_id)

        # if not github_oidc_arn:
        #     github_oidc = iam.CfnOIDCProvider(
        #         self,
        #         "GithubOidc",
        #         url="https://token.actions.githubusercontent.com",
        #         client_id_list=["sts.amazonaws.com"],
        #         thumbprint_list=["6938fd4d98bab03faadb97b34396831e3780aea1"],
        #     )
        #     github_oidc_arn = github_oidc.attr_arn

        secret_parameters = secretsmanager.Secret(
            self,
            "GithubSecretToken",
            secret_name=github_oauth_token_name,
            generate_secret_string=secretsmanager.SecretStringGenerator(
                secret_string_template=json.dumps(
                    {
                        "GITHUB_PERSONAL_TOKEN": os.getenv(
                            "GITHUB_PERSONAL_TOKEN", ""
                        ),
                    }
                ),
                generate_string_key="nonce_signing_secret",
                password_length=30,
            ),
        )

        with open("infra/build-spec.json", "r") as spec_file:
            spec_info = json.load(spec_file)

        amplify_app = amplify.App(
            self,
            "NextJSApp",
            app_name="David NextJS App",
            source_code_provider=amplify.GitHubSourceCodeProvider(  # pyright: ignore[reportArgumentType]
                owner=owner,
                repository=repository,
                oauth_token=SecretValue.secrets_manager(
                    github_oauth_token_name,
                    json_field="GITHUB_PERSONAL_TOKEN",
                ),
            ),
            auto_branch_deletion=True,
            custom_rules=[
                amplify.CustomRule(
                    source="/<*>",
                    target="/index.html",
                    status=amplify.RedirectStatus.NOT_FOUND_REWRITE,
                ),
            ],
            environment_variables=environment_variables,
            # build_spec=codebuild.BuildSpec.from_asset("infra/build-spec.json"),
            build_spec=codebuild.BuildSpec.from_object_to_yaml(spec_info),
        )

        amplify_app.add_branch("master", stage="PRODUCTION")
        # amplify_app.add_branch("develop", stage="DEVELOPMENT")

        amplify_app.node.add_dependency(secret_parameters)

        secret_parameters.grant_read(amplify_app.grant_principal)

        cfn_amplify_app: aws_amplify.CfnApp | None = (
            amplify_app.node.default_child
        )  # pyright: ignore[reportAssignmentType]
        if cfn_amplify_app:
            cfn_amplify_app.platform = "WEB_COMPUTE"

        CfnOutput(self, "AppId", value=amplify_app.app_id)
        # CfnOutput(self, "GithubOidcArn", value=github_oidc_arn)
