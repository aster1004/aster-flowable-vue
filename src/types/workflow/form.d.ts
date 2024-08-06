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
   * @description: 表单扩展信息
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
   * @description: 表单配置
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
   * @description: 功能按钮接口
   */
  export interface FunctionButton {
    id: string;
    title: string;
    icon: string;
    click: any;
  }

  /**
   * @description: 列表设置信息
   */
  export interface FormListSettings {
    // 查询条件
    queryItems: WorkComponent.ComponentConfig[];
    // 列表字段
    columns: WorkComponent.ComponentConfig[];
    // 排序字段
    sortBy?: string;
    // 排序方向: asc-升序,desc-降序
    sortDirection?: string;
    // 功能
    actions?: FunctionButton[];
  }

  /**
   * @description: 表单基础信息
   */
  export interface BaseInfo {
    // id
    id?: string;
    // 表单编码
    code?: string;
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
    // 数据标题
    dataTitle?: string[];
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

  /**
   * @description: 分页查询参数
   */
  export interface FormParams extends Page.ReqPage {
    id?: string;
    code?: string;
    appId?: string;
    formName?: string;
    [key: string]: any;
  }

  /**
   * @description: 查询参数
   */
  export interface QueryParams {
    id?: string;
    code?: string;
    formName?: string;
    appId?: string;
    processDefId?: string;
    version?: string;
    status?: string;
  }

  /**
   * @description: 列表设置信息
   */
  export interface FormProcess {
    tableId: string;
    directorMaxLevel: number;
    flowPermission: [];
    nodeConfig: {
      id: string;
      parentId: string | null;
      nodeName: string;
      type: 0;
      priorityLevel: string;
      settype: string;
      selectMode: string;
      selectRange: string;
      directorLevel: string;
      examineMode: string;
      noHanderAction: string;
      examineEndDirectorLevel: string;
      ccSelfSelectFlag: string;
      nodeUserList: [];
      childNode: {};
      conditionNodes: [];
      formPermission?: [];
      buttonPermission?: any[];
    };
  }

  /**
   * @description: 表单信息
   */
  export interface FormModel extends BaseInfo {
    // 表单扩展配置
    settings?: FormSettings;
    // 表单配置
    formConfig?: FormConfig;
    // 表单项
    formItems: WorkComponent.ComponentConfig[];
    // 流程
    process: FormProcess;
    // 流程配置
    processConfig?: string;
    // 列表配置
    listSettings: FormListSettings;
  }

  /**
   * @description: 附件
   */
  export interface FileModel {
    name: string;
    url: string;
  }

  /**
   * @description: 地理位置
   */
  export interface GeoPositionModel {
    // 地址
    address: string;
    // 经度
    longitude: number;
    // 纬度
    latitude: number;
    // 区域编码
    adcode?: string;
  }
}
