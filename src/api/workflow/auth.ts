/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-30 17:26:50
 * @FilePath: \aster-flowable-vue\src\api\workflow\auth.ts
 * @Description: 流程权限 API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 获取角色树
 */
export const roleTreeListApi = (params: WorkAuth.RoleParams) => {
  return request.get<WorkAuth.RoleInfo[]>(PORT5 + `/auth/role/treeList`, params, {
    noLoading: true,
  });
};

/**
 * @description: 获取角色分组
 */
export const roleGroupApi = () => {
  return request.get<WorkAuth.RoleInfo[]>(PORT5 + `/auth/role/group`, {
    noLoading: true,
  });
};

/**
 * @description: 保存角色|角色分组
 * @param {WorkAuth.RoleInfo} params
 */
export const roleSaveApi = (params: WorkAuth.RoleInfo) => {
  return request.post<WorkAuth.RoleInfo>(PORT5 + `/auth/role/save`, params, {
    noLoading: true,
  });
};

/**
 * @description: 删除角色|角色分组
 * @param {any} ids
 * @return {*}
 */
export const roleDeleteApi = (ids: any) => {
  return request.post<string>(PORT5 + `/auth/role/delete`, ids, { noLoading: true });
};

/**
 * @description: 角色排序
 * @param {WorkAuth.RoleInfo} sorts
 * @return {*}
 */
export const roleSortApi = (sorts: WorkAuth.RoleInfo[]) => {
  return request.post<string>(PORT5 + `/auth/role/sort`, sorts, { noLoading: true });
};

/**
 * @description: 获取成员列表
 * @param {WorkAuth.MemberParams} params
 */
export const memberListApi = (params: WorkAuth.MemberParams) => {
  return request.get<WorkAuth.MemberInfo[]>(PORT5 + `/auth/member/list`, params, {
    noLoading: true,
  });
};

/**
 * @description: 批量保存成员
 * @param {WorkAuth.MemberInfo} members
 */
export const memberSaveApi = (roleId: string, members: WorkAuth.MemberInfo[]) => {
  return request.post<string>(PORT5 + `/auth/member/batchSave/${roleId}`, members, {
    noLoading: true,
  });
};

/**
 * @description: 删除成员
 * @param {any} ids
 */
export const memberDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT5 + `/auth/member/delete`, ids, { noLoading: true });
};
