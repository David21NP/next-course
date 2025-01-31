import os

from aws_cdk import CfnOutput, Duration, Environment, RemovalPolicy, Stack
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_ecr as ecr
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_ecs_patterns as ecs_patterns
from aws_cdk import aws_elasticloadbalancingv2 as elbv2
from aws_cdk import aws_iam as iam
from aws_cdk import aws_route53 as route53
from constructs import Construct

from infra.constructs.ecs_fargate import EcsFargateConstruct


class InfraStack(Stack):

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        *,
        env: Environment | None = None,
        vpc_id: str,
        github_oidc_arn: str | None = None,
    ) -> None:
        super().__init__(scope, construct_id, env=env)

        # NOTE: For github ci to be able to connect with aws
        if not github_oidc_arn:
            github_oidc = iam.CfnOIDCProvider(
                self,
                "GithubOidc",
                url="https://token.actions.githubusercontent.com",
                client_id_list=["sts.amazonaws.com"],
                thumbprint_list=["6938fd4d98bab03faadb97b34396831e3780aea1"],
            )
            github_oidc_arn = github_oidc.attr_arn
        CfnOutput(self, "GithubOidcArn", value=github_oidc_arn)

        vpc = ec2.Vpc.from_lookup(self, "Vpc", vpc_id=vpc_id)

        EcsFargateConstruct(
            self,
            "ContainerConstruct",
            vpc=vpc,
        )
