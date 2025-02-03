#!/usr/bin/env bash

export AWS_PROFILE=${1-udemy}

REPO_NAME="next_js_container_image_repository"

echo "############ Login to aws & docker ############"
# NOTE: Login aws & docker
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 867344450287.dkr.ecr.us-east-1.amazonaws.com

echo ""
echo "################# Build image #################"
# NOTE: Build image
docker build -t $REPO_NAME .

echo ""
echo "################## Tag image ##################"
# NOTE: Tag image
docker tag $REPO_NAME\:latest 867344450287.dkr.ecr.us-east-1.amazonaws.com/$REPO_NAME\:latest

echo ""
echo "################## Push image #################"
# NOTE: Push image
docker push 867344450287.dkr.ecr.us-east-1.amazonaws.com/$REPO_NAME\:latest

unset AWS_PROFILE
