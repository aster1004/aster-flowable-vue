import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const appPageApi = (params?: WorkApp.AppParams) => {
  if (params) {
    return request.get<Page.ResPage<WorkApp.AppInfo>>(PORT5 + `/app/page`, params, {
      noLoading: true,
    });
  } else {
    return request.get<Page.ResPage<WorkApp.AppInfo>>(
      PORT5 + `/app/page`,
      {},
      {
        noLoading: true,
      },
    );
  }
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
 * @param params 查询已启用的应用
 * @returns
 */
export const appActiveListApi = () => {
  return request.get<WorkApp.AppInfo[]>(PORT5 + `/app/active`, {
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

/**
 * @description: 应用表单树含表单项
 * @return {*}
 */
export const appFormTreeWithFormItemApi = () => {
  return request.get<WorkComponent.FormTreeNode[]>(PORT5 + `/app/treeWithFormItem`, {
    noLoading: true,
  });
};
