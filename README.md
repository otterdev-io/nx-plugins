# nx-plugins

Plugins for [Nx](https://nx.dev/).

Currently the only plugin is nx-cdk, which provides a generator and executor for cdk apps.

## Add the plugin to your workspace:

```sh
npm install @otterdev-io/npm-cdk
```

## Create a cdk app:

```sh
nx g @otterdev/nx-cdk:app <cdk project name>
```

## Deploy:

```sh
nx deploy <cdk project name>
```

or

```
nx run <cdk project name>:deploy
```