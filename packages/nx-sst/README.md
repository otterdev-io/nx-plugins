# nx-sst

An Nx plugin which provides support for Serverless Stack (SST) apps.

## Add the plugin to your workspace:

```sh
npm install @otterdev-io/nx-sst
```

## Create a typescript sst app:

```sh
nx g @otterdev/nx-sst:app <app name>
```

All SST commands are supported.

For example, if your project is named app:
## Start:

`nx run app:start` or `nx start app`

## Deploy:
```
nx run app:deploy 
```

## Deploy to stage:
```
nx run app:deploy --stage=production
```
