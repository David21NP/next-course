#!/usr/bin/env python3

import os

import aws_cdk as cdk

from infra.infra_stack import InfraStack

app = cdk.App()
InfraStack(
    app,
    "InfraStack",
    vpc_id="vpc-0396b3897eb87b93c",
    env=cdk.Environment(
        account=os.getenv("CDK_DEFAULT_ACCOUNT", "867344450287"),
        region=os.getenv("CDK_DEFAULT_REGION", "us-east-1"),
    ),
)

app.synth()
