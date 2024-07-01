/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-24 10:17:35
 * @FilePath: \aster-flowable-vue\src\api\workflow\process.ts
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
  return request.post<string>(PORT5 + `/process/submit`, formData, { noLoading: true });
};

/**
 * @description: 分页查询表单
 * @param {any} pageQuery
 * @return {*}
 */
export const selectPageApi = (pageQuery: any) => {
  return request.post<any>(PORT5 + `/process/selectPage`, pageQuery, { noLoading: true });
};

/**
 * @description: 查询任务
 * @param {any} pageQuery
 * @return {*}
 */
export const taskPageApi = (pageQuery: any) => {
  return request.post<any>(PORT5 + `/process/taskPage`, pageQuery, { noLoading: true });
};

/**
 * @description: 完成任务
 * @param {string} taskId
 * @param {any} formData
 * @return {*}
 */
export const completeTaskApi = (taskId: string, formData: any) => {
  return request.post<any>(PORT5 + `/process/completeTask/${taskId}`, formData, {
    noLoading: true,
  });
};
