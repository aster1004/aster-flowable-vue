/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-18 10:22:50
 * @FilePath: \aster-flowable-vue\src\utils\workflow.ts
 * @Description: 工作流工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { ValueType } from '@/views/workflow/components/component-config-export';
import { ElMessage } from 'element-plus';
import moment, { Moment } from 'moment';
import { generateUUID, isEmpty, isNotEmpty, isObject } from '.';
import { evaluate, parse } from './formula';
import { ApprovalModeEnum, FormPermissionEnum, ProcessButtonTypeEnum } from '@/enums/workFlowEnum';

/**
 * @description: 生成字段id
 * @return {*} 字段id
 */
export const generateFieldId = (prefix = 'field') => {
  return (
    prefix +
    (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString() +
    new Date().getTime().toString().substring(5)
  );
};

/**
 * @description: 生成流程图节点id
 * @return {*} 点id
 */
export const getRandomId = () => {
  return `node_${new Date().getTime().toString().substring(5)}${Math.round(
    Math.random() * 9000 + 1000,
  )}`;
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
 * @description: 删除表单组件的验证规则
 * @param {WorkComponent.ComponentConfig[]} formItems 表单组件
 * @param {string} fieldId 字段id
 * @param {WorkComponent.ComponentConfig} tableItem 明细表列
 * @return {*} true-可删除,false-不可删除
 */
export const deleteComponentValidate = (
  formItems: WorkComponent.ComponentConfig[],
  fieldId: string,
  tableItem?: WorkComponent.ComponentConfig,
) => {
  // 获取含有currentId的组件
  const filterItems = flatFormItems(formItems).filter((item) => {
    // 跳过当前明细表
    if (tableItem && tableItem.id === item.id) {
      return false;
    }
    const itemStr = JSON.stringify(item);
    if (item.id != fieldId && itemStr.indexOf(fieldId) > -1) {
      return true;
    } else {
      return false;
    }
  });
  // 若有其他组件含有currentId，则不可删除
  if (filterItems.length > 0) {
    const itemTitles = filterItems.map((item) => '`' + item.title + '`').join(',');
    ElMessage.warning(`${itemTitles}中引用了该控件，不可删除`);
    return false;
  } else if (tableItem) {
    const filterCols = tableItem.props.columns.filter((item) => {
      const itemStr = JSON.stringify(item);
      if (item.id != fieldId && itemStr.indexOf(fieldId) > -1) {
        return true;
      } else {
        return false;
      }
    });
    if (filterCols.length > 0) {
      const itemTitles = filterCols.map((item) => '`' + item.title + '`').join(',');
      ElMessage.warning(`${tableItem.title}[${itemTitles}]中引用了该控件，不可删除`);
      return false;
    }
    return true;
  } else {
    return true;
  }
};

/**
 * @description: 循环调用验证
 * @param {string} formula 公式字符串
 * @param {string} currentFieldId 当前字段id
 * @param {WorkComponent.ComponentConfig[]} formItems 表单组件
 * @return {*}
 */
export const loopCallValidate = (
  formula: string,
  currentFieldId: string,
  formItems: WorkComponent.ComponentConfig[],
) => {
  // 正则表达式匹配字段id(field+13位数字)
  const regex = /field\d{13}/g;
  const matches: string[] | null = formula.match(regex);
  // 若没有匹配到，则直接返回true
  if (!matches || matches.length === 0) {
    return true;
  }
  // 循环调用组件的标题
  const loops: string[] = [];
  // 若有匹配则需判断是否循环调用
  const items = flatFormItems(formItems);
  matches
    .filter((fieldId, index) => fieldId != currentFieldId && matches.indexOf(fieldId) === index)
    .forEach((fieldId) => {
      items.forEach((item) => {
        // 如果目标组件的配置中引用了当前组件的id则是循环调用
        if (
          item.id === fieldId &&
          item.props.default &&
          item.props.default.type === 'formula' &&
          item.props.default.value.indexOf(currentFieldId) > -1
        ) {
          loops.push('`' + item.title + '`');
        }
      });
    });

  if (isNotEmpty(loops)) {
    ElMessage.warning(`${loops.join(',')}中引用了该控件，不可循环调用`);
    return false;
  } else {
    return true;
  }
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
    item.name !== 'SignatureCombine' &&
    item.name !== 'AssociatedProperty' &&
    item.name !== 'CalcFormula' &&
    item.name !== 'SummaryFormula'
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
 * @description: 获取表单组件列表,不获取明细表组件,用于流程设计的条件分支
 * @param items
 * @param nodes
 */
export const formItemList = (
  items: WorkComponent.ComponentConfig[],
  nodes: WorkComponent.ComponentConfig[],
) => {
  items.forEach((item) => {
    // 若是一行多列则遍历items,取子组件
    if (item.name === 'GridLayout') {
      item.props.items.forEach((col) => {
        formItemList(col, nodes);
      });
    } else if (item.name === 'GridTitle') {
      // 若是分组标题则取子组件
      formItemList(item.props.items, nodes);
    } else if (excludeComponent(item)) {
      // 排除不需要的组件
      nodes.push(item);
    }
  });
};
/**
 * @description: 获取公式中的字段
 * @param {string} formula 公式
 * @return {*}
 */
const getFieldTexts = (formula: string, type = '[]') => {
  if (!formula) {
    return [];
  }
  let regexp = /\[\[(.+?)\]\]/g;
  let replaceRegexp = /\[\[|]]/g;
  if (type == '[]') {
    regexp = /\[\[(.+?)\]\]/g;
    replaceRegexp = /\[\[|]]/g;
  } else if (type == '{}') {
    regexp = /\{\{(.+?)\}\}/g;
    replaceRegexp = /\{\{|}}/g;
  }
  const texts = formula.match(regexp);
  let result: string[] = [];
  if (texts) {
    result = texts.map((text) => {
      return text.replace(replaceRegexp, '');
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
 * @description: 解析关联表单公式
 * @param {string} formula 公式
 * @param {WorkComponent.formulaNode[]} associatedNodes 关联表单数据项
 * @param {WorkComponent.formulaNode[]} currentNodes 当前表单数据项
 * @return {*}
 */
export const analysisAssociatedFormula = (
  formula: string,
  associatedNodes: WorkComponent.formulaNode[],
  currentNodes: WorkComponent.formulaNode[],
) => {
  if (!formula) {
    return formula;
  }
  let fieldTexts = getFieldTexts(formula);
  let result = formula;
  associatedNodes.forEach((node) => {
    fieldTexts.forEach((text) => {
      if (node.label && text == node.label && node.value) {
        const label = '[[' + text + ']]';
        result = result.replace(label, node.value);
      }
    });
  });

  fieldTexts = getFieldTexts(result, '{}');
  currentNodes.forEach((node) => {
    fieldTexts.forEach((text) => {
      if (node.label && text == node.label && node.value) {
        const label = '{{' + text + '}}';
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
 * @description: 还原关联表单公式
 * @param {string} formula 公式
 * @param {WorkComponent.formulaNode[]} associatedNodes 关联表单数据项
 * @param {WorkComponent.formulaNode[]} currentNodes 当前表单数据项
 * @return {*}
 */
export const restorationAssociatedFormula = (
  formula: string,
  associatedNodes: WorkComponent.formulaNode[],
  currentNodes: WorkComponent.formulaNode[],
) => {
  if (!formula) {
    return formula;
  }
  let result = formula;
  associatedNodes.forEach((node) => {
    if (node.value && node.label && formula.indexOf(node.value) != -1) {
      result = result.replaceAll(node.value, '[[' + node.label + ']]');
    }
  });
  currentNodes.forEach((node) => {
    if (node.value && node.label && formula.indexOf(node.value) != -1) {
      result = result.replaceAll(node.value, '{{' + node.label + '}}');
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
    if (item.name === 'TableList') {
      formData[item.id] = tableListDefaultValue(item);
    } else {
      formData[item.id] = item.value;
    }
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
 * @description: 明细表默认值
 * @param {WorkComponent.ComponentConfig} form
 */
const tableListDefaultValue = (formItem: WorkComponent.ComponentConfig) => {
  if (formItem.props.hasOwnProperty('rows')) {
    const rows = formItem.props.rows;
    let value: any[] = [];
    for (let i = 0; i < rows; i++) {
      let rowData = {
        id: generateUUID(),
      };
      setDefaultValue(formItem.props.columns, rowData);
      value.push(rowData);
    }
    return value;
  } else {
    return formItem.value;
  }
};

/**
 * @description: 设置表单项权限
 * @param {WorkComponent.ComponentConfig[]} formItems 表单项
 * @param {Process.FormPermissionModel} formPermission 表单项权限
 * @param {string} nodeType 节点类型 root-发起人 task-任务节点
 * @return {*}
 */
export const setFormPermission = (
  formItems: WorkComponent.ComponentConfig[],
  formPermission: Process.FormPermissionModel,
  nodeType = 'root',
) => {
  formItems.forEach((item) => {
    if (item.name === 'GridLayout') {
      item.props.items.forEach((col) => {
        setFormPermission(col, formPermission, nodeType);
      });
    } else if (item.name === 'GridTitle') {
      setFormPermission(item.props.items, formPermission, nodeType);
    } else if (item.name === 'TableList') {
      if (formPermission.hasOwnProperty(item.id) && formPermission[item.id].length > 0) {
        item.operation = formPermission[item.id];
      } else {
        item.operation = [
          nodeType === 'root' ? FormPermissionEnum.EDIT : FormPermissionEnum.READONLY,
        ];
      }
      setFormPermission(item.props.columns, formPermission, nodeType);
    } else {
      if (formPermission.hasOwnProperty(item.id) && formPermission[item.id].length > 0) {
        item.operation = formPermission[item.id];
      } else {
        item.operation = [
          nodeType === 'root' ? FormPermissionEnum.EDIT : FormPermissionEnum.READONLY,
        ];
      }
    }
  });
};

/**
 * @description: 获取数据填充的表单项
 * @param {WorkComponent.ComponentConfig[]} formItems 表单项
 * @param {boolean} showTableList 是否显示明细表
 * @return {*}
 */
export const dataFillOptionsByFormItems = (
  formItems: WorkComponent.ComponentConfig[],
  showTableList: boolean = false,
) => {
  // 先排除布局控件
  const items = flatFormItems(formItems);
  let options: WorkComponent.DataFillOption[] = [];
  items
    .filter((item: WorkComponent.ComponentConfig) => {
      // 根据条件判断是否排除明细表
      if (item.name === 'TableList') {
        return showTableList;
      } else if (item.name === 'AssociatedForm') {
        // 排除关联表单
        return false;
      } else {
        return true;
      }
    })
    .map((item: WorkComponent.ComponentConfig) => {
      if (item.name === 'TableList') {
        item.props.columns.forEach((column) => {
          options.push({
            label: item.title + '.' + column.title,
            value: item.id + '.' + column.id,
            disabled: false,
            type: column.valueType,
            name: column.name,
          });
        });
      } else {
        options.push({
          label: item.title,
          value: item.id,
          disabled: false,
          type: item.valueType,
          name: item.name,
        });
      }
    });
  return options;
};

/**
 * @description: 筛选数据填充项,将filter的值填充给target
 * @param {string} filterType 过滤类型
 * @param {string} filterName 过滤名称
 * @param {string} targetType 目标类型
 * @param {string} targetName 目标名称
 * @return {*}
 */
export const filterDataFillOptionsFilter = (
  filterType: string,
  filterName: string,
  targetType: string,
  targetName: string,
) => {
  if (filterType === ValueType.string) {
    return targetType === ValueType.string;
  } else if (
    filterType === ValueType.number ||
    filterType === ValueType.date ||
    filterType == ValueType.dateRange
  ) {
    return (
      targetType === filterType || targetName === 'InputText' || targetName === 'InputTextarea'
    );
  } else if (filterType === ValueType.array || filterType === ValueType.object) {
    return targetName == filterName || targetName === 'InputText' || targetName === 'InputTextarea';
  } else if (filterType === ValueType.user || filterType === ValueType.dept) {
    return targetName == filterName;
  } else {
    return false;
  }
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
    return formItem.value;
  }
  // 特殊处理创建人员和所属部门
  if (formItem.id === 'create_by' || formItem.id === 'create_by_org') {
    return Array.isArray(value) ? value : [value];
  }
  if (formItem.valueType === ValueType.string) {
    return value;
  } else if (formItem.valueType === ValueType.number) {
    return isNotEmpty(value) ? Number(value) : null;
  } else if (formItem.valueType === ValueType.date) {
    return isNotEmpty(value) && value.length > 1 ? value.replace('T', ' ') : null;
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

/**
 * @description: 是否可以将源组件的值转为目标组件的值
 * @param {WorkComponent.ComponentConfig} source 源组件
 * @param {WorkComponent.ComponentConfig} target 目标组件
 * @return {*}
 */
export const isConvertItemValue = (
  source: WorkComponent.ComponentConfig,
  target: WorkComponent.ComponentConfig,
) => {
  if (target.name === source.name) {
    return true;
  }
  if (target.name === 'TableList' || source.name === 'TableList') {
    return false;
  }
  if (target.valueType === ValueType.string) {
    return source.valueType != ValueType.user && source.valueType != ValueType.dept;
  }
  if (target.valueType === ValueType.number) {
    return source.valueType === ValueType.number;
  }
  if (target.valueType === ValueType.date) {
    return source.valueType === ValueType.date;
  }
  if (target.valueType === ValueType.dateRange) {
    return source.valueType === ValueType.dateRange;
  }
  return false;
};

export const getInstanceNodeResult = (instanceList: WorkForm.InstanceLogsList) => {
  if (instanceList.length === 1) {
    const instance = instanceList[0];
    // 判断是不是抄送
    if (instance.type === '2') {
      return {
        nodeName: instance.nodeName, //节点名称
        startTime: dateFormat(instance.startTime, 'MM-DD HH:mm'), // 开始时间
        text: '(系统)', //办理人
        result: '抄送', // 处理结果
      };
    } else if (instance.type === '8') {
      // 子流程
      return {
        nodeName: instance.nodeName, //节点名称
        startTime: dateFormat(instance.startTime, 'MM-DD HH:mm'), // 开始时间
        text: '(子流程)', //办理人
        result: instance.remark, // 处理结果
      };
    } else {
      return {
        nodeName: instance.nodeName, //节点名称
        startTime: dateFormat(instance.startTime, 'MM-DD HH:mm'), // 开始时间
        text: isNotEmpty(instance.user?.realName)
          ? instance.user?.realName
          : instance.user?.nickName, //办理人
        result: getTaskResult(instance).text, // 处理结果
      };
    }
  } else {
    // 通过第一个数据判断会签类型、任务状态以及整个节点的状态
    const instance = instanceList[0];
    console.log(instance);

    //判断当前会签任务是否全部完成
    let textVar = instance.approveType === ApprovalModeEnum.AND ? '会签' : '或签';
    let nodeName = '';
    let startTime = '';
    let result2 = '';
    // 获取instanceList finishTime 不为空并且approveResult 不为空的数组并返回最后一个
    const finishTime = instanceList
      .filter((item) => {
        return isNotEmpty(item.finishTime) && isNotEmpty(item.approveResult);
      })
      .pop();
    if (finishTime) {
      nodeName = finishTime.nodeName;
      startTime = dateFormat(finishTime.startTime, 'MM-DD HH:mm');
      textVar = instanceList.length + '人' + textVar;
      result2 = getTaskResult(finishTime).text;
    } else {
      nodeName = instance.nodeName;
      startTime = dateFormat(instance.startTime, 'MM-DD HH:mm');
      textVar = instanceList.length + '人' + textVar;
      result2 = '处理中';
    }
    return { text: textVar, result: result2, nodeName: nodeName, startTime: startTime };
  }
};
export const getTaskResult = (instance) => {
  if (instance.nodeId === 'root') {
    return { text: '提交', type: 'success', icon: 'icon-tongyi', color: '#F78F5F' };
  } else {
    if (instance.approveResult === ProcessButtonTypeEnum.AGREEN) {
      return { text: '同意', type: 'success', icon: 'icon-tongyi', color: '#35B881' };
    } else if (instance.approveResult === ProcessButtonTypeEnum.DISAGREE) {
      return { text: '不同意', type: 'danger', icon: 'icon-jujue1', color: '#F56C6C' };
    } else if (instance.approveResult === ProcessButtonTypeEnum.FORWARD) {
      return { text: '转交', type: 'primary', icon: 'icon-zhuanjiao1', color: '#409EFF' };
    } else if (instance.approveResult === ProcessButtonTypeEnum.RECALL) {
      return { text: '退回', type: 'danger', icon: 'icon-jurassic_last', color: '#F56C6C' };
    } else if (instance.approveResult === ProcessButtonTypeEnum.REVOKE && instance.finishTime) {
      return { text: '撤销', type: 'info', icon: 'icon-guanbi1', color: '#E4E4E4' };
    } else if (instance.approveResult === ProcessButtonTypeEnum.AUTO_REJECT) {
      return { text: '自动拒绝', type: 'danger', icon: 'icon-jujue1', color: '#F56C6C' };
    } else if (instance.approveResult === ProcessButtonTypeEnum.AUTO_PASS) {
      return { text: '自动通过', type: 'primary', icon: 'icon-tongyi', color: '#409EFF' };
    } else if (!instance.approveResult && instance.finishTime) {
      return { text: '自动通过', type: 'primary', icon: 'icon-tongyi', color: '#409EFF' };
    } else {
      return { text: '处理中', type: 'warning', icon: 'icon-chulizhong', color: '#F78F5F' };
    }
  }
};

/**
 * 通过审批类型获取审批名称
 * @param approveTyp
 */
export const getApproveName = (approveType: string) => {
  if (approveType === ProcessButtonTypeEnum.AGREEN) {
    return '同意';
  } else if (approveType === ProcessButtonTypeEnum.DISAGREE) {
    return '不同意';
  } else if (approveType === ProcessButtonTypeEnum.FORWARD) {
    return '转交';
  } else if (approveType === ProcessButtonTypeEnum.RECALL) {
    return '退回';
  } else if (approveType === ProcessButtonTypeEnum.REVOKE) {
    return '撤销';
  } else if (approveType === ProcessButtonTypeEnum.AFTERADDSIGN) {
    return '加签';
  } else {
    return '处理中';
  }
};
/**
 * 对日期、日期字符串、时间戳进行格式化
 *
 * 示例：
 *
 * DATETOSTR('12/25/2022', 'YYYY-MM-DD') 得到 '2022.12.25'
 * DATETOSTR(1676563200, 'YYYY.MM.DD') 得到 '2023.02.17'
 * DATETOSTR(1676563200000, 'YYYY.MM.DD hh:mm:ss') 得到 '2023.02.17 12:00:00'
 * DATETOSTR(DATE('2021-12-21'), 'YYYY.MM.DD hh:mm:ss') 得到 '2021.12.21 08:00:00'
 *
 * @example DATETOSTR(date, 'YYYY-MM-DD')
 * @namespace 日期函数
 * @param {any} date 日期对象、日期字符串、时间戳
 * @param {string} format 日期格式，默认为 "YYYY-MM-DD HH:mm:ss"
 *
 * @returns {string} 日期字符串
 */
export const dateFormat = (
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss',
) => {
  if (isNotEmpty(date)) {
    date = normalizeDate(date);
    return moment(date).format(format);
  } else {
    return '';
  }
};
const normalizeDate = (raw: any): Date => {
  if (typeof raw === 'string' || typeof raw === 'number') {
    let formats = ['', 'YYYY-MM-DD HH:mm:ss', 'X'];

    if (/^\d{10}((\.\d+)*)$/.test(raw.toString())) {
      formats = ['X', 'x', 'YYYY-MM-DD HH:mm:ss', ''];
    } else if (/^\d{13}((\.\d+)*)$/.test(raw.toString())) {
      formats = ['x', 'X', 'YYYY-MM-DD HH:mm:ss', ''];
    }
    while (formats.length) {
      const format = formats.shift()!;
      const date = moment(raw, format);

      if (date.isValid()) {
        return date.toDate();
      }
    }
  }

  return raw;
};
export const unSupportType = (node: WorkComponent.ComponentConfig) => {
  return [
    'SelectMultiple', //下拉多选
    'UploadImage', //上传图片
    'UploadFile', //上传附件
    'AssociatedForm', // 关联表单
    'GeoLocation', //地理位置
    'Area', //行政区划
    'Signature', //手写签名
    'SignatureCombine', // 签章
    'AssociatedProperty', //关联属性
    'DateTime', //日期时间
    'DateTimeRange', //日期区间
  ].includes(node.name);
};
