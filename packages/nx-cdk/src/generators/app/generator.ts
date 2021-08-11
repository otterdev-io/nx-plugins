import {
  addProjectConfiguration,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  formatFiles,
  Tree,
  installPackagesTask,
} from '@nrwl/devkit';
import * as path from 'path';
import { AppGeneratorSchema } from './schema';
import { mkdir, mkdtemp } from 'fs/promises';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';

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

function addFiles(host: Tree, options: NormalizedSchema, initDir: string) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(host, initDir, options.projectRoot, templateOptions);
}

export default async function (host: Tree, options: AppGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  const stackTarget = (command) => ({
    executor: 'nx-cdk:stack',
    options: { command },
    outputs: [`${normalizedOptions.projectRoot}/cdk.out`],
  });
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    generators: {
      'nx-cdk': {
        application: {
          cdkCommand: normalizedOptions.cdkCommand,
        },
      },
    },
    targets: {
      build: stackTarget('synth'),
      deploy: stackTarget('deploy'),
      destroy: stackTarget('destroy'),
      bootstrap: {
        executor: 'nx-cdk:bootstrap',
      },
    },
    tags: normalizedOptions.parsedTags,
    implicitDependencies: options.project ? [options.project] : undefined,
  });
  // We run cdk init in a temp directory so we can track the created files. THe folder needs to be named after our project though, since cdk follows it
  const tmpDir = await mkdtemp(path.join(tmpdir(), `nx-cdk-`));
  const initDir = path.join(tmpDir, normalizedOptions.projectName);
  await mkdir(initDir);
  spawnSync(
    `${normalizedOptions.cdkCommand} init app --language=typescript --generate-only`,
    { cwd: initDir, shell: true, stdio: 'inherit' }
  );

  addFiles(host, normalizedOptions, initDir);
  await formatFiles(host);
  return async () => {
    installPackagesTask(host, true, normalizedOptions.projectRoot);
  };
}
