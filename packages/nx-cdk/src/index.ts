import cdkAppGenerator, {
  normalizeOptions,
  NormalizedSchema,
} from './generators/app/generator';
import cdkRunExecutor from './executors/run/executor';

export {
  cdkAppGenerator,
  normalizeOptions as cdkAppNormalizeOptions,
  NormalizedSchema as CdkAppNormalizedSchema,
  cdkRunExecutor,
};
export * from './generators/app/schema';
export * from './executors/run/schema';
