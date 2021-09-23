import {
  addDependenciesToPackageJson,
  formatFiles,
  GeneratorCallback,
  NxJsonConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { jestInitGenerator } from '@nrwl/jest';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { InitSchema } from './schema';

function updateCacheableTasks(tree: Tree) {
  updateJson(tree, 'nx.json', (json: NxJsonConfiguration) => {
    const defaultCacheableOperations: string[] | undefined =
      json.tasksRunnerOptions?.default?.options?.cacheableOperations;
    if (
      defaultCacheableOperations &&
      !defaultCacheableOperations.includes('synth')
    ) {
      defaultCacheableOperations.push('synth');
    }
    return json;
  });
}

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
      '@aws-cdk/core': '^1.124.0',
      'source-map-support': '^0.5.20',
    },
    {
      '@aws-cdk/assert': '^1.124.0',
      '@types/node': '^12.20.26',
      'ts-node': '^10.2.1',
      '@otterdev/nx-cdk': '^0.0.11',
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

  updateCacheableTasks(tree);
  await formatFiles(tree);

  return runTasksInSerial(...tasks);
}
