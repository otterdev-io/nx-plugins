import { CDKRunExecutorSchema } from './schema';
import {
  ExecutorContext,
  getPackageManagerCommand,
  offsetFromRoot,
} from '@nrwl/devkit';
import { spawnSync } from 'child_process';
import path = require('path');

export default async function runExecutor(
  options: CDKRunExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const outPath = path.join(offsetFromRoot(projectRoot), options.outputPath);

  const out = spawnSync(
    `${getPackageManagerCommand().exec} cdk ${options.command} ${
      options.parameters?.join(' ') ?? ''
    } ${options.options ?? ''} -o ${outPath}`,
    {
      cwd: projectRoot,
      shell: true,
      stdio: 'inherit',
    }
  );
  return {
    success: out.status === 0,
  };
}
