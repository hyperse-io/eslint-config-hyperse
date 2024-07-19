export const getDefaultIgnorePatterns = (ignores: string[] = []) => {
  return [
    // Hacky way to silence @yarnpkg/doctor about node_modules detection
    `**/${'node'}_modules`,
    '**/node_modules',
    '**/.turbo',
    '**/.docusaurus',
    '**/.cache',
    '**/.changeset',
    '**/.github',
    '**/.husky',
    '**/.yarn',
    '**/.out',
    '**/.next',
    '**/_release',
    '**/.cache',
    '**/build',
    '**/dist',
    '**/public',
    '**/.storybook',
    '**/.vscode-test',
    '**/storybook-static',
    ...ignores,
  ];
};
