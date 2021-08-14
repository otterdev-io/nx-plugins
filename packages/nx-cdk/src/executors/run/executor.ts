import { CDKRunExecutorSchema } from './schema';
import {
  ExecutorContext,
  getPackageManagerCommand,
  offsetFromRoot,
} from '@nrwl/devkit';
import { spawnSync } from 'child_process';
import path = require('path');
import { runExecutor as execExecutor } from '@otterdev/nx-exec';
export default async function runExecutor(
  options: CDKRunExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const outPath = path.join(offsetFromRoot(projectRoot), options.outputPath);
  const parameters = options.parameters?.join(' ') ?? '';
  const opt = options.options ?? '';

  return execExecutor({
    command: ` cdk ${options.command} ${parameters} ${opt} -o ${outPath}`,
    cwd: projectRoot,
  });
}
