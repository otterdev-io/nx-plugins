export interface AppGeneratorSchema {
  project?: string;
  name: string;
  cdkCommand: string;
  tags?: string;
  directory?: string;
}
