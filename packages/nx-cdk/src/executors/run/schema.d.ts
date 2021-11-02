export interface CDKRunExecutorSchema {
  command: string;
  parameters?: string[];
  options?: string;
  outputPath?: string;
  profile?: string;
}
