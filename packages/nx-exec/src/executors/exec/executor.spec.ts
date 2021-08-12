import { ExecExecutorSchema } from './schema';
import executor from './executor';

const options: ExecExecutorSchema = {};

describe('Exec Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
