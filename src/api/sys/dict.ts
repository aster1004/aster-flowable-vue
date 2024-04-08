/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-19 15:01:58
 * @FilePath: \aster-admin\src\api\sys\dict.ts
 * @Description: 字典API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import request from '@/config/axios';
import { PORT1 } from '../config';

export const dictAllApi = () => {
  return request.get<Dict.DictType[]>(PORT1 + `/dict`, { noLoading: true });
};

/**
 * @description: 字典类型分页
 * @return {*}
 */
export const dictTypePageApi = (params: Dict.DictTypeParams) => {
  return request.get<Page.ResPage<Dict.DictType>>(PORT1 + `/dict/type/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 获取单个字典类型
 * @return {*}
 */
export const dictTypeApi = (id: string) => {
  return request.get<Dict.DictType>(PORT1 + `/dict/type/` + id, { noLoading: true });
};

/**
 * @description: 添加或编辑字典类型
 * @param {Dict.DictType} dictType
 * @return {*}
 */
export const dictTypeSaveApi = (dictType: Dict.DictType) => {
  return request.post<string>(PORT1 + `/dict/type/save`, dictType, { noLoading: true });
};

/**
 * @description: 删除字典类型
 * @param {any} ids
 * @return {*}
 */
export const dictTypeDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/dict/type/delete`, ids, { noLoading: true });
};

/**
 * @description: 字典数据分页
 * @return {*}
 */
export const dictDataPageApi = (params: Dict.DictDataParams) => {
  return request.get<Page.ResPage<Dict.DictData>>(PORT1 + `/dict/data/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 获取单个字典数据
 * @return {*}
 */
export const dictDataApi = (id: string) => {
  return request.get<Dict.DictData>(PORT1 + `/dict/data/` + id, { noLoading: true });
};

/**
 * @description: 添加或编辑字典数据
 * @param {Dict.DictData} dictData
 * @return {*}
 */
export const dictDataSaveApi = (dictData: Dict.DictData) => {
  return request.post<string>(PORT1 + `/dict/data/save`, dictData, { noLoading: true });
};

/**
 * @description: 删除字典数据
 * @param {string} id
 * @return {*}
 */
export const dictDataDeleteApi = (id: string) => {
  const ids = [id];
  return request.post<string>(PORT1 + `/dict/data/delete`, ids, { noLoading: true });
};
