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

/**
 * 获取流程表单列表
 *
 * @param params 流程表单
 * @returns
 */
export const formPageApi = (params: WorkForm.FormParams) => {
  return request.get<Page.ResPage<WorkForm.FormModel>>(PORT5 + `/form/page`, params, {
    noLoading: true,
  });
};

/**
 * 获取流程表单集合
 *
 * @param params 流程表单
 * @returns
 */
export const formListApi = (params: WorkForm.BaseInfo) => {
  return request.get<WorkForm.FormModel[]>(PORT5 + `/form/list`, params, {
    noLoading: true,
  });
};

/**
 * @description: 保存
 * @param {WorkForm.FormModel} info
 * @return {*}
 */
export const formSaveApi = (info: WorkForm.FormModel) => {
  return request.post<string>(PORT5 + `/form/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const formDeleteApi = (ids: any) => {
  return request.post<string>(PORT5 + `/form/delete`, ids, { noLoading: true });
};

/**
 * @description: 流程部署
 * @param id 主键
 * @return {*}
 */
export const deploymentApi = (id: String) => {
  return request.post<string>(PORT5 + `/form/deployment/${id}`, {}, { noLoading: true });
};
