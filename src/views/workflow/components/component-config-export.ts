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
      value: [],
      valueType: ValueType.object,
      props: {
        hidden: '',
        items: [],
        fontSize: 'text-base',
        fontWeight: 'font-600',
        justify: 'justify-start',
      },
    },
    {
      title: '一行多列',
      name: 'GridLayout',
      icon: 'iconfont icon-Columns',
      value: [],
      valueType: ValueType.array,
      props: {
        items: [],
        justify: 'start',
        gutter: 10,
        cols: '12,12',
      },
    },
    {
      title: '明细表',
      name: 'TableList',
      icon: 'iconfont icon-biaoge',
      value: [],
      valueType: ValueType.array,
      props: {
        // 列设置
        columns: [],
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 边框
        showBorder: true,
      },
    },
    {
      title: '描述说明',
      name: 'Description',
      icon: 'iconfont icon-help',
      value: '',
      valueType: ValueType.string,
      props: {
        hidden: '',
        color: '#818181',
        fontSize: 'text-base',
        icon: 'iconfont icon-xinxi1',
        justify: 'justify-start',
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
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 提示语
        placeholder: '',
        // 行数
        rows: 2,
      },
    },
    {
      title: '数字',
      name: 'InputNumber',
      icon: 'iconfont icon-shuzi',
      value: 0,
      valueType: ValueType.number,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 精确度
        precision: 0,
      },
    },
    {
      title: '金额',
      name: 'InputAmount',
      icon: 'iconfont icon-jine',
      value: 0,
      valueType: ValueType.number,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 精确度
        precision: 0,
        // 展示大写
        showChinese: true,
      },
    },
    {
      title: '单选框',
      name: 'SelectSingle',
      icon: 'iconfont icon-danxuankuang',
      value: '',
      valueType: ValueType.string,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 展开
        expand: false,
        // 类型 static | dict | dynamic
        type: 'static',
        // 静态选项
        options: ['选项1', '选项2'],
        // 字典类型
        dictType: '',
        // 动态配置
        dynamic: {
          label: '',
          value: '',
        },
      },
    },
    {
      title: '复选框',
      name: 'SelectMultiple',
      icon: 'iconfont icon-fuxuankuang',
      value: [],
      valueType: ValueType.array,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 展开
        expand: false,
        // 类型 static | dict | dynamic
        type: 'static',
        // 静态选项
        options: ['选项1', '选项2'],
        // 字典类型
        dictType: '',
        // 动态配置
        dynamic: {
          label: '',
          value: '',
        },
      },
    },
    {
      title: '日期',
      name: 'DateTime',
      icon: 'iconfont icon-riqi',
      value: '',
      valueType: ValueType.date,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 日期格式
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '日期范围',
      name: 'DateTimeRange',
      icon: 'iconfont icon-riqifanwei',
      value: [],
      valueType: ValueType.dateRange,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 格式
        format: 'YYYY-MM-DD',
        // 时长
        showLength: false,
      },
    },
    {
      title: '图片',
      name: 'UploadImage',
      icon: 'iconfont icon-tupian',
      value: [],
      valueType: ValueType.array,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 图片最大大小MB
        maxSize: 10,
        // 最大上传数量
        maxNumber: 5,
        // 图片压缩后再上传
        enableZip: false,
      },
    },
    {
      title: '附件',
      name: 'UploadFile',
      icon: 'iconfont icon-fujian',
      value: [],
      valueType: ValueType.array,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 附件最大大小MB
        maxSize: 100,
        // 最大上传数量
        maxNumber: 10,
        // 限制附件上传类型
        fileTypes: [],
      },
    },
    {
      title: '人员',
      name: 'UserPicker',
      icon: 'iconfont icon-yonghu',
      value: [],
      valueType: ValueType.user,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        multiple: false,
        expansion: false,
        options: [],
        placeholder: '请选择人员',
      },
    },
    {
      title: '部门',
      name: 'DeptPicker',
      icon: 'iconfont icon-bumendanxuan',
      value: [],
      valueType: ValueType.dept,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        placeholder: '请选择部门',
        readonly: false,
        multiple: false,
        expansion: false,
        options: [],
      },
    },
    {
      title: '评分',
      name: 'Rate',
      icon: 'iconfont icon-xihuan',
      value: 0,
      valueType: ValueType.number,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 颜色
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        // 最大分值
        max: 5,
        // 允许半星
        allowHalf: false,
        // 显示分值
        showScore: true,
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
      name: 'SerialNumber',
      icon: 'iconfont icon-liushuihaoziduan',
      value: '',
      valueType: ValueType.string,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        rules: [],
      },
    },
    {
      title: '关联表单',
      name: 'AssociatedForm',
      icon: 'iconfont icon-guanlianbiaodan',
      value: {},
      valueType: ValueType.object,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 关联流程
        dynamicData: [],
        dynamicName: [],
        rules: [],
        filters: {
          showFormula: '', //回显用，因为包含表单字段的时候会出现表单名称
          calcFormula: '', //解析用，表单名称对应为formData.fieldxxxx
        },
      },
    },
    {
      title: '地理位置',
      name: 'GeoLocation',
      icon: 'iconfont icon-dingwei',
      value: {},
      valueType: ValueType.object,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 提示文字
        placeholder: '请选择地理位置',
      },
    },
    {
      title: '省市区',
      name: 'Area',
      icon: 'iconfont icon-shengshiqu',
      value: '',
      valueType: ValueType.string,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        // 级别
        level: 3,
        // 提示文字
        placeholder: '请选择地区',
      },
    },
    {
      title: '签名',
      name: 'Signature',
      icon: 'iconfont icon-qianming',
      value: '',
      valueType: ValueType.string,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        thickness: 2,
        color: '#000000',
      },
    },
    {
      title: '关联流程',
      name: 'AssociatedProcess',
      icon: 'iconfont icon-guanlianliucheng',
      value: [],
      valueType: ValueType.array,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        processCode: null,
      },
    },
    {
      title: '计算公式',
      name: 'CalcFormula',
      icon: 'iconfont icon-jisuangongshi',
      value: 0,
      valueType: ValueType.number,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        precision: 0,
        isPlus: false,
        jsCode: '',
        explain: [],
      },
    },
    {
      title: '计算公式(高级)',
      name: 'CalcFormulaAdvanced',
      icon: 'iconfont icon-hanshu',
      value: '',
      valueType: ValueType.string,
      props: {
        // 必填
        required: false,
        // 隐藏
        hidden: '',
        // 只读
        readonly: false,
        precision: 0,
        isPlus: false,
        jsCode: '',
        explain: [],
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
