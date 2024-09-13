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
  INCLUSION = 6,
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
