import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const tenantPageApi = (params: Tenant.TenantParams) => {
  return request.get<Page.ResPage<Tenant.TenantInfo>>(PORT1 + `/tenant/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const tenantInfoApi = (id: string) => {
  return request.get<Tenant.TenantInfo>(PORT1 + `/tenant/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Tenant.TenantInfo} info
 * @return {*}
 */
export const tenantSaveApi = (info: Tenant.TenantInfo) => {
  return request.post<string>(PORT1 + `/tenant/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const tenantDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/tenant/delete`, ids, { noLoading: true });
};

/**
 * @description: 切换租户
 * @return {*}
 */
export const switchTenantApi = (id: string) => {
  return request.get<string>(PORT1 + `/tenant/switch/` + id, { noLoading: true });
};
