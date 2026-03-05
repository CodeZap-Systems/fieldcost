import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const typescriptScoped = nextTypescript.map(entry => {
  if (entry.files || entry.ignores) {
    return entry;
  }

  return {
    ...entry,
    files: ['**/*.ts', '**/*.tsx'],
  };
});

const config = [
  ...nextCoreWebVitals,
  ...typescriptScoped,
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default config;
