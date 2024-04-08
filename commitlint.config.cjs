/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-03 10:44:12
 * @FilePath: \aster-admin\commitlint.config.cjs
 * @Description: git commit 格式校验
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

const types = [
  // 项目初始化
  'init',
  // 添加新特性
  'feat',
  // 修复bug
  'fix',
  // 仅仅修改文档
  'docs',
  // 仅仅修改了空格、格式缩进、逗号等，不改变代码逻辑，不修改css样式更改
  'style',
  // 代码重构，没有新增功能或修复bug
  'refactor',
  // 优化相关，比如提升性能、体验
  'perf',
  // 增加测试用例
  'test',
  // 依赖相关内容
  'build',
  // ci配置相关，例如对k8s,docker的配置文件的修改
  'ci',
  // 改变构建流程，或增加依赖库、工具等
  'chore',
  // 回滚到上一个版本
  'revert',
];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 校验规则
  rules: {
    'type-enum': [2, 'always', types],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
};
