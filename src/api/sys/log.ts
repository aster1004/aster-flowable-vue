/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-03 16:23:29
 * @FilePath: \aster-flowable-vue\src\api\sys\log.ts
 * @Description: 日志API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 访问日志列表
 * @param {Log.AccessParams} params
 * @return {*}
 */
export const logAccessPageApi = (params: Log.AccessParams) => {
  return request.get<Page.ResPage<Log.AccessInfo>>(PORT1 + `/log/login/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 导出访问日志
 * @param {*} params
 * @return {*}
 */
export const logAccessExportApi = (params: Log.AccessParams) => {
  return request.download(PORT1 + `/log/login/export`, params, { noLoading: true });
};

/**
 * @description: 操作日志列表
 * @param {Log.OperationParams} params
 * @return {*}
 */
export const logOperationPageApi = (params: Log.OperationParams) => {
  return request.get<Page.ResPage<Log.OperationInfo>>(PORT1 + `/log/operate/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 操作日志详情
 * @param {string} key
 * @return {*}
 */
export const logOperationDetailApi = (key: string) => {
  return request.get<Log.OperationInfo>(PORT1 + `/log/operate/detail/` + key, {
    noLoading: true,
  });
};

/**
 * @description: 导出操作日志
 * @param {*} params
 * @return {*}
 */
export const logOperationExportApi = (params: Log.OperationParams) => {
  return request.download(PORT1 + `/log/operate/export`, params, { noLoading: true });
};
