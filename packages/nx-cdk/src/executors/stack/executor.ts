import { StackExecutorSchema } from './schema';
import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { spawnSync } from 'child_process';

export default async function runExecutor(
  options: StackExecutorSchema,
  context: ExecutorContext
) {
  console.log(
    `${getPackageManagerCommand().exec} cdk ${
      options.command
    } ${options.stacks.join(' ')}`
  );
  const out = spawnSync(
    `${getPackageManagerCommand().exec} cdk ${
      options.command
    } ${options.stacks.join(' ')}`,
    {
      cwd: context.workspace.projects[context.projectName].root,
      shell: true,
      stdio: 'inherit',
    }
  );
  return {
    success: out.status === 0,
  };
}
