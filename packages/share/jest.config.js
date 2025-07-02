module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // 可选的额外配置
  testMatch: ['/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],

  // 处理路径别名（如果使用）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};