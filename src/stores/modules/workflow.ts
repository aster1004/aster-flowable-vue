/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-09 16:12:09
 * @FilePath: \aster-flowable-vue\src\stores\modules\workflow.ts
 * @Description: 流程 模块
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { WorkflowState } from '@/stores/interface/workflow';

export const useWorkFlowStore = defineStore({
  id: 'aster-workflow',
  state: (): WorkflowState => ({
    design: {
      icon: 'iconfont icon-gengduo',
      iconColor: '',
      labelPosition: 'left',
      formName: '未命名表单',
      formItems: [],
      labelWidth: 80,
      size: 'default', // 大-large,中-default,小-small
    },
  }),
  actions: {
    // wflow
    setSelectedNode(node: object) {
      this.selectedNode = node;
    },
    loadForm(form: WorkForm.FormModel) {
      this.design = form;
    },
    setIsEdit(edit: boolean) {
      this.isEdit = edit;
    },
  },
});
