# webMethods API Gateway "Promote API" action for GitHub Actions

![build](https://img.shields.io/github/workflow/status/jiridj/wm-apigw-actions-promote-api/ci)
![coverage](https://img.shields.io/codecov/c/gh/jiridj/wm-apigw-actions-promote-api?token=35GE4E56NO)
![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/jiridj/wm-apigw-actions-promote-api)
![open issues](https://img.shields.io/github/issues-raw/jiridj/wm-apigw-actions-promote-api)
![downloads](https://img.shields.io/github/downloads/jiridj/wm-apigw-actions-promote-api/total)

With this action you can promote an API to a pre-defined stage in webMethods API Gateway. If you feel a particular feature is missing, or if you have found a bug, feel free to submit a pull request! :wink:

## Table of contents

- [Inputs](#inputs)
- [Example](#example)
- [Questions and Issues](#questions-and-issues)
- [License Summary](#license-summary)

## Inputs

|Input|Required|Description|
|-|-|-|
|apigw-url|yes|The url of your (master) API Gateway instance.|
|apigw-username|yes|The API Gateway user to execute this action with.|
|apigw-password|yes|The password for the API Gateway user to execute this action with.|
|api-name|yes|The name of the API to promote.|
|api-version|yes|The version of the API to promote.|
|stage-name|yes|The name of the stage to promote the API to.|
|debug|no|Use debug logging. Default if false.|

## Example

Following example workflow illustrates how to use the action in your CICD configuration.

``` yaml
name: Example workflow
on: [ push ]
jobs:
  promote-api-to-prod:
    runs-on: ubuntu-latest
    steps: 
      - uses: jiridj/wm-apigw-actions-promote-api@v1
        with: 
          apigw-url: ${{ secrets.APIGW_URL }}
          apigw-username: ${{ secrets.APIGW_USERNAME }}
          apigw-password: ${{ secrets.APIGW_PASSWORD }}
          api-name: Swagger Petstore
          api-version: 1.0.6
          stage-name: production
          debug: ${{ secrets.ACTIONS_STEP_DEBUG }}
```

## Questions and Issues

Any questions or issues can be raised via the repository [issues](https://github.com/jiridj/wm-apigw-actions-register-api/issues).

## License Summary

This code is made avialable under the [MIT license](./LICENSE).