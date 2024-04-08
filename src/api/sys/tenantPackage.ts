import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const tenantPackagePageApi = (params: TenantPackage.TenantPackageParams) => {
  return request.get<Page.ResPage<TenantPackage.TenantPackageInfo>>(
    PORT1 + `/tenantPackage/page`,
    params,
    {
      noLoading: true,
    },
  );
};
/**
 * @description: 列表
 * @return {*}
 */
export const tenantPackageListApi = () => {
  return request.get<TenantPackage.TenantPackageInfo[]>(PORT1 + `/tenantPackage/list`, {
    noLoading: true,
  });
};
/**
 * @description: 单条信息
 * @return {*}
 */
export const tenantPackageInfoApi = (id: string) => {
  return request.get<TenantPackage.TenantPackageInfo>(PORT1 + `/tenantPackage/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 保存
 * @param {TenantPackage.TenantPackageInfo} info
 * @return {*}
 */
export const tenantPackageSaveApi = (info: TenantPackage.TenantPackageInfo) => {
  return request.post<string>(PORT1 + `/tenantPackage/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const tenantPackageDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/tenantPackage/delete`, ids, { noLoading: true });
};
