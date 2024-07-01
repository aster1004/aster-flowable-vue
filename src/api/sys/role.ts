/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 17:17:30
 * @FilePath: \aster-flowable-vue\src\api\sys\role.ts
 * @Description: 角色API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 全部角色
 * @return {*}
 */
export const roleListApi = () => {
  return request.get<Role.RoleInfo[]>(PORT1 + `/role/list`, {
    noLoading: true,
  });
};

/**
 * @description: 分页
 * @return {*}
 */
export const rolePageApi = (params: Role.RoleParams) => {
  return request.get<Page.ResPage<Role.RoleInfo>>(PORT1 + `/role/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const roleInfoApi = (id: string) => {
  return request.get<Role.RoleInfo>(PORT1 + `/role/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Role.RoleInfo} roleInfo
 * @return {*}
 */
export const roleSaveApi = (roleInfo: Role.RoleInfo) => {
  return request.post<string>(PORT1 + `/role/save`, roleInfo, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const roleDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/role/delete`, ids, { noLoading: true });
};

/**
 * @description: 查询角色权限
 * @param {any} roleId
 * @return {*}
 */
export const roleMenuApi = (roleId: any) => {
  return request.get<string[]>(PORT1 + `/role/menu/` + roleId, { noLoading: true });
};

/**
 * @description: 保存角色权限
 * @param {any} roleId
 * @return {*}
 */
export const roleMenuSaveApi = (params: Role.RoleMenuParams) => {
  return request.post<string>(PORT1 + `/role/menu/save`, params, { noLoading: true });
};

/**
 * 数据权限
 * @param dataScope 数据范围
 * @returns
 */
export const dataScopeSaveApi = (dataScope: Role.DataScope) => {
  return request.post<string>(PORT1 + `/role/org`, dataScope, { noLoading: true });
};

/**
 * @description: 批量获取角色信息
 * @param ids
 * @return {*}
 */
export const selectRolesByIdsApi = (ids: string[]) => {
  return request.post<Role.RoleInfo[]>(PORT1 + `/role/selectBatchIds`, ids, {
    noLoading: true,
  });
};
