import { BootstrapExecutorSchema } from './schema';
import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { spawnSync } from 'child_process';

export default async function runExecutor(
  options: BootstrapExecutorSchema,
  context: ExecutorContext
) {
  spawnSync(
    `${
      getPackageManagerCommand().exec
    } cdk bootstrap ${options.environments.join(' ')}`,
    {
      cwd: context.workspace.projects[context.projectName].root,
      shell: true,
      stdio: 'inherit',
    }
  );
  return {
    success: true,
  };
}
