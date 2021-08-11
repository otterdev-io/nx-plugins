import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { AppGeneratorSchema } from './schema';

describe('cdk-app generator', () => {
  let appTree: Tree;
  const options: AppGeneratorSchema = {
    name: 'test',
    cdkCommand: 'npx cdk',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
