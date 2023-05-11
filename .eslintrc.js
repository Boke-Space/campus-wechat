module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'google',
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    // 允许非空断言
    '@typescript-eslint/no-non-null-assertion': 'off',
    // 允许自定义模块和命名空间
    '@typescript-eslint/no-namespace': 'off',
    // 允许对this设置alias
    '@typescript-eslint/no-this-alias': 'off',
    // 允许使用any类型
    '@typescript-eslint/no-explicit-any': ['off'],

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-empty-function': ['off'], // 关闭空函数警告
    '@typescript-eslint/no-var-requires': [0],
    '@typescript-eslint/camelcase': ['off'], // 关闭词组下划线校验
    '@typescript-eslint/ban-ts-ignore': ['off'], // 允许使用ts-ignore
  },
}
