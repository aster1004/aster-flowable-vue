/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-17 14:00:38
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\component-config-export.ts
 * @Description: 表单组件配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

const ValueType = {
  string: 'String',
  object: 'Object',
  array: 'Array',
  number: 'Number',
  date: 'Date',
  user: 'User',
  dept: 'Dept',
  dateRange: 'DateRange',
};

/**
 * @description: 布局组件配置
 */
const layoutComponentConfig: WorkComponent.ComponentConfigGroup = {
  title: '布局控件',
  components: [
    {
      title: '分组标题',
      name: 'GridTitle',
      icon: 'iconfont icon-title',
      value: {},
      valueType: ValueType.object,
      props: {
        title: '分组标题',
        alignment: 'left',
      },
    },
    {
      title: '一行多列',
      name: 'SpanLayout',
      icon: 'iconfont icon-Columns',
      value: [],
      valueType: ValueType.array,
      props: {
        items: [],
        number: 2,
      },
    },
    {
      title: '明细表',
      name: 'TableList',
      icon: 'iconfont icon-biaoge',
      value: [],
      valueType: ValueType.array,
      props: {
        required: false,
        showBorder: true,
        rowLayout: true,
        showSummary: false,
        summaryColumns: [],
        maxSize: 0, //最大条数，为0则不限制
        columns: [], //列设置
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '描述说明',
      name: 'Description',
      icon: 'iconfont icon-help',
      value: '',
      valueType: ValueType.string,
      props: {
        required: false,
        color: '#818181',
        // 隐藏
        hidden: '',
      },
    },
  ],
};

/**
 * @description: 基础组件配置
 */
const baseComponentConfig: WorkComponent.ComponentConfigGroup = {
  title: '基础控件',
  components: [
    {
      title: '单行文本',
      name: 'InputText',
      icon: 'iconfont icon-danhangwenben',
      value: '',
      valueType: ValueType.string,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 提示语
        placeholder: '',
      },
    },
    {
      title: '多行文本',
      name: 'InputTextarea',
      icon: 'iconfont icon-duohangwenben',
      value: '',
      valueType: ValueType.string,
      props: {
        required: false,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '数字',
      name: 'InputNumber',
      icon: 'iconfont icon-shuzi',
      value: 0,
      valueType: ValueType.number,
      props: {
        required: false,
        precision: 0,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '金额',
      name: 'InputMoney',
      icon: 'iconfont icon-jine',
      value: 0,
      valueType: ValueType.number,
      props: {
        required: false,
        showChinese: true,
        precision: 0,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '单选框',
      name: 'SelectSingle',
      icon: 'iconfont icon-danxuankuang',
      value: '',
      valueType: ValueType.string,
      props: {
        required: false,
        expanding: false,
        options: ['选项1', '选项2'],
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '复选框',
      name: 'SelectMultiple',
      icon: 'iconfont icon-fuxuankuang',
      value: [],
      valueType: ValueType.array,
      props: {
        required: false,
        expanding: false,
        options: ['选项1', '选项2'],
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '日期',
      name: 'DateTime',
      icon: 'iconfont icon-riqi',
      value: '',
      valueType: ValueType.date,
      props: {
        required: false,
        format: 'yyyy-MM-dd',
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '日期范围',
      name: 'DateTimeRange',
      icon: 'iconfont icon-riqifanwei',
      value: [],
      valueType: ValueType.dateRange,
      props: {
        required: false,
        placeholder: ['开始时间', '结束时间'],
        format: 'yyyy-MM-dd',
        showLength: false,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '图片',
      name: 'ImageUpload',
      icon: 'iconfont icon-tupian',
      value: [],
      valueType: ValueType.array,
      props: {
        required: false,
        maxSize: 10, //图片最大大小MB
        maxNumber: 5, //最大上传数量
        enableZip: true, //图片压缩后再上传
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '附件',
      name: 'FileUpload',
      icon: 'iconfont icon-fujian',
      value: [],
      valueType: ValueType.array,
      props: {
        required: false,
        onlyRead: false, //是否只读，false只能在线预览，true可以下载
        maxSize: 100, //文件最大大小MB
        maxNumber: 10, //最大上传数量
        fileTypes: [], //限制文件上传类型
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '人员',
      name: 'UserPicker',
      icon: 'iconfont icon-yonghu',
      value: [],
      valueType: ValueType.user,
      props: {
        required: false,
        multiple: false,
        expansion: false,
        options: [],
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '部门',
      name: 'DeptPicker',
      icon: 'iconfont icon-bumendanxuan',
      value: [],
      valueType: ValueType.dept,
      props: {
        required: false,
        multiple: false,
        expansion: false,
        options: [],
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '评分',
      name: 'Score',
      icon: 'iconfont icon-xihuan',
      value: 0,
      valueType: ValueType.number,
      props: {
        required: false,
        color: '#f0a732',
        max: 5,
        showScore: true,
        enableHalf: false,
        type: 'star',
        // 隐藏
        hidden: '',
      },
    },
  ],
};

/**
 * @description: 高级组件配置
 */
const advancedComponentConfig: WorkComponent.ComponentConfigGroup = {
  title: '高级控件',
  components: [
    {
      title: '流水号',
      name: 'CreateNumber',
      icon: 'iconfont icon-liushuihaoziduan',
      value: '',
      valueType: ValueType.string,
      props: {
        required: false,
        rules: [],
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '关联表单',
      name: 'DynamicDataMultiple',
      icon: 'iconfont icon-guanlianbiaodan',
      value: {},
      valueType: ValueType.object,
      props: {
        required: false,
        // 关联流程
        dynamicData: [],
        dynamicName: [],
        rules: [],
        filters: {
          showFormula: '', //回显用，因为包含表单字段的时候会出现表单名称
          calcFormula: '', //解析用，表单名称对应为formData.fieldxxxx
        },
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '地理位置',
      name: 'Location',
      icon: 'iconfont icon-dingwei',
      value: {},
      valueType: ValueType.object,
      props: {
        required: false,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '省市区',
      name: 'Provinces',
      icon: 'iconfont icon-shengshiqu',
      value: '',
      valueType: ValueType.string,
      props: {
        required: false,
        level: 3,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '签名',
      name: 'SignPanel',
      icon: 'iconfont icon-qianming',
      value: '',
      valueType: ValueType.string,
      props: {
        required: false,
        thickness: 2,
        color: '#000000',
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '流程关联',
      name: 'ProcessIndex',
      icon: 'iconfont icon-guanlianliucheng',
      value: [],
      valueType: ValueType.array,
      props: {
        required: false,
        processCode: null,
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '计算公式',
      name: 'CalcFormula',
      icon: 'iconfont icon-jisuangongshi',
      value: 0,
      valueType: ValueType.number,
      props: {
        precision: 0,
        required: false,
        isPlus: false,
        jsCode: '',
        explain: [],
        // 隐藏
        hidden: '',
      },
    },
    {
      title: '计算公式(高级)',
      name: 'CustomInput',
      icon: 'iconfont icon-hanshu',
      value: '',
      valueType: ValueType.string,
      props: {
        precision: 0,
        required: false,
        isPlus: false,
        jsCode: '',
        explain: [],
        // 隐藏
        hidden: '',
      },
    },
  ],
};

/**
 * @description: 组件配置导出
 */
export const componentConfigExport: WorkComponent.ComponentConfigGroup[] = [
  layoutComponentConfig,
  baseComponentConfig,
  advancedComponentConfig,
];
