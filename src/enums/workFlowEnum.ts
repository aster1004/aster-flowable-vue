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
  START = 'start',
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
