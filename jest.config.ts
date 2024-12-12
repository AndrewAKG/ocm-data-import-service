/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1'
    // Add more mappings as per your `tsconfig.json`
  },

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  roots: ['<rootDir>/src/'], // Only test files in the 'src' folder

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  },

  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'] // Match only valid test files
};

export default config;
