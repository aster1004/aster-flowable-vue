/*
 * @Author: bzldg t15710073278@163.com
 * @Date: 2024-08-06 17:56:19
 * @Description: 流程设计工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { useWorkFlowStore } from '@/stores/modules/workflow';
import { flatFormItems } from '@/utils/workflow';
import { isNotEmpty } from '@/utils';
import { ProcessNodeTypeEnum } from '@/enums/workFlowEnum';

// 工作流store
const workFlowStore = useWorkFlowStore();

/**
 * 获取表单字段数据权限
 * @param val
 */
export const getFormFieldData = (val: any) => {
  let formItems = flatFormItems(workFlowStore.design.formItems);
  formItems.forEach((formItem: any) => {
    if (val.value.type === 0) {
      formItem.operation = ['edit'];
    } else {
      formItem.operation = ['readonly'];
    }
  });
  let formPermissionData = val.value.formPermission;
  if (isNotEmpty(formPermissionData)) {
    formItems.forEach((formItem: any) => {
      for (let i = 0; i < formPermissionData.length; i++) {
        let permission: any = formPermissionData[i];
        if (formItem.id == permission.id) {
          formItem.operation = permission.operation;
        }
      }
    });
  }
  return formItems;
};

/**
 * 设置所有的节点设置表单权限
 * 因为在保存时可能表单发生变化, 需要将表单权限同步到节点中
 */
export const setAllNodeFormPermission = () => {
  // 获取所有的节点
  let nodes = getAllNode();
  nodes.forEach((node: any) => {
    if (
      [ProcessNodeTypeEnum.ROOT, ProcessNodeTypeEnum.SEND, ProcessNodeTypeEnum.APPROVE].indexOf(
        node.type,
      ) != -1
    ) {
      node.formPermission = setNodeFormPermission(node.type, node.formPermission);
      // console.info(
      //   node.type + '->' + node.nodeName + '表单权限：',
      //   JSON.stringify(node.formPermission),
      // );
    }
  });
};

/**
 * 设置节点表单权限
 * @param type
 * @param formPermissionData
 * @returns
 */
const setNodeFormPermission = (type: number, formPermissionData: any[]) => {
  let storeFormItems = flatFormItems(workFlowStore.design.formItems);
  let formItems = JSON.parse(JSON.stringify(storeFormItems));
  formItems.forEach((formItem: any) => {
    if (type == ProcessNodeTypeEnum.ROOT) {
      formItem.operation = ['edit'];
    } else if (type == ProcessNodeTypeEnum.SEND) {
      formItem.operation = ['readonly'];
    } else if (type == ProcessNodeTypeEnum.APPROVE) {
      formItem.operation = ['readonly'];
    }
  });
  if (formPermissionData && isNotEmpty(formPermissionData)) {
    formItems.forEach((formItem: any) => {
      for (let i = 0; i < formPermissionData.length; i++) {
        let permission: any = formPermissionData[i];
        if (formItem.id == permission.id) {
          formItem.operation = permission.operation;
        }
      }
    });
  }
  return formItems;
};

/**
 * 获取所有的节点
 * @returns
 */
export const getAllNode = () => {
  let process = workFlowStore.design.process;
  // console.info('process：', JSON.stringify(process));
  return revertNode(process, []);
};

/**
 * 获取根据类型获取节点集合
 * @param type
 * @returns
 */
export const getProcessNodesByType = (types: number[]) => {
  let nodes = getAllNode();
  // console.info('getAllNodes：', JSON.stringify(nodes));
  return nodes.filter((node: any) => {
    return types.indexOf(node.type) != -1;
  });
};

/**
 * 递归获取流程定义节点
 * @param node
 * @param nodeList
 * @returns
 */
const revertNode = (node: any, nodeList: any[]) => {
  if (node.type == 0) {
    nodeList.push(node);
  }
  if (node.conditionNodes && node.conditionNodes != null && node.conditionNodes.length > 0) {
    node.conditionNodes.forEach((conditionNode: any) => {
      nodeList.push(conditionNode);
      revertNode(conditionNode, nodeList);
    });
  }
  if (node.childNode && node.childNode != null) {
    if (node.childNode.type != ProcessNodeTypeEnum.GATEWAY) {
      nodeList.push(node.childNode);
    }
    revertNode(node.childNode, nodeList);
  }
  return nodeList;
};
