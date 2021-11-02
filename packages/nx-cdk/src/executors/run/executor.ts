import { CDKRunExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import { runExecutor as execExecutor } from '@otterdev/nx-exec';

export default async function runExecutor(
  options: CDKRunExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const parameters = options.parameters?.join(' ') ?? '';
  const opt = options.options ?? '';
  
  const appPath = `apps/${context.projectName}`;
  const binPath = `${appPath}/bin/${context.projectName}.ts`;
  const outPath = options.outputPath || `dist/apps/${context.projectName}`;
  const profile = options?.profile ? `--profile ${options.profile}` : '';

  const app = `--app "npx ts-node --prefer-ts-exts ${binPath}"`;
  const cmd = `cdk ${options.command} ${app} ${parameters} ${opt} -o ${outPath} ${profile}`;

  return execExecutor({
    command: cmd,
    cwd: projectRoot,
  });
}
