import { CDKRunExecutorSchema } from './schema';
import { ExecutorContext, getPackageManagerCommand } from '@nrwl/devkit';
import { spawnSync } from 'child_process';

export default async function runExecutor(
  options: CDKRunExecutorSchema,
  context: ExecutorContext
) {
  const out = spawnSync(
    `${getPackageManagerCommand().exec} cdk ${
      options.command
    } ${options.parameters.join(' ')} ${options.options.join(' ')} -o ${
      options.outputPath
    }`,
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
