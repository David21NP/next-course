from aws_cdk import CfnOutput, RemovalPolicy
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
        scope: "Construct",
        id: str,
        *,
        vpc: ec2.IVpc,
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

        repository = ecr.Repository(
            self,
            PREFIX + "ImageRepository",
            repository_name=change_case(PREFIX + "ImageRepository"),
            removal_policy=RemovalPolicy.DESTROY,
            empty_on_delete=True,
            image_scan_on_push=True,
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
            # task_subnets=ec2.SubnetSelection(
            #     subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS,
            # ),
            platform_version=ecs.FargatePlatformVersion.LATEST,
            public_load_balancer=True,
            enable_execute_command=True,
            enable_ecs_managed_tags=True,
        )

        # Create a new Auto Scaling Policy for the ECS Service
        scalable_target = fargate_service.service.auto_scale_task_count(
            max_capacity=2,
        )

        # Create a new Auto Scaling Policy for the ECS Service
        scalable_target.scale_on_cpu_utilization(
            "CpuScaling",
            target_utilization_percent=50,
        )

        # Create a new Auto Scaling Policy for the ECS Service
        scalable_target.scale_on_memory_utilization(
            "MemoryScaling",
            target_utilization_percent=50,
        )

        CfnOutput(
            self,
            "LoadBalancerDNS",
            value=fargate_service.load_balancer.load_balancer_dns_name,
        )
