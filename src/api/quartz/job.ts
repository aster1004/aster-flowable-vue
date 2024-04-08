/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-07 14:14:31
 * @FilePath: \aster-admin\src\api\quartz\job.ts
 * @Description: 任务调度API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT4 } from '../config';

/**
 * @description: 任务分页
 * @param {any} params 查询参数
 * @return {*}
 */
export const jobPageApi = (params: Quartz.JobParams) => {
  return request.get<Page.ResPage<Quartz.JobInfo>>(PORT4 + `/job/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 任务信息
 * @param {string} id 任务id
 * @return {*}
 */
export const jobInfoApi = (id: string) => {
  return request.get<Quartz.JobInfo>(PORT4 + `/job/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 任务保存
 * @param info 任务信息
 * @return {*}
 */
export const jobSubmitApi = (info: Quartz.JobInfo) => {
  return request.post<string>(PORT4 + `/job/save`, info, { noLoading: true });
};

/**
 * @description: 任务删除
 * @param {any} ids 任务id
 * @return {*}
 */
export const jobDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT4 + `/job/delete`, ids, { noLoading: true });
};

/**
 * @description: 运行任务
 * @param info 任务信息
 * @return {*}
 */
export const jobRunApi = (info: Quartz.JobInfo) => {
  return request.post<string>(PORT4 + `/job/run`, info, { noLoading: true });
};

/**
 * @description: 修改任务状态
 * @param info 任务信息
 * @return {*}
 */
export const jobChangeStatusApi = (info: Quartz.JobInfo) => {
  return request.post<string>(PORT4 + `/job/change-status`, info, { noLoading: true });
};

/**
 * @description: 任务日志分页
 * @param {any} params 查询参数
 * @return {*}
 */
export const logPageApi = (params: Quartz.LogParams) => {
  return request.get<Page.ResPage<Quartz.LogInfo>>(PORT4 + `/log/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 任务日志信息
 * @param {string} id 任务日志id
 * @return {*}
 */
export const logInfoApi = (id: string) => {
  return request.get<Quartz.LogInfo>(PORT4 + `/log/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 任务日志删除
 * @param {any} ids 任务日志id
 * @return {*}
 */
export const logDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT4 + `/log/delete`, ids, { noLoading: true });
};

/**
 * @description: 清空任务日志
 * @return {*}
 */
export const logClearApi = () => {
  return request.post<string>(PORT4 + `/log/clear`, {}, { noLoading: true });
};
