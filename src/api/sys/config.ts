/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-01-30 10:49:21
 * @FilePath: \aster-admin\src\api\sys\config.ts
 * @Description: 系统配置API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const configPageApi = (params: Config.ConfigParams) => {
  return request.get<Page.ResPage<Config.ConfigInfo>>(PORT1 + `/config/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const configInfoApi = (id: string) => {
  return request.get<Config.ConfigInfo>(PORT1 + `/config/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Config.ConfigInfo} info
 * @return {*}
 */
export const configSaveApi = (info: Config.ConfigInfo) => {
  return request.post<string>(PORT1 + `/config/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const configDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/config/delete`, ids, { noLoading: true });
};
