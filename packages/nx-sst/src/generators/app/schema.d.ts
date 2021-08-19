import { InitSchema } from '../init/schema';

export interface AppGeneratorSchema extends InitSchema {
  name: string;
  tags?: string;
  directory?: string;
}
