/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-18 10:22:50
 * @FilePath: \aster-flowable-vue\src\utils\workflow.ts
 * @Description: 工作流工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { ValueType } from '@/views/workflow/components/component-config-export';
import moment, { Moment } from 'moment';
import { isEmpty, isNotEmpty, isObject } from '.';
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
 * @param {WorkComponent.ComponentConfig} item 表单组件
 * @return {*}
 */
const excludeComponent = (item: WorkComponent.ComponentConfig) => {
  return (
    item.name !== 'TableList' &&
    item.name !== 'Description' &&
    item.name !== 'UploadImage' &&
    item.name !== 'UploadFile' &&
    item.name !== 'GeoLocation' &&
    item.name !== 'Signature' &&
    item.name !== 'AssociatedProcess' &&
    item.name !== 'CalcFormula' &&
    item.name !== 'CalcFormulaAdvanced'
  );
};

/**
 * @description: 获取表单组件的公式树
 * @param {WorkComponent.ComponentConfig[]} items 表单组件
 * @param {WorkComponent.formulaNode[]} tree 表单组件的公式树
 * @param {boolean} isTableList 是否是明细表
 * @param {string} variable 表单变量名
 * @return {*}
 */
export const formulaItemTree = (
  items: WorkComponent.ComponentConfig[],
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
    } else if (excludeComponent(item)) {
      // 排除不需要的组件
      tree.push({
        fieldId: item.id,
        label: item.title,
        value: item.id,
      });
    } else if (item.name === 'TableList' && isTableList) {
      // 若是明细表
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
    if (node.value && node.label && formula.indexOf(node.value) != -1) {
      result = result.replaceAll(node.value, '[[' + node.label + ']]');
    }
  });
  return result;
};

/**
 * @description: 还原公式
 * @param {string} formula 公式
 * @param { WorkComponent.ComponentConfig[]} formItems 表单扁平化后的节点数据
 * @return {*}
 */
export const restorationFormulaByFormItems = (
  formula: string,
  formItems: WorkComponent.ComponentConfig[],
) => {
  if (!formula) {
    return formula;
  }
  let result = formula;
  formItems.forEach((node) => {
    if (node.id && node.name && formula.indexOf(node.id) != -1) {
      result = result.replaceAll(node.id, '[[' + node.title + ']]');
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
  if (expression.indexOf('[?]') != -1) {
    expression = expression.replaceAll('[?]', '');
  }
  try {
    expression &&
      parse(expression, {
        evalMode: true,
        allowFilter: false,
      });
    return true;
  } catch (e: any) {
    if (/\s(\d+:\d+)$/.test(e.message)) {
      // const [, position] = /\s(\d+:\d+)$/.exec(e.message) || [];
      return e.message;
    }
    return e.message;
  }
};

/**
 * @description: 表单项扁平化，排除布局控件
 * @param {WorkForm} formItems 源表单项
 * @return {*}
 */
export const flatFormItems = (formItems: WorkComponent.ComponentConfig[]) => {
  return formItems.reduce((pre, cur) => {
    if (cur.name === 'GridLayout') {
      let cols: any[] = [];
      cur.props.items.forEach((col) => {
        cols = [...cols, ...flatFormItems(col)];
      });
      return [...pre, ...cols];
    } else if (cur.name === 'GridTitle') {
      return [...pre, ...flatFormItems(cur.props.items)];
    } else {
      return [...pre, cur];
    }
  }, [] as WorkComponent.ComponentConfig[]);
};

/**
 * @description: 表单项扁平化，排除布局控件和无法筛选的控件
 * @param {WorkForm} formItems 源表单项
 * @return {*}
 */
export const flatFormItemsExclude = (formItems: WorkComponent.ComponentConfig[]) => {
  const items: WorkComponent.ComponentConfig[] = flatFormItems(formItems);
  return items.filter((item) => {
    return excludeComponent(item);
  });
};

/**
 * 获取字段id所属的表单项
 * @param fieldId 字段id
 * @param formItems 表单项
 * @returns
 */
export const selectFormItemByFieldId = (
  fieldId: string,
  formItems: WorkComponent.ComponentConfig[],
) => {
  const items = flatFormItems(formItems);
  return items.find((item) => {
    return item.id === fieldId;
  });
};

/**
 * @description: 设置默认值
 * @param {WorkComponent.ComponentConfig[]} formItems 表单项
 * @param {WorkForm.FormDataModel} formData 表单数据
 * @return {*}
 */
export const setDefaultValue = (
  formItems: WorkComponent.ComponentConfig[],
  formData: WorkForm.FormDataModel,
) => {
  const items = flatFormItems(formItems);
  // 先给所有项默认空值
  items.forEach((item) => {
    formData[item.id] = item.value;
  });
  // 处理默认值
  items.forEach((item) => {
    if (item.props.hasOwnProperty('default')) {
      const defaultObj = item.props.default;
      // 静态
      if (defaultObj.type === 'static') {
        formData[item.id] = defaultObj.value;
      } else if (defaultObj.type === 'formula') {
        // 计算公式
        formData[item.id] = evaluateFormula(defaultObj.value, formData);
      } else if (defaultObj.type === 'dynamic') {
        // TODO数据联动
        // formData[item.id] = getDynamicValue(defaultObj.value, formData);
      }
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

/**
 * @description: 获取日期选择器类型
 * @param {string} format 日期格式
 * @param {boolean} range 是否范围
 * @return {*}
 */
export const getDateTypeByFormat = (format: string, range: boolean = false) => {
  if (isEmpty(format)) {
    return 'date';
  }
  if (range) {
    if (format === 'YYYY-MM-DD') {
      return 'daterange';
    } else {
      return 'datetimerange';
    }
  } else {
    if (format === 'YYYY') {
      return 'year';
    }
    if (format === 'YYYY-MM') {
      return 'month';
    }
    if (format === 'YYYY-MM-DD HH') {
      return 'datetime';
    }
    if (format === 'YYYY-MM-DD HH:mm') {
      return 'datetime';
    }
    if (format === 'YYYY-MM-DD HH:mm:ss') {
      return 'datetime';
    }
    return 'date';
  }
};

/**
 * @description: 获取日期范围的时间长度
 * @param {string} val 日期范围
 * @param {string} format 日期格式
 * @return {*}
 */
export const getDateLength = (val: string[], format: string): string => {
  if (!Array.isArray(val) || val.length !== 2) {
    return '先选择时间哦';
  }

  const startMoment = moment(val[0]);
  const endMoment = moment(val[1]);

  if (!startMoment.isValid() || !endMoment.isValid()) {
    return '时间格式不正确，请重新选择';
  }

  const start = startMoment.format(format);
  const end = endMoment.format(format);

  if (start === end || val[0] === val[1]) {
    return '0 （时长为0，请确认）';
  }

  let years = endMoment.diff(startMoment, 'years');
  let months = endMoment.diff(startMoment, 'months');
  let days = endMoment.diff(startMoment, 'days');
  let hours = endMoment.diff(startMoment, 'hours');
  let minutes = endMoment.diff(startMoment, 'minutes');

  minutes %= 60;
  hours %= 24;
  months %= 12;

  const mstart: Moment = startMoment;
  const mend: Moment = endMoment;

  if (mstart.date() < mend.date()) {
    days = mend.date() - mstart.date();
    if ((minutes > 0 || hours > 0) && months > 0) {
      days--;
    }
  } else if (mstart.date() === mend.date()) {
    const s = moment(startMoment.format('HH:mm:ss'));
    const e = moment(endMoment.format('HH:mm:ss'));
    if (e.isBefore(s)) {
      days = 0;
    }
  }

  if (days > 31 && mend.month() - mstart.month() >= 2) {
    // 将日期推至上月求差，优化处理超过俩月且天超过31的情况
    days = mend.diff(mstart.add(mend.month() - mstart.month() - 1, 'month'), 'days');
  }

  // 格式化输出时长
  const durationFormat = (value: number, unit: string) => {
    return value > 0 ? `${value} ${unit}` : '';
  };

  return (
    '时长：' +
    durationFormat(years, '年') +
    durationFormat(months, '个月') +
    durationFormat(days, '天') +
    durationFormat(hours, '小时') +
    durationFormat(minutes, '分钟')
  );
};

/**
 * @description: 转换值类型
 * @param {WorkComponent.ComponentConfig[]} formItems 配置项
 * @param {string} key 字段id
 * @param {any} value 值
 * @return {*}
 */
export const convertDataTypes = (
  formItems: WorkComponent.ComponentConfig[],
  key: string,
  value: any,
) => {
  const formItem = selectFormItemByFieldId(key, formItems);
  if (formItem == undefined) return value;
  return convertDataType(formItem, value);
};

/**
 * @description: 转换值类型
 * @param {WorkComponent} formItem 配置项
 * @param {any} value 值
 * @return {*}
 */
export const convertDataType = (formItem: WorkComponent.ComponentConfig, value: any) => {
  if (value == undefined) {
    return '';
  }
  if (formItem.valueType === ValueType.string) {
    return value;
  } else if (formItem.valueType === ValueType.number) {
    return isNotEmpty(value) ? Number(value) : null;
  } else if (formItem.valueType === ValueType.date) {
    return isNotEmpty(value) ? value.replace('T', ' ') : null;
  } else if (formItem.valueType === ValueType.object) {
    if (typeof value === 'string' && isNotEmpty(value) && value.indexOf('{') != -1) {
      return JSON.parse(value);
    }
    return isObject(value) ? value : {};
  } else if (
    formItem.valueType === ValueType.array ||
    formItem.valueType === ValueType.user ||
    formItem.valueType === ValueType.dept ||
    formItem.valueType === ValueType.dateRange
  ) {
    if (typeof value === 'string' && isNotEmpty(value) && value.indexOf('[') != -1) {
      return JSON.parse(value);
    }
    return Array.isArray(value) ? value : [];
  } else {
    return value;
  }
};
