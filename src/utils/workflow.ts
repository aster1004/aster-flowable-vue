/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-18 10:22:50
 * @FilePath: \aster-flowable-vue\src\utils\workflow.ts
 * @Description: 工作流工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { evaluate, parse } from './formula';

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
 * @ description: 置空数组当前下标对应的内容
 * @param formComponents
 * @param index
 */
export const clearFormComponent = (formComponents: any[], index: number) => {
  if (index >= 0 && index < formComponents.length) {
    formComponents[index] = [];
  }
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
    // 若是一行多列则遍历items,取子组件
    if (item.name === 'GridLayout') {
      item.props.items.forEach((col) => {
        formulaItemTree(col, tree);
      });
    } else if (item.name === 'GridTitle') {
      // 若是分组标题则取子组件
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
      result = result.replaceAll(node.value, '[[' + node.label + ']]');
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
 * @description: 公式校验
 * @param {*} expression 表达式
 * @return {*}
 */
export const formulaValidate = (expression: string) => {
  try {
    expression &&
      parse(expression, {
        evalMode: true,
        allowFilter: false,
      });
    return true;
  } catch (e: any) {
    if (/\s(\d+:\d+)$/.test(e.message)) {
      const [, position] = /\s(\d+:\d+)$/.exec(e.message) || [];
      return '公式值校验错误，错误的位置/原因是 ' + position;
    }
    return e.message;
  }
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

/**
 * @description: 将数字金额转为汉字金额
 * @param {number} amount
 * @return {*}
 */
export const convertToChineseAmount = (amount: number | string) => {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟'];
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆'];
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '厘', '毫', '丝', '忽', '微'];
  // 整数金额时后面跟的字符
  const cnInteger = '整';
  // 整型完以后的单位
  const cnIntLast = '元';
  // 最大处理的数字
  let maxNum = 999999999999999.999999;
  //金额整数部分
  let integerNum;
  // 金额小数部分
  let decimalNum;
  // 输出的中文金额字符串
  let chineseStr = '';
  // 分离金额后用的数组，预定义
  let parts;
  if (amount === 0 || amount === '') {
    return '';
  }
  const money = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (money >= maxNum) {
    // 超出最大处理数字
    return '';
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  // 转换为字符串
  const moneyStr = money + '';
  if (moneyStr.indexOf('.') === -1) {
    integerNum = moneyStr;
    decimalNum = '';
  } else {
    parts = moneyStr.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        // 归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  // 小数部分
  if (decimalNum !== '') {
    let decLen = decimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1);
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum === '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
};
