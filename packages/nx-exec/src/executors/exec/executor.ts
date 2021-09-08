import { spawnSync } from 'child_process';
import { detectPackageManager, getPackageManagerCommand } from '@nrwl/devkit';
import { ExecExecutorSchema } from './schema';
import * as path from 'path';

export default async function runExecutor(options: ExecExecutorSchema) {
  const binPath = spawnSync(`${detectPackageManager()} bin`, {
    shell: true,
  })
    .stdout.toString()
    .trimEnd();
  const out = spawnSync(
    `${getPackageManagerCommand().exec} ${options.command}`,
    {
      cwd: options.cwd,
      shell: true,
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: `${process.env.PATH}${path.delimiter}${binPath}`,
      },
    }
  );
  return {
    success: out.status === 0,
  };
}
