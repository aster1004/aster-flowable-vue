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
 * @param {WorkAuth.RoleInfo} params 查询参数
 */
export const roleSaveApi = (params: WorkAuth.RoleInfo) => {
  return request.post<WorkAuth.RoleInfo>(PORT5 + `/auth/role/save`, params, {
    noLoading: true,
  });
};

/**
 * @description: 删除角色|角色分组
 * @param {any} ids 主键
 * @return {*}
 */
export const roleDeleteApi = (ids: any) => {
  return request.post<string>(PORT5 + `/auth/role/delete`, ids, { noLoading: true });
};

/**
 * @description: 角色排序
 * @param {WorkAuth.RoleInfo} sorts 排序信息
 * @return {*}
 */
export const roleSortApi = (sorts: WorkAuth.RoleInfo[]) => {
  return request.post<string>(PORT5 + `/auth/role/sort`, sorts, { noLoading: true });
};

/**
 * @description: 获取成员列表
 * @param {WorkAuth.MemberParams} params 查询参数
 */
export const memberListApi = (params: WorkAuth.MemberParams) => {
  return request.get<WorkAuth.MemberInfo[]>(PORT5 + `/auth/member/list`, params, {
    noLoading: true,
  });
};

/**
 * @description: 批量保存成员
 * @param {WorkAuth.MemberInfo} members 成员信息
 */
export const memberSaveApi = (roleId: string, members: WorkAuth.MemberInfo[]) => {
  return request.post<string>(PORT5 + `/auth/member/batchSave/${roleId}`, members, {
    noLoading: true,
  });
};

/**
 * @description: 修改成员信息
 * @param {WorkAuth.MemberInfo} member 成员信息
 */
export const memberEditApi = (member: WorkAuth.MemberInfo) => {
  return request.post<string>(PORT5 + `/auth/member/save`, member, {
    noLoading: true,
  });
};

/**
 * @description: 删除成员
 * @param {any} ids 主键
 */
export const memberDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT5 + `/auth/member/delete`, ids, { noLoading: true });
};

/**
 * @description: 获取角色权限
 * @param {string} roleId 角色ID
 */
export const permListApi = (roleId: string) => {
  return request.get<WorkAuth.RolePermission[]>(PORT5 + `/auth/perm/list/${roleId}`, {
    noLoading: false,
  });
};

/**
 * @description: 保存角色权限
 * @param {WorkAuth.RolePermission} perms 权限信息
 */
export const permSaveApi = (perms: WorkAuth.RolePermission[]) => {
  return request.post<string>(PORT5 + `/auth/perm/save`, perms, {
    noLoading: false,
  });
};

/**
 * @description: 删除角色权限
 * @param {WorkAuth.RolePermission} perm 权限信息
 */
export const permDeleteApi = (perm: WorkAuth.RolePermission) => {
  return request.post<string>(PORT5 + `/auth/perm/delete`, perm, {
    noLoading: true,
  });
};
