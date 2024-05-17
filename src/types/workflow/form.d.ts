/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-09 16:05:08
 * @FilePath: \aster-flowable-vue\src\types\workflow\form.d.ts
 * @Description: 工作流表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace WorkForm {
  declare type FormDataModel = {
    [key: string]: any;
  };

  declare type FormRuleModel = {
    [key: string]: Array<any>;
  };

  declare type FormMapModel = {
    [key: string]: any;
  };

  /**
   * 表单扩展信息
   */
  export interface FormSettings {
    // 启用签批
    enableSign?: boolean;
    // 启用撤回
    enableCancel?: boolean;
    // 表单管理者
    managers?: string[];
    // 消息提醒
    notify?: {
      title?: string;
      types?: string[];
    };
  }

  /**
   * 表单配置
   */
  export interface FormConfig {
    // 表单业务规则
    formBusinessRules?: [];
    // 表单提交规则
    formSubmitRules?: [];
    // 表单验证规则
    formValidateRules?: [];
    // 表单布局
    labelPos?: string;
    // 表单标签宽度
    labelWidth?: string;
    ruleJs?: string;
    ruleType?: string;
    rules?: FormRuleModel[];
  }

  /**
   * 表单项
   */
  export interface FormItem {
    // 图标
    icon: string;
    // 表单项ID
    id: string;
    // 表单项名称
    name: string;
    // 权限
    perm: string;
    // 表单项属性
    props: FormMapModel;
    // 表单项标题
    title: string;
    // 表单项值
    value: any;
    // 表单项值类型
    valueType: string;
  }

  /**
   * 表单基础信息
   */
  export interface BaseInfo {
    // id
    id?: string;
    // 表单id
    formId?: string;
    // 表单名称
    formName: string;
    // 表单图标
    icon: string;
    // 图标颜色
    iconColor: string;
    // 标签位置
    labelPosition: string;
    // 标签宽度,默认80px
    labelWidth: number;
    // 所属应用
    appId?: string;
    // 版本
    version?: number;
    // 流程定义id
    processDefId?: string;
    // 排序
    sort?: number;
    // 状态
    status?: string;
    // 备注
    remark?: string;
  }

  export interface FormParams extends Page.ReqPage {
    appId?: string;
    formName?: string;
  }

  /**
   * 表单信息
   */
  export interface FormModel extends BaseInfo {
    // 表单扩展配置
    settings?: FormSettings;
    // 表单配置
    formConfig?: FormConfig;
    // 表单项
    formItems: Array<FormItem>;
    // 流程
    process?: object;
    // 流程配置
    processConfig?: string;
    // 动态搜索
    dynamicSearch?: string;
  }
}
