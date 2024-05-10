/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-18 10:22:50
 * @FilePath: \aster-flowable-vue\src\utils\workflow.ts
 * @Description: 工作流工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { isEmpty } from '.';
import { evaluate } from './formula';

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
) => {
  items.forEach((item) => {
    // 若是一行多列则取子组件
    if (item.name === 'GridLayout') {
      formulaItemTree(item.props.items, tree);
    } else if (excludeField(item)) {
      // 排除不需要的组件
      tree.push({
        fieldId: item.id,
        label: item.title,
        value: item.id,
      });
    } else if (item.name === 'TableList' && isTableList) {
      // 明细表
      let children: WorkComponent.formulaNode[] = [];
      item.props.columns.forEach((col) => {
        children.push({
          fieldId: col.id,
          label: `${item.title}.${col.title}`,
          value: `${item.id}[?].${col.id}`,
        });
      });
      tree.push({
        fieldId: item.id,
        label: '明细表.' + item.title,
        value: item.id,
        disabled: true,
        children: children,
      });
    }
  });
};

/**
 * @description: 获取公式中的字段
 * @param {string} formula 公式
 * @return {*}
 */
const getFieldTexts = (formula: string) => {
  if (!formula) {
    return [];
  }
  const regexp = /\[\[(.+?)\]\]/g;
  const texts = formula.match(regexp);
  let result: string[] = [];
  if (texts) {
    result = texts.map((text) => {
      return text.replace(/\[\[|]]/g, '');
    });
  }
  return result;
};

/**
 * @description: 解析公式
 * @param {string} formula 公式
 * @param {WorkComponent.formulaNode[]} formulaNodes 节点数据集
 * @return {*}
 */
export const analysisFormula = (formula: string, formulaNodes: WorkComponent.formulaNode[]) => {
  if (!formula) {
    return formula;
  }
  const fieldTexts = getFieldTexts(formula);
  let result = formula;
  formulaNodes.forEach((node) => {
    fieldTexts.forEach((text) => {
      if (node.label && text == node.label && node.value) {
        const label = '[[' + text + ']]';
        result = result.replace(label, node.value);
      }
    });
  });
  return result;
};

/**
 * @description: 还原公式
 * @param {string} formula 公式
 * @param {WorkComponent.formulaNode[]} formulaNodes 节点数据集
 * @return {*}
 */
export const restorationFormula = (formula: string, formulaNodes: WorkComponent.formulaNode[]) => {
  if (!formula) {
    return formula;
  }
  let result = formula;
  formulaNodes.forEach((node) => {
    if (
      node.value &&
      node.label &&
      node.label.indexOf('明细表') == -1 &&
      formula.indexOf(node.value) != -1
    ) {
      result = result.replace(node.value, '[[' + node.label + ']]');
    }
  });
  return result;
};

/**
 * @description: 计算公式
 * @param {*} expression 表达式
 * @param {*} data 数据
 * @return {*}
 */
export const evaluateFormula = (expression, data) => {
  return evaluate(expression, data, {
    evalMode: true,
  });
};

/**
 * @description: 表单项扁平化，获取根节点控件，排除布局控件
 * @param {WorkForm} source 源表单项
 * @param {WorkForm} target 目标表单项
 * @return {*}
 */
export const flatFormItems = (source: WorkForm.FormItem[], target: WorkForm.FormItem[]) => {
  source.forEach((item) => {
    if (item.name === 'GridLayout') {
      flatFormItems(item.props.items, target);
    } else {
      target.push(item);
    }
  });
};
