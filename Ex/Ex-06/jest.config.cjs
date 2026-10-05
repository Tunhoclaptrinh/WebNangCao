/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@ant-design/colors/es/(.*)$': '@ant-design/colors/lib/$1',
    '^@ant-design/icons/es/(.*)$': '@ant-design/icons/lib/$1',
    '^antd/es/(.*)$': 'antd/lib/$1',
    '^(\\.{1,2}/.*)\\.tsx?$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'es2022',
          module: 'commonjs',
          moduleResolution: 'node',
          jsx: 'react-jsx',
          esModuleInterop: true,
          skipLibCheck: true,
          allowJs: true,
          allowImportingTsExtensions: true,
          noEmit: true,
          types: ['jest', '@testing-library/jest-dom'],
        },
        diagnostics: {
          ignoreCodes: [5097],
        },
      },
    ],
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'src/utils/**/*.{ts,tsx}',
    'src/features/cart/**/*.{ts,tsx}',
    'src/features/products/**/*.{ts,tsx}',
    'src/store/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*Types.ts',
    '!src/**/mock*.ts',
    '!src/features/products/productsApi.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'clover'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
