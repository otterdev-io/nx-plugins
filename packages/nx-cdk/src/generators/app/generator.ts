import {
  addProjectConfiguration,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { AppGeneratorSchema } from './schema';
import { jestProjectGenerator } from '@nrwl/jest';
import initGenerator from '../init/init';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import { CDKRunExecutorSchema } from '../../executors/run/schema';

interface NormalizedSchema extends AppGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: AppGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

export async function addJest(host: Tree, options: NormalizedSchema) {
  if (options.unitTestRunner !== 'jest') {
    return () => {
      /* do nothing */
    };
  }

  return await jestProjectGenerator(host, {
    project: options.projectName,
    supportTsx: true,
    skipSerializers: true,
    setupFile: 'none',
    babelJest: true,
  });
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (host: Tree, schema: AppGeneratorSchema) {
  const options = normalizeOptions(host, schema);

  const initTask = await initGenerator(host, options);

  const runTarget = (opts: Omit<CDKRunExecutorSchema, 'outputPath'>) => ({
    executor: '@otterdev/nx-cdk:run',
    options: { ...opts, outputPath: `dist/${options.projectRoot}/cdk.out` },
  });
  addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    targets: {
      list: runTarget({ command: 'list', parameters: [], options: [] }),
      synth: {
        ...runTarget({ command: 'synth', parameters: [], options: ['-q'] }),
        outputs: ['{options.outputPath'],
      },
      bootstrap: runTarget({
        command: 'bootstrap',
        parameters: [],
        options: [],
      }),
      deploy: runTarget({ command: 'deploy', parameters: [], options: [] }),
      destroy: runTarget({ command: 'destroy', parameters: [], options: [] }),
      diff: runTarget({ command: 'diff', parameters: [], options: [] }),
      metadata: runTarget({ command: 'metadata', parameters: [], options: [] }),
      context: runTarget({ command: 'context', parameters: [], options: [] }),
      docs: runTarget({ command: 'docs', parameters: [], options: [] }),
      doctor: runTarget({ command: 'doctor', parameters: [], options: [] }),
    },
    tags: options.parsedTags,
    implicitDependencies: options.project ? [options.project] : undefined,
  });
  addFiles(host, options);
  const jestTask = await addJest(host, options);

  await formatFiles(host);
  return runTasksInSerial(initTask, jestTask);
}
