/**
 * @description：单行文本控件的格式列表
 */
export const InputTextFormats = [
  { label: '普通文本', value: 'text' },
  { label: '邮箱', value: 'email' },
  { label: '身份证', value: 'idcard' },
  { label: '固话/手机', value: 'mobile' },
];

/**
 * @description：流程设计器弹出宽度
 */
export enum DrawerEnum {
  WIDTH = 550,
}

/**
 * @description：流程定义节点类型
 */
export enum ProcessNodeTypeEnum {
  // 发送人
  ROOT = 0,
  // 审批人
  APPROVE = 1,
  // 抄送人
  SEND = 2,
  // 条件
  CONDITION = 3,
  // 路由
  GATEWAY = 4,
  // 并行
  PARALLEL = 5,
  // 包容
  INCLUSIVE = 6,
  // 网关聚合节点（后端已占用）
  EMPTY = 7,
  // 子流程
  SUBPROCESS = 8,
}

/**
 * @description：表单权限
 */
export enum FormPermissionEnum {
  // 隐藏
  HIDDEN = 'hidden',
  // 只读
  READONLY = 'readonly',
  // 编辑
  EDIT = 'edit',
}
export const opinionOptions = [
  { name: '同意', value: '1' },
  { name: '拒绝', value: '2' },
  { name: '已阅', value: '3' },
];

/**
 * @description：按钮定义
 */
export const buttonPermission = [
  {
    operation: '同意',
    name: 'agree',
    status: true,
    alias: '', // 按钮别名
    sort: 1,
  },
  {
    operation: '不同意',
    name: 'disagree',
    status: true,
    alias: '',
    sort: 2,
  },
  {
    operation: '退回',
    name: 'recall',
    status: true,
    alias: '',
    sort: 3,
  },
  {
    operation: '转交',
    name: 'forward',
    status: true,
    alias: '',
    sort: 4,
  },
  {
    operation: '加签',
    name: 'afterAddSign',
    status: true,
    alias: '',
    sort: 5,
  },
];
/**
 * @description：流程定义节点类型
 */
export enum ProcessButtonTypeEnum {
  // 同意
  AGREEN = 'agree',
  // 不同意
  DISAGREE = 'disagree',
  // 退回
  RECALL = 'recall',
  // 转交
  FORWARD = 'forward',
  // 加签
  AFTERADDSIGN = 'afterAddSign',
  // 撤销
  REVOKE = 'revoke',
  // 发起
  SUBMIT = 'submit',
}
export enum ApprovalModeEnum {
  AND = 'AND', //会签(可同时审批，须全部同意)
  ORDER = 'ORDER', //会签(按选择顺序审批，须全部同意，不支持加签)
  OR = 'OR', //或签(有一人同意即可)
}

/**
 * @description：任务列表状态
 */
export enum TaskStatusEnum {
  // 待办
  TODO = 'todo',
  // 已办
  COMPLETE = 'complete',
  // 我发起的
  STARTED = 'started',
  // 抄送我的
  COPY = 'copy',
}

/**
 * 整体流程的状态
 */
export enum ProcessResultEnum {
  // 处理中
  PROCESSING = 'processing',
  // 流程被撤销
  REVOKE_END = 'revoke-end',
  // 流程被驳回
  DISAGREE_END = 'disagree-end',
  // 结束,流程正常结束
  END = 'end',
}

/**
 *  子流程发起人枚举
 */
export enum StartUserEnum {
  // 同主流程
  ROOT = 'root',
  // 指定人员
  SELECT = 'select',
  // 从表单选择
  FORM = 'form',
}
