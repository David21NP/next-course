import json
import os

import aws_cdk.aws_codebuild as codebuild
from aws_cdk import CfnOutput, SecretValue, Stack
from aws_cdk import aws_amplify_alpha as amplify
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
    ) -> None:
        super().__init__(scope, construct_id)

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
                password_length=32,
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

        secret_parameters.grant_read(amplify_app.grant_principal)

        amplify_app.add_branch("master", stage="PRODUCTION")
        # amplify_app.add_branch("develop", stage="DEVELOPMENT")

        CfnOutput(self, "AppId", value=amplify_app.app_id)
