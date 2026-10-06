module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          target: 'ES2022',
          types: ['node', 'jest', '@testing-library/jest-dom'],
        },
      },
    ],
  },
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 50,
      functions: 70,
      lines: 70,
    },
  },
  collectCoverageFrom: [
    'src/utils/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/store/**/*.{ts,tsx}',
    'src/features/assignments/assignmentSlice.ts',
    'src/components/AssignmentCard/**/*.{ts,tsx}',
    'src/components/AssignmentList/**/*.{ts,tsx}',
    'src/components/AssignmentStats/**/*.{ts,tsx}',
    'src/components/VirtualizedAssignmentList/**/*.{ts,tsx}',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/**/*.d.ts',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
  ],
};
