import { StackExecutorSchema } from './schema';
import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { spawnSync } from 'child_process';

export default async function runExecutor(
  options: StackExecutorSchema,
  context: ExecutorContext
) {
  const projectOptions = context.workspace.projects[context.projectName];
  spawnSync(
    getPackageManagerCommand().run(
      'cdk',
      `${options.command} ${options.stacks.join(' ')}`
    ),
    { cwd: projectOptions.root, shell: true, stdio: 'inherit' }
  );
  return {
    success: true,
  };
}
