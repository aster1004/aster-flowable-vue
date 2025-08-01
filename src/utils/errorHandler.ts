/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-15 14:47:59
 * @FilePath: \aster-flowable-vue\src\utils\errorHandler.ts
 * @Description: error配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { ElNotification } from 'element-plus';

/**
 * @description 全局代码错误捕捉
 * */
const errorHandler = (error: any) => {
  // 过滤 HTTP 请求错误
  if (error.status || error.status == 0) return false;
  const errorMap: { [key: string]: string } = {
    InternalError: 'Javascript引擎内部错误',
    ReferenceError: '未找到对象',
    TypeError: '使用了错误的类型或对象',
    RangeError: '使用内置对象时，参数超范围',
    SyntaxError: '语法错误',
    EvalError: '错误的使用了Eval',
    URIError: 'URI错误',
  };
  const errorName = errorMap[error.name] || '未知错误';
  ElNotification({
    title: errorName,
    message: error,
    type: 'error',
    duration: 3000,
  });
};

export default errorHandler;
