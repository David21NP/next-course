from typing import Final

from aws_cdk import RemovalPolicy, Stack
from aws_cdk import aws_ecr as ecr
from constructs import Construct


def change_case(str_val: str):
    """Change case for naming constructs."""
    res = [str_val[0].lower()]
    for c in str_val[1:]:
        if c == c.upper():
            _c = "_" + c.lower()
        else:
            _c = c.lower()
        res.append(_c)
    return "".join(res)


class EcrStack(Stack):
    def __init__(self, scope: Construct, construct_id: str) -> None:
        super().__init__(scope, construct_id)

        PREFIX = "NextJsContainer"

        self.repository: Final = ecr.Repository(
            self,
            PREFIX + "ImageRepository",
            repository_name=change_case(PREFIX + "ImageRepository"),
            removal_policy=RemovalPolicy.DESTROY,
            empty_on_delete=True,
            image_scan_on_push=True,
        )
