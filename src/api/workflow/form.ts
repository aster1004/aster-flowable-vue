/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-24 10:17:35
 * @FilePath: \aster-flowable-vue\src\api\workflow\form.ts
 * @Description: 表单相关API接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 获取应用信息
 */
export const getAppInfoApi = (appId: string) => {
  return request.get<WorkApp.AppInfo>(PORT5 + `/app/info/${appId}`, {}, { noLoading: true });
};
