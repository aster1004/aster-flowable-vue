/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-18 10:22:50
 * @FilePath: \aster-flowable-vue\src\utils\workflow.ts
 * @Description: 工作流工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

/**
 * @description: 生成字段id
 * @return {*} 字段id
 */
export const generateFieldId = () => {
  return (
    'field' +
    (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString() +
    new Date().getTime().toString().substring(5)
  );
};

/**
 * @description: 删除表单组件
 * @param {any[]} formComponents 表单组件
 * @param {number} index 索引
 * @return {*}
 */
export const deleteFormComponent = (formComponents: any[], index: number) => {
  formComponents.splice(index, 1);
};
