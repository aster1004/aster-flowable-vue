import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const appPageApi = (params: WorkApp.AppParams) => {
  return request.get<Page.ResPage<WorkApp.AppInfo>>(PORT5 + `/app/page`, params, {
    noLoading: true,
  });
};

/**
 * @param params 查询应用集合
 * @returns
 */
export const appListApi = (params: WorkApp.QueryParams) => {
  return request.get<WorkApp.AppInfo[]>(PORT5 + `/app/list`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const appInfoApi = (id: string) => {
  return request.get<WorkApp.AppInfo>(PORT5 + `/app/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {App.AppInfo} info
 * @return {*}
 */
export const appSaveApi = (info: WorkApp.AppInfo) => {
  return request.post<string>(PORT5 + `/app/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const appDeleteApi = (ids: any) => {
  return request.post<string>(PORT5 + `/app/delete`, ids, { noLoading: true });
};

/**
 * @description: 应用表单树
 * @return {*}
 */
export const appFormTreeApi = () => {
  return request.get<WorkComponent.TreeNode[]>(PORT5 + `/app/tree`, { noLoading: true });
};
