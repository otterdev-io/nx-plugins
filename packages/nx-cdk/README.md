# nx-cdk

An Nx plugin which provides support for cdk apps.

## Add the plugin to your workspace:

```sh
npm install @otterdev-io/nx-cdk
```

## Create a cdk app:

```sh
nx g @otterdev/nx-cdk:app <cdk project name>
```

All CDK commands are supported

For example, if your project is named web-infra:
## Boostrap:

```sh
nx run web-infra:boostrap
```

## Deploy:
```
nx run web-infra:deploy 
```

## Deploy certain stacks:
```
nx run web-infra:deploy --parameters=WebBackendStack,WebFrontendStack
```

Supply arguments with --options:

```
nx run web-infra:deploy --parameters=WebBackendStack,WebFrontendStack --options="--trace --verbose"
```
