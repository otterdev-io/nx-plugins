# nx-sst

An Nx plugin which provides support for Serverless Stack (SST) apps.
Note that it only works on Node 16 / npm 7 and up.
 It may work with yarn if you have a workspace set up, and your app is a part of it.

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
