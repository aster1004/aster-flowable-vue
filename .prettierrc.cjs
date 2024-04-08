/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\.prettierrc.cjs
 * @Description: prettierrc配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

module.exports = {
  // 一行代码的最大字符数,默认是80,超过最大值换行
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  // 句尾添加分号
  semi: true,
  // script和style标签中开启缩进
  vueIndentScriptAndStyle: true,
  // 使用单引号
  singleQuote: true,
  // props 是否用 引号 包裹
  quoteProps: 'as-needed',
  // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  bracketSpacing: true,
  // 尾部逗号设置,es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况
  trailingComma: 'all',
  // 在jsx中使用单引号代替双引号
  jsxSingleQuote: false,
  //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
  arrowParens: 'always',
  // 插入 @format 在文件头部
  insertPragma: false,
  // 仅格式化带有 @format 、 @prettier 头的文件
  requirePragma: false,
  // "<always|never|preserve>" 文章换行,默认情况下会对你的markdown文件换行进行format会控制在printwidth以内
  proseWrap: 'never',
  // "<css|strict|ignore>" html中的空格敏感性
  htmlWhitespaceSensitivity: 'strict',
  // "<lf|crlf|cr|auto>" 行尾换行符,默认是lf
  endOfLine: 'auto',
  // 格式化代码的区间
  rangeStart: 0,
};
