/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-15 17:00:28
 * @FilePath: \aster-flowable-vue\src\stores\interface\workflow.ts
 * @Description: workflow store
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare type NodeMap = {
  [key: string]: any;
};

export interface WorkflowState {
  // 表单设计数据
  design: WorkForm.FormModel;
  // 选中的表单项
  selectFormItem?: WorkComponent.ComponentConfig | null;
  nodeMap?: NodeMap;
  selectedNode?: object;
  formItemMap?: NodeMap;
  isEdit?: boolean;
  designSub?: {};
}
