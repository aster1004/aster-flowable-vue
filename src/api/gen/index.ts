/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-28 15:03:27
 * @FilePath: \aster-flowable-vue\src\api\gen\index.ts
 * @Description: 代码生成器API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT, PORT3 } from '../config';
import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

/**
 * @description: 表分页
 * @param {any} params
 * @return {*}
 */
export const tablePageApi = (params: Generator.GeneratorParams) => {
  return request.get<Page.ResPage<Generator.TableInfo>>(PORT3 + `/table/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 表删除
 * @param {any} ids
 * @return {*}
 */
export const tableDeleteApi = (ids: any) => {
  return request.post<string>(PORT3 + `/table/delete`, ids, { noLoading: true });
};

/**
 * @description: 表信息
 * @param {string} id 表id
 * @return {*}
 */
export const tableApi = (id: string) => {
  return request.get<Generator.TableInfo>(PORT3 + `/table/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 表修改
 * @param tableInfo 表信息
 * @return {*}
 */
export const tableSubmitApi = (tableInfo: Generator.TableInfo) => {
  return request.post<string>(PORT3 + `/table/edit`, tableInfo, { noLoading: true });
};

/**
 * @description: 导入
 * @param {string} datasourceId 数据源id
 * @param {string[]} tableNameList 表名
 * @return {*}
 */
export const tableImportSubmitApi = (datasourceId: string, tableNameList: string[]) => {
  return request.post<string>(PORT3 + `/table/import/` + datasourceId, tableNameList, {
    noLoading: true,
  });
};

/**
 * @description: 表字段保存
 * @param tableId 表id
 * @param fieldList 表字段
 * @return {*}
 */
export const tableFieldSubmitApi = (tableId: string, fieldList: Generator.TableFieldInfo[]) => {
  return request.post<string>(PORT3 + `/table/field/` + tableId, fieldList, {
    noLoading: true,
  });
};

/**
 * @description: 表同步
 * @param tableId 表id
 * @return {*}
 */
export const tableSyncApi = (tableId: string) => {
  return request.post<string>(PORT3 + `/table/sync/` + tableId, {
    noLoading: true,
  });
};

/**
 * @description: 字段类型
 * @param {string} id 字段id
 * @return {*}
 */
export const fieldTypeApi = (id: string) => {
  return request.get<Generator.FieldTypeInfo>(PORT3 + `/fieldType/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 字段类型列表
 * @return {*}
 */
export const fieldTypeListApi = () => {
  return request.get<Generator.FieldTypeInfo[]>(PORT3 + `/fieldType/list`, {
    noLoading: true,
  });
};

/**
 * @description: 字段类型分页
 * @return {*}
 */
export const fieldTypePageApi = (params: Generator.FieldTypeParams) => {
  return request.get<Page.ResPage<Generator.BaseClassInfo>>(PORT3 + `/fieldType/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 字段类型保存
 * @param dataForm 字段类型
 * @return {*}
 */
export const fieldTypeSubmitApi = (dataForm: Generator.FieldTypeInfo) => {
  if (dataForm.id) {
    return request.post<string>(PORT3 + `/fieldType/edit`, dataForm, {
      noLoading: true,
    });
  } else {
    return request.post<string>(PORT3 + `/fieldType/add`, dataForm, {
      noLoading: true,
    });
  }
};

/**
 * @description: 字段类型删除
 * @param ids 字段类型id
 * @return {*}
 */
export const fieldTypeDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT3 + `/fieldType/delete`, ids, {
    noLoading: true,
  });
};

/**
 * @description: 数据源list
 * @return {*}
 */
export const dataSourceListApi = () => {
  return request.get<Array<Generator.DatasourceInfo>>(PORT3 + `/datasource/list`, {
    noLoading: true,
  });
};
/**
 * @description: 获取数据源下的所有表
 * @param id 数据源id
 * @return {*}
 */
export const dataSourceTableListApi = (id: string) => {
  return request.get<Array<Generator.TableInfo>>(PORT3 + `/datasource/table/list/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 预览
 * @param tableId 表id
 * @return {*}
 */
export const previewApi = (tableId: string) => {
  return request.get<Array<Generator.PreviewInfo>>(PORT3 + `/preview?tableId=` + tableId, {
    noLoading: true,
  });
};

/**
 * @description: 生成代码（zip压缩包）
 * @param tableIds 表id
 * @return {*}
 */
export const downloadApi = (tableIds: string[]) => {
  location.href =
    import.meta.env.VITE_API_URL +
    PORT +
    '/gen/download?tableIds=' +
    tableIds.join(',') +
    '&access_token=' +
    userStore.token;
};

/**
 * @description: 生成代码（自定义目录）
 * @param tableIds 表名
 * @return {*}
 */
export const generatorApi = (tableIds: string[]) => {
  return request.post<string>(PORT3 + `/code`, tableIds, {
    noLoading: true,
  });
};

/**
 * @description: 基类列表
 * @return {*}
 */
export const baseClassListApi = () => {
  return request.get<Array<Generator.BaseClassInfo>>(PORT3 + `/baseClass/list`, {
    noLoading: true,
  });
};

/**
 * @description: 基类分页
 * @return {*}
 */
export const baseClassPageApi = (params: Generator.BaseClassParams) => {
  return request.get<Page.ResPage<Generator.BaseClassInfo>>(PORT3 + `/baseClass/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 基类
 * @param {string} id 基类id
 * @return {*}
 */
export const baseClassInfoApi = (id: string) => {
  return request.get<Generator.BaseClassInfo>(PORT3 + `/baseClass/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 基类保存
 * @param dataForm 基类
 * @return {*}
 */
export const baseClassSubmitApi = (dataForm: Generator.BaseClassInfo) => {
  return request.post<string>(PORT3 + `/baseClass/save`, dataForm, {
    noLoading: true,
  });
};

/**
 * @description: 基类删除
 * @param ids 基类id
 * @return {*}
 */
export const baseClassDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT3 + `/baseClass/delete`, ids, {
    noLoading: true,
  });
};

/**
 * @description: 数据源分页
 * @return {*}
 */
export const dataSourcePageApi = (params: Generator.DatasourceParams) => {
  return request.get<Page.ResPage<Generator.DatasourceInfo>>(PORT3 + `/datasource/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 数据源
 * @param {string} id 数据源id
 * @return {*}
 */
export const dataSourceInfoApi = (id: string) => {
  return request.get<Generator.DatasourceInfo>(PORT3 + `/datasource/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 数据源保存
 * @param dataForm 数据源
 * @return {*}
 */
export const dataSourceSubmitApi = (dataForm: Generator.DatasourceInfo) => {
  return request.post<string>(PORT3 + `/datasource/save`, dataForm, {
    noLoading: true,
  });
};

/**
 * @description: 数据源删除
 * @param ids 数据源id
 * @return {*}
 */
export const dataSourceDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT3 + `/datasource/delete`, ids, {
    noLoading: true,
  });
};

/**
 * @description: 测试连接
 * @param {string} id 数据源id
 * @return {*}
 */
export const dataSourceTestApi = (id: string) => {
  return request.get<string>(PORT3 + `/datasource/test/` + id, {
    noLoading: true,
  });
};
