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
  ROOT = 0, // 发送人
  APPROVE = 1, // 审批人
  SEND = 2, // 抄送人
  CONDITION = 3, // 条件
  GATEWAY = 4, // 路由
  PARALLEL = 5, // 并行
  INCLUSION = 6, // 包容
}
