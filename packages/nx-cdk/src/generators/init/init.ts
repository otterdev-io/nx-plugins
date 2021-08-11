import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { InitSchema } from './schema';

function updateDependencies(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    if (json.dependencies && json.dependencies['nx-cdk']) {
      delete json.dependencies['nx-cdk'];
    }
    return json;
  });
  return addDependenciesToPackageJson(
    tree,
    {
      '@aws-cdk/core': '1.118.0',
      'source-map-support': '^0.5.16',
    },
    {
      '@aws-cdk/assert': '1.118.0',
      '@types/node': '10.17.27',
      'aws-cdk': '1.118.0',
      'ts-node': '^9.0.0',
      // 'nx-cdk': 'latest',
    }
  );
}

export default async function (tree: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];
  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    const jestTask = jestInitGenerator(tree, {});
    tasks.push(jestTask);
  }
  const installTask = updateDependencies(tree);
  tasks.push(installTask);

  await formatFiles(tree);

  return runTasksInSerial(...tasks);
}
