export const getDefaultIgnorePatterns = () => {
  return [
    // Hacky way to silence @yarnpkg/doctor about node_modules detection
    `**/${'node'}_modules`,
    '**/node_modules',
    '.cache',
    '.next',
    '**/_release',
    '**/.cache',
    '**/build',
    '**/dist',
    '**/public',
    '**/.storybook',
    '**/storybook-static',
  ];
};
