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
import { CdkAppGeneratorSchema } from './schema';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';
import { ChildProcessWithoutNullStreams } from 'node:child_process';

interface NormalizedSchema extends CdkAppGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: CdkAppGeneratorSchema
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

export default async function (host: Tree, options: CdkAppGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: normalizedOptions.projectRoot,
    targets: {
      build: {
        executor: '@nx-cdk/nx-cdk:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(host, normalizedOptions);
  await formatFiles(host);
  return async () => {
    await mkdir(normalizedOptions.projectRoot);
    await promisify(spawn)(
      `${normalizedOptions.cdkCommand} init app --language=typescript --generate-only`,
      [],
      { cwd: normalizedOptions.projectRoot, shell: true, stdio: 'inherit' }
    );
  };
}
