/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-06 10:30:14
 * @FilePath: \aster-flowable-vue\src\api\monitor\caching.ts
 * @Description: 缓存API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { CacheInfo, CacheModel } from '@/types/monitor';
import { PORT2 } from '../config';

/**
 * @description: 缓存信息
 * @return {*}
 */
export const cacheInfoApi = () => {
  return request.get<CacheModel>(PORT2 + `/cache/all`, {
    noLoading: true,
  });
};

/**
 * @description: 查询缓存名称列表
 * @return {*}
 */
export const cacheNameApi = () => {
  return request.get<CacheInfo[]>(PORT2 + `/cache/getNames`, {
    noLoading: true,
  });
};

/**
 * @description: 查询缓存键名列表
 * @return {*}
 */
export const cacheKeyApi = (cacheName: string) => {
  return request.get<string[]>(
    PORT2 + `/cache/getKeys/` + cacheName,
    {},
    {
      noLoading: true,
    },
  );
};

/**
 * @description: 查询缓存内容详细
 * @return {*}
 */
export const cacheValueApi = (cacheName: string, cacheKey: string) => {
  return request.get<CacheInfo>(PORT2 + `/cache/getValue/` + cacheName + '/' + cacheKey, {
    noLoading: true,
  });
};

/**
 * @description: 清理指定名称缓存
 * @return {*}
 */
export const clearCacheName = (cacheName: string) => {
  return request.get<string>(PORT2 + `/cache/clearCacheName/` + cacheName, {
    noLoading: true,
  });
};

/**
 * @description: 清理指定键名缓存
 * @return {*}
 */
export const clearCacheKey = (cacheKey: string) => {
  return request.get<string>(PORT2 + `/cache/clearCacheKey/` + cacheKey, {
    noLoading: true,
  });
};

/**
 * @description: 清理全部缓存
 * @return {*}
 */
export const clearCacheAll = () => {
  return request.get<string>(PORT2 + `/cache/clearCacheAll`, {
    noLoading: true,
  });
};
