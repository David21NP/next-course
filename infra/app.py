#!/usr/bin/env python3

import aws_cdk as cdk

from infra.infra_stack import InfraStack

app = cdk.App()
InfraStack(
    app,
    "InfraStack",
    # Name given to plaintext secret in secretsManager.
    # When creating the token scope on Github, only the admin:repo_hook scope is needed
    github_oauth_token_name="dev/githubOauthToken",
    # swap for your github username
    owner="David21NP",
    # swap for your github frontend repo
    repository="next-course",
    # pass in any envVars from the above stacks here
    environment_variables={
        "CI": "true",
        "AMPLIFY_SKIP_BACKEND_BUILD": "true",
        "AMPLIFY_MONOREPO_APP_ROOT": "cdk/nextjs-amplify/apps",
    },
)

app.synth()
