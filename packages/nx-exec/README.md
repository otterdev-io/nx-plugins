# nx-exec

An Nx plugin which provides an executor which for running package commands, using the npx, yarn, or pnpx which is detected by nx

## Add the plugin to your workspace:

```sh
npm install @otterdev-io/nx-exec
```

## Create a target for your project:

Eg the equivalent of `npx prisma generate`:

"targets": {
	...
  "my-target": {
		"executor": "@otterdev/nx-exec:exec",
		"options": {
			"command": "prisma generate"
		}
	}
	...
}

### Options
- command: The command to run with npx/yarn/pnpx
- cwd (optional): The directory to run the command in, relative to workspace root. Defaults to workspace root if not provided