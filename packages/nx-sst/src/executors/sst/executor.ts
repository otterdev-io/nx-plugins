import { SSTRunExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';
import { runExecutor as execExecutor } from '@otterdev/nx-exec';

export default async function runExecutor(
  options: SSTRunExecutorSchema,
  context: ExecutorContext
) {
  const projectRoot = context.workspace.projects[context.projectName].root;
  const stage = options.stage ? `--stage ${options.stage}` : '';
  const region = options.region ? `--region ${options.region}` : '';
  const roleArn = options.roleArn ? `--role-arn ${options.roleArn}` : '';
  const parameters = options.parameters?.join(' ') ?? '';
  const opt = options.options ?? '';

  return execExecutor({
    command: `sst ${options.command} ${parameters} ${stage} ${region} ${roleArn} ${opt}`,
    cwd: projectRoot,
  });
}
