
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/server'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '@shared/(.*)': '<rootDir>/shared/$1',
    '@/(.*)': '<rootDir>/server/$1'
  }
};

export default config;
