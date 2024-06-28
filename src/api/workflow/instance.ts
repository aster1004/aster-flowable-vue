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
 * @return {*}
 */
export const instancePageApi = (params: Process.InstanceParams) => {
  return request.post<Page.ResPage<Config.ConfigInfo>>(PORT5 + `/process/instance/page`, params, {
    noLoading: true,
  });
};
