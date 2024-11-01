/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-25 10:31:05
 * @FilePath: \aster-flowable-vue\src\api\workflow\process.ts
 * @Description: 流程实例API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 流程实例分页
 * @param {Process} params 查询参数
 * @return {*}
 */
export const instancePageApi = (params: Process.InstanceParams) => {
  return request.post<Page.ResPage<Process.InstanceInfo>>(
    PORT5 + `/process/instance/page`,
    params,
    {
      noLoading: false,
    },
  );
};

/**
 * @description: 根据自定义参数获取流程实例
 * @param {String} code 表单code
 * @param {object} params 自定义参数
 * @return {*}
 */
export const instanceInfoByCustomParamsApi = (code: string, params: object) => {
  return request.post<Process.InstanceInfo>(
    PORT5 + `/process/instance/info/query`,
    {
      code: code,
      customParams: params,
    },
    {
      noLoading: false,
    },
  );
};

/**
 * @description: 根据code获取流程实例
 * @param {String} code 表单code
 * @return {*}
 */
export const instanceListByCodeApi = (code: String, status: string) => {
  return request.post<Process.InstanceInfo[]>(
    PORT5 + `/process/instance/list`,
    { code: code, status: status },
    { noLoading: true },
  );
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
 * 删除流程实例及历史数据
 * @param roleId
 */
export const delProcessInstanceApi = (procInstId: string) => {
  return request.post<any>(PORT5 + `/process/delProcess/${procInstId}`, {
    noLoading: false,
  });
};
