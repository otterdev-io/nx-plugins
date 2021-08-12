import { spawnSync } from 'child_process';
import { getPackageManagerCommand } from '@nrwl/devkit';
import { ExecExecutorSchema } from './schema';

export default async function runExecutor(options: ExecExecutorSchema) {
  const out = spawnSync(
    `${getPackageManagerCommand().exec} ${options.command}`,
    {
      cwd: options.cwd,
      shell: true,
      stdio: 'inherit',
    }
  );
  return {
    success: out.status === 0,
  };
}
