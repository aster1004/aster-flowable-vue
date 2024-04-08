/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\.eslintrc.cjs
 * @Description: eslint配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  /**
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
    '@typescript-eslint/no-var-requires': 'off', // 允许使用 require() 函数导入模块
    '@typescript-eslint/no-empty-function': 'off', // 禁止空函数
    'no-use-before-define': 'off', // 禁止在 函数/类/变量 定义之前使用它们
    '@typescript-eslint/no-use-before-define': 'off', // 禁止在变量定义之前使用它们
    '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
    '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'space-before-function-paren': 'off', // 关闭函数定义时括号前面不能有空格校验

    'vue/no-v-model-argument': 'off',
    'vue/no-reserved-component-names': 'off', // 不允许在组件定义中使用保留名称
    'vue/attributes-order': 'off', // 关闭强制对组件属性进行排序的校验
    'vue/one-component-per-file': 'off', // 一个文件只允许包含一个组件
    'vue/no-multiple-template-root': 'off', // 关闭模板下面只允许有一个节点
    'vue/max-attributes-per-line': 'off',
    'vue/multiline-html-element-content-newline': 'off', // 关闭多行元素的内容之前和之后强制实施换行符的校验
    'vue/singleline-html-element-content-newline': 'off', // 关闭强制在单行元素的内容之前和之后使用换行符的校验
    'vue/require-default-prop': 'off', // 此规则要求为每个 prop 为必填时，必须提供默认值
    'vue/require-explicit-emits': 'off',
    'vue/html-closing-bracket-newline': 'off', // 在标签的右括号之前要求或禁止换行
    'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式：my-prop="prop"
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'no-undef': 'off',
    'no-unused-vars': 'warn', // 禁止出现未使用过的变量
    'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
    'vue/no-v-html': 'off', // 禁止使用 v-html

    '@typescript-eslint/no-unused-vars': 'warn', // 警告定义未使用的变量
    'prettier/prettier': 'error', // 禁止使用prettier
    'vue/custom-event-name-casing': 'error', // 为自定义事件名称强制使用特定大小写
    '@typescript-eslint/ban-ts-comment': 'error', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效
    // 结尾必须有分号;
    semi: [
      'error',
      'always',
      {
        omitLastInOneLineBlock: true,
      },
    ],
  },
};
