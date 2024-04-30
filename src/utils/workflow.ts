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

/**
 * @description: 排除不需要显示的表单组件
 * @param {WorkForm.FormItem} item 表单组件
 * @return {*}
 */
const excludeField = (item: WorkForm.FormItem) => {
  return (
    item.name !== 'ImageUpload' &&
    item.name !== 'FileUpload' &&
    item.name !== 'Description' &&
    item.name !== 'TextareaInput' &&
    item.name !== 'DynamicData' &&
    item.name !== 'DynamicDataMultiple' &&
    item.name !== 'SubProcess' &&
    item.name !== 'TableSubProcess' &&
    item.name !== 'TableList' &&
    item.name !== 'WebIframe' &&
    item.name !== 'VueContainer' &&
    item.name !== 'ProcessIndex'
  );
};

/**
 * @description: 获取表单组件的公式树
 * @param {WorkForm.FormItem[]} items 表单组件
 * @param {WorkComponent.formulaNode[]} tree 表单组件的公式树
 * @param {boolean} isTableList 是否是明细表
 * @param {string} variable 表单变量名
 * @return {*}
 */
export const formulaItemTree = (
  items: WorkForm.FormItem[],
  tree: WorkComponent.formulaNode[],
  isTableList: boolean = false,
  variableName: string = 'formData',
) => {
  items.forEach((item) => {
    // 若是一行多列则取子组件
    if (item.name === 'SpanLayout') {
      formulaItemTree(item.props.items, tree);
    } else if (excludeField(item)) {
      // 排除不需要的组件
      tree.push({
        fieldId: item.id,
        label: item.title,
        value: variableName + '.' + item.id,
      });
    } else if (item.name === 'TableList' && isTableList) {
      // 明细表
      let children: WorkComponent.formulaNode[] = [];
      item.props.columns.forEach((col) => {
        children.push({
          fieldId: col.id,
          label: `${item.title}.${col.title}`,
          value: variableName + `.${item.id}[?].${col.id}`,
        });
      });
      tree.push({
        fieldId: item.id,
        label: '明细表.' + item.title,
        value: variableName + '.' + item.id,
        disabled: true,
        children: children,
      });
    }
  });
};
