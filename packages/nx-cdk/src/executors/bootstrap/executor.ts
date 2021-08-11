import { BootstrapExecutorSchema } from './schema';
import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

export default async function runExecutor(
  options: BootstrapExecutorSchema,
  context: ExecutorContext
) {
  const projectOptions = context.workspace.projects[context.projectName];
  await promisify(exec)(
    getPackageManagerCommand().run(
      'cdk',
      `bootstrap ${options.environments.join(' ')}`
    ),
    {
      cwd: projectOptions.root,
    }
  );
  return {
    success: true,
  };
}
