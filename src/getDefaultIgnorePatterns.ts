export const getDefaultIgnorePatterns = (ignores: string[] = []) => {
  return [
    // Hacky way to silence @yarnpkg/doctor about node_modules detection
    `**/${'node'}_modules`,
    '**/node_modules',
    '**/.cache',
    '**/.changeset',
    '**/.github',
    '**/.husky',
    '**/.yarn',
    '**/.next',
    '**/_release',
    '**/.cache',
    '**/build',
    '**/dist',
    '**/public',
    '**/.storybook',
    '**/storybook-static',
    ...ignores,
  ];
};
