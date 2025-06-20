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
   * @description: 表单提交校验
   */
  export interface SubmitValidate {
    id: string;
    // 校验规则
    formula: string;
    // 错误提示
    errorMessage: string;
    // 是否启用
    enable: boolean;
  }

  /**
   * @description: 业务规则
   */
  export interface BusinessRule {
    id: string;
    // 触发事件
    event: string;
    // 目标表单
    target: { label: string; value: string; isTableList: boolean };
    // 操作类型
    operationType: string;
    // 过滤条件
    filters: { logical?: string; target: string; current: string; operator: string }[];
    // 具体操作
    operations: { target: string; current: string; operator: string }[];
    // 是否启用
    enable: boolean;
  }

  /**
   * @description: 业务规则
   */
  export interface DynamicValidateRule {
    id: string;
    // 触发事件
    event: string;
    // 触发事件文本
    eventText: string;
    // 过滤条件
    filters: {
      selfField: string;
      selfFieldText: string;
      targetField: string;
      targetFieldText: string;
      judge: string;
      equation: string;
      equationText: string;
      equationOptions: WorkComponent.TreeNode[];
      targetOptions: WorkComponent.TreeNode[];
    }[];
    // 是否启用
    enable: boolean;
    // 提示信息
    prompt?: string;
    remark?: string;
    associationForm?: string;
    associationFormText?: string;
    // 关联表单表名
    formCode?: string;
  }

  /**
   * @description: 打印模板
   */
  export interface PrintTemplate {
    id: string;
    title: string;
    templateContent: string;
  }

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
    // 提交校验
    submitValidates?: SubmitValidate[];
    // 业务规则
    businessRules?: BusinessRule[];
    // 动态校验规则
    dynamicValidateRules?: DynamicValidateRule[];
    // 关联列表
    associationList?: WorkComponent.TreeNode[];
    // 打印模板
    printTemplates?: PrintTemplate[];
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
    label: string;
    value: string;
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

  export interface NodeConfig {
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
    sbuProcessNode?: {}; // 子流程属性配置
    conditionNodes: [];
    formPermission?: [];
    buttonPermission?: ButtonPermission[];
    error?: boolean;
    errorTip: string;
  }
  export interface ButtonPermission {
    // 按钮类型，如agree
    name: string;
    // 操作名称，如同意
    operation: string;
    // 是否启用，true 为启用
    status: boolean;
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
    process: NodeConfig;
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

  export interface SignatureCombineModel {
    // 签名
    signature: string;
    // 签章
    signatureCombine: string;
    // 签章时间
    date: string;
    // 签章内容
    comment: string;
  }

  export interface AssocaitionListModel {
    id?: string;
    code?: string;
    fieldId?: string;
    associationCode?: string;
    instanceNumber?: number;
  }

  export interface AssocaitionListQuery {
    associationCode?: string;
    associationInstanceId?: string;
    code?: string;
    codes?: string[];
  }

  // 审核提交的参数
  export interface ApproveParams {
    // 任务id
    taskId?: string;
    // 审核类型,如agree，refuse
    approveType: string;
    //  手写签名,base64
    signature?: string;
    // 表单数据
    formData?: FormDataModel;

    // 表单id
    formId?: string;
    // 退回节点
    backNode?: string;
    // 转交人
    transferUser?: string;
    // 会签人
    countersignUser?: string;
    comment?: Comment;
  }
  export interface Comment {
    // 审核意见
    opinion: string;
    // 上传的图片
    imageList?: WorkForm.FileModel[];
    fileList?: WorkForm.FileModel[];
    operationType?: OperationType;
  }

  /**
   * 任务处理类型及处理过程的数据
   */
  export interface OperationType {
    // 审核类型,如agree，refuse
    approveType: string;
    // 目标id
    targetId?: string;
    // 目标名称
    targetName?: string;
    // 目标类型,user | node
    targetType?: string;
  }

  /**
   * 流程日志
   */
  export interface InstanceLogs {
    nodeId: string;
    taskId?: string;
    nodeName: string;
    type: string; //0 发起人 1审批 2抄送 3条件 4路由 5并行分支 6包容网关
    remark?: string; // 备注，记录子流程的状态
    approveType?: string; //节点会签类型,AND（会签），ORDER（顺序会签），OR（或签）
    user?: User.UserInfo;
    ccUsers?: User.UserInfo[]; // 抄送节点才有值
    taskComments?: TaskComment[];
    duration?: string;
    startTime: string;
    finishTime?: string;
    procInstId?: string;
    procDefId?: string;
    isAgent?: boolean; // 是否代理人
    approveResult?: string; //审核结果，如同意、驳回、撤销、转交、加签、退回,发起
  }

  /**
   * 任务评论
   */
  export interface TaskComment extends Comment {
    id?: string;
    taskId?: string;
    type?: string;
    user?: User.UserInfo;
    createTime?: string;
  }

  export type InstanceLogsList = InstanceLogs[];

  /**
   * 流程结果
   */
  export interface ProcessResult {
    instanceLogs: InstanceLogsList[];
    approveResult?: string; //processing,end,disgree-end,refuse-end
    approveResultText?: string; //上边对应的文字描述
  }
}
