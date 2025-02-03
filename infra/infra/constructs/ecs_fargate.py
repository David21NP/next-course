from aws_cdk import CfnOutput, Duration
from aws_cdk import aws_ec2 as ec2
from aws_cdk import aws_ecr as ecr
from aws_cdk import aws_ecs as ecs
from aws_cdk import aws_ecs_patterns as ecs_patterns
from aws_cdk import aws_logs as logs
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


class EcsFargateConstruct(Construct):
    """Strategy pattern for handle different lambdas options."""

    def __init__(
        self,
        scope: Construct,
        id: str,
        *,
        vpc: ec2.IVpc,
        repository: ecr.Repository,
    ):
        """Init class."""
        super().__init__(scope, id)

        PREFIX = "NextJsContainer"

        cluster = ecs.Cluster(
            self,
            PREFIX + "Cluster",
            vpc=vpc,
            enable_fargate_capacity_providers=True,
        )

        # Create a new Fargate Service with ALB
        fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            PREFIX + "Service",
            cluster=cluster,
            desired_count=1,
            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=ecs.ContainerImage.from_ecr_repository(repository),
                log_driver=ecs.LogDrivers.aws_logs(
                    stream_prefix="cdk-ecs-nextjs-sample",
                    log_retention=logs.RetentionDays.ONE_MONTH,
                ),
                container_port=3000,
            ),
            assign_public_ip=True,
        )

        repository.grant_pull(fargate_service.task_definition.task_role)

        fargate_service.service.connections.security_groups[
            0
        ].add_ingress_rule(
            peer=ec2.Peer.ipv4(vpc.vpc_cidr_block),
            connection=ec2.Port.tcp(80),
            description="Allow http inbound from VPC",
        )

        # Setup AutoScaling policy
        scaling = fargate_service.service.auto_scale_task_count(max_capacity=2)
        scaling.scale_on_cpu_utilization(
            "CpuScaling",
            target_utilization_percent=50,
            scale_in_cooldown=Duration.seconds(60),
            scale_out_cooldown=Duration.seconds(60),
        )

        CfnOutput(
            self,
            "LoadBalancerDNS",
            value=fargate_service.load_balancer.load_balancer_dns_name,
        )
