/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-17 16:01:38
 * @FilePath: \aster-flowable-vue\src\types\workflow\component.d.ts
 * @Description: 组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace WorkComponent {
  declare type PropModel = {
    [key: string]: any;
  };

  /**
   * @description: 表单组件配置
   */
  export interface ComponentConfig {
    // 组件id
    id: string;
    // 组件标题
    title: string;
    // 组件名称
    name: string;
    // 组件图标
    icon: string;
    // 组件值
    value: any;
    // 组件值类型
    valueType: any;
    // 组件属性
    props: PropModel;
    // 组件权限
    operation?: string[];
  }

  /**
   * @description: 表单组件分组配置
   */
  export interface ComponentConfigGroup {
    // 分组名称
    title: string;
    // 组件
    components: ComponentConfig[];
  }

  /**
   * @description: 公式节点
   */
  export interface formulaNode {
    // 组件id
    fieldId?: string;
    // 组件名称
    label?: string;
    // 组件值(用于公式计算)
    value?: string;
    // 是否禁用
    disabled?: boolean;
    // 子集
    children?: formulaNode[];
  }

  /**
   * @description: 树节点
   */
  export interface TreeNode {
    label: string;
    value: string;
    leaf?: boolean;
    checked?: boolean;
    disabled?: boolean;
    children?: TreeNode[];
  }

  /**
   * @description: 数据填充模型
   */
  export interface DataFillModel {
    currentFieldId: string;
    associatedFieldId: string;
  }

  /**
   * @description: 数据填充选项
   */
  export interface DataFillOption {
    label: string;
    value: string;
    disabled?: boolean;
    type: string;
    name: string;
  }

  /**
   * @description: 流水号规则
   */
  export interface SerialNumberRule {
    // 规则id
    id: string;
    // 规则类型
    type: string;
    // 规则名称
    name: string;
    // 规则值
    value: any;
    // 是否重置
    isRest?: boolean;
  }
}
