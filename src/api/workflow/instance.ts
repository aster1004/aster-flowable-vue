/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-25 10:31:05
 * @FilePath: \aster-flowable-vue\src\api\workflow\instance.ts
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
      noLoading: true,
    },
  );
};

/**
 * @description: 流程实例详情
 * @param {Process} params 查询条件
 * @return {*}
 */
export const instanceInfoApi = (params: Process.InstanceQueryParams) => {
  return request.post<Process.InstanceDetail>(PORT5 + `/process/instance/info`, params, {
    noLoading: true,
  });
};
