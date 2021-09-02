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
    if (json.dependencies && json.dependencies['nx-sst']) {
      delete json.dependencies['nx-sst'];
    }
    return json;
  });
  return addDependenciesToPackageJson(
    tree,
    {
      '@serverless-stack/cli': '0.40.6',
      '@serverless-stack/resources': '0.40.6',
    },
    {
      '@aws-cdk/assert': '1.121.0',
      '@types/aws-lambda': '^8.10.83',
      '@otterdev/nx-sst': 'latest',
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
