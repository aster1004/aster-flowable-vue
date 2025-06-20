/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-24 10:17:35
 * @FilePath: \aster-flowable-vue\src\api\workflow\task.ts
 * @Description: 表单相关API接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 提交表单
 * @param {any} formData
 * @return {*}
 */
export const formSubmitApi = (formData: any) => {
  return request.post<string>(PORT5 + `/processTask/submit`, formData, { noLoading: true });
};

/**
 * @description: 查询任务
 * @param {any} pageQuery
 * @return {*}
 */
export const taskPageApi = (pageQuery: any) => {
  return request.post<any>(PORT5 + `/processTask/taskPage`, pageQuery, { noLoading: true });
};

/**
 * @description: 完成任务
 * @param {any} formData
 * @return {*}
 */
export const completeTaskApi = (formData: any) => {
  return request.post<any>(PORT5 + `/processTask/completeTask`, formData, {
    noLoading: true,
  });
};

/**
 * @description: 流程实例详情
 * @param {Process} params 查询条件
 * @return {*}
 */
export const instanceInfoApi = (params: Process.InstanceQueryParams) => {
  return request.post<Process.InstanceDetail>(PORT5 + `/processTask/instance/info`, params, {
    noLoading: true,
  });
};

/**
 * @description: 根据流程实例id获取流程实例详情
 * @param {String} code 表单code
 * @param {String} instanceId 流程实例id
 * @return {*}
 */
export const instanceInfoByInstanceIdApi = (code: string, instanceId: string) => {
  return request.get<Process.InstanceDetail>(
    PORT5 + `/processTask/instance/info/${instanceId}`,
    {
      code: code,
    },
    {
      noLoading: true,
    },
  );
};

/**
 * @description: 获取可退回的节点
 * @param params
 */
export const getRecallTaskNodesApi = (taskId: string) => {
  return request.get<Process.BackNodeModel[]>(
    PORT5 + `/processTask/getRecallTaskNodes`,
    { taskId: taskId },
    {
      noLoading: true,
    },
  );
};

/**
 * @description: 获取流程日志
 * @param procInstId
 */
export const getInstanceLogsApi = (procInstId: string) => {
  return request.get<WorkForm.ProcessResult>(
    PORT5 + `/processTask/instance/logs/${procInstId}`,
    {},
    { noLoading: true },
  );
};

/**
 * @description: 获取待办/已办任务列表
 * @param params 查询参数
 */
export const getTaskPageApi = (params: WorkTask.TaskQuery) => {
  return request.post<Page.ResPage<WorkTask.TaskNodeModel>>(PORT5 + `/processTask/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 获取我发起的流程列表
 * @param params 查询参数
 */
export const getMyStartedApi = (params: WorkTask.TaskQuery) => {
  return request.post<Page.ResPage<WorkTask.MyStartedModel>>(
    PORT5 + `/processTask/started`,
    params,
    { noLoading: false },
  );
};

/**
 * @description: 获取抄送我的流程列表
 * @param params 查询参数
 */
export const getCcMeApi = (params: WorkTask.TaskQuery) => {
  return request.post<Page.ResPage<WorkTask.MyStartedModel>>(PORT5 + `/processTask/ccme`, params, {
    noLoading: true,
  });
};

/**
 * @description: 获取年度任务统计
 */
export const getAnnualTaskApi = () => {
  return request.get<WorkTask.AnnualTaskModel>(
    PORT5 + `/processTask/annualTask`,
    {},
    {
      noLoading: true,
    },
  );
};

/**
 * @description: 获取已办统计
 */
export const getCompleteStatisticskApi = () => {
  return request.get<WorkTask.CompleteStatisticsModel[]>(
    PORT5 + `/processTask/completeStatistics`,
    {},
    {
      noLoading: true,
    },
  );
};

/**
 * @description: 超级管理员提交表单
 * @param {String} code 表单code
 * @param {WorkForm.FormDataModel} formData 表单数据
 * @return {*}
 */
export const superAdminSubmitApi = (code: string, formData: WorkForm.FormDataModel) => {
  return request.post<string>(
    PORT5 + `/processTask/submitBySuperAdmin`,
    {
      code: code,
      formData: formData,
    },
    { noLoading: false },
  );
};
