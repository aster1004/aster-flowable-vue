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
 * @param {string} taskId
 * @param {any} formData
 * @return {*}
 */
export const completeTaskApi = (taskId: string, formData: any) => {
  return request.post<any>(PORT5 + `/processTask/completeTask/${taskId}`, formData, {
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
