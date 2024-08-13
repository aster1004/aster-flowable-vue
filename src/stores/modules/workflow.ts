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
      process: <WorkForm.FormProcess>{},
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
        process: {
          tableId: '',
          directorMaxLevel: 4,
          flowPermission: [],
          nodeConfig: {
            id: 'root',
            parentId: null,
            nodeName: '发起人', //节点名称
            type: 0, // 0 发起人 1审批 2抄送 3条件 4路由
            priorityLevel: '', // 条件优先级
            settype: '', // 审批人设置 1指定成员 2主管 4发起人自选 5发起人自己 7连续多级主管
            selectMode: '', //审批人数 1选一个人 2选多个人
            selectRange: '', //选择范围 1.全公司 2指定成员 2指定角色
            directorLevel: '', //审批终点  最高层主管数
            examineMode: '', //多人审批时采用的审批方式 1依次审批 2会签
            noHanderAction: '', //审批人为空时 1自动审批通过/不允许发起 2转交给审核管理员
            examineEndDirectorLevel: '', //审批终点 第n层主管
            ccSelfSelectFlag: '', //允许发起人自选抄送人
            nodeUserList: [], //操作人
            error: false,
            errorTip: '',
            childNode: {},
            conditionNodes: [],
            formPermission: [],
            buttonPermission: [
              {
                operation: '提交',
                name: 'submit',
                status: true,
              },
              {
                operation: '撤销',
                name: 'revoke',
                status: true,
              },
            ],
          },
        },
      };
    },
    // 加载表单信息
    async loadFormInfo(formId: string) {
      await formInfoApi(formId).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          console.log(res.data);
          this.design = res.data;
          console.log('保存design------');
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
