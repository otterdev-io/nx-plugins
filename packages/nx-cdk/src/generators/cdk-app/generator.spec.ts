import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { CdkAppGeneratorSchema } from './schema';

describe('cdk-app generator', () => {
  let appTree: Tree;
  const options: CdkAppGeneratorSchema = {
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
