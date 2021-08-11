import { InitSchema } from '../init/schema';

export interface AppGeneratorSchema extends InitSchema {
  project?: string;
  name: string;
  tags?: string;
  directory?: string;
}
