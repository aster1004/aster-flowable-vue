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
export const formListApi = (params: WorkForm.QueryParams) => {
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
  return request.post<string>(PORT5 + `/process/publish`, info, { noLoading: true });
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

/**
 * @description: 获取流程表单详情
 * @param {String} id 表单主键
 * @return {*}
 */
export const formInfoApi = (id: String) => {
  return request.get<WorkForm.FormModel>(PORT5 + `/form/info/${id}`, {}, { noLoading: true });
};

/**
 * @description: 根据code获取最新的流程表单信息
 * @param {String} code 表单code
 * @return {*}
 */
export const formInfoByCodeApi = (code: String) => {
  return request.get<WorkForm.FormModel>(PORT5 + `/form/code/${code}`, {}, { noLoading: true });
};

/**
 * @description: 校验控件数据是否重复
 * @param {String} code 表单code
 * @param {String} formId 控件id
 * @param {String} value 控件值
 * @return {*}
 */
export const validateDuplicateApi = (code: string, formId, value: string) => {
  return request.post<boolean>(
    PORT5 + `/form/validateDuplicate`,
    {
      code: code,
      formId: formId,
      value: value,
    },
    { noLoading: true },
  );
};
