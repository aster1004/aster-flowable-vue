/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-09 16:12:09
 * @FilePath: \aster-flowable-vue\src\stores\modules\workflow.ts
 * @Description: 流程 模块
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { WorkflowState } from '@/stores/interface/workflow';
import { formInfoApi } from '@/api/workflow/form';
import { ResultEnum } from '@/enums/httpEnum';
import { ElMessage } from 'element-plus';

export const useWorkFlowStore = defineStore({
  id: 'aster-workflow',
  state: (): WorkflowState => ({
    design: {
      icon: 'iconfont icon-gengduo',
      iconColor: '',
      labelPosition: 'left',
      formName: '未命名表单',
      formItems: [],
      process: {},
      labelWidth: 80,
      listSettings: {
        queryItems: [],
        columns: [],
        sortBy: 'create_time',
        sortDirection: 'desc',
        actions: [],
      },
    },
  }),
  actions: {
    // 初始化表单信息
    async initFormInfo(appId?: string) {
      this.design = {
        appId: appId,
        icon: 'iconfont icon-gengduo',
        iconColor: '',
        labelPosition: 'left',
        formName: '未命名表单',
        formItems: [],
        labelWidth: 80,
        listSettings: {
          queryItems: [],
          columns: [],
          sortBy: 'create_time',
          sortDirection: 'desc',
          actions: [],
        },
      };
    },
    // 加载表单信息
    async loadFormInfo(formId: string) {
      await formInfoApi(formId).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          this.design = res.data;
        } else {
          this.initFormInfo();
          ElMessage.error(res.message);
        }
      });
    },
    // 设置选中节点
    setSelectedNode(node: object) {
      this.selectedNode = node;
    },
    // 设置是否编辑
    setIsEdit(edit: boolean) {
      this.isEdit = edit;
    },
  },
});
