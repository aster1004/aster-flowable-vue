/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-30 17:50:58
 * @FilePath: \aster-flowable-vue\src\api\sys\user.ts
 * @Description: 用户API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 列表
 * @param {User.UserParams} params
 * @return {*}
 */
export const userPageApi = (params: User.UserParams) => {
  return request.get<Page.ResPage<User.UserInfo>>(PORT1 + `/user/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 通过角色id获取用户列表
 * @param {User.UserParams} params
 * @return {*}
 */
export const userPageByRoleIdApi = (roleId: string) => {
  return request.get<Page.ResPage<User.UserInfo>>(PORT1 + `/user/pageByRoleId?roleId = ` + roleId, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @param {string} id
 * @return {*}
 */
export const userInfoApi = (id: string) => {
  return request.get<User.UserInfo>(PORT1 + `/user/info/` + id, { noLoading: true });
};

/**
 * @description: 校验用户名
 * @param {string} username 用户名
 * @return {*}
 */
export const validateUserNameApi = (params: User.ValidateParams) => {
  return request.get<boolean>(PORT1 + `/user/validateUserName`, params, {
    noLoading: true,
  });
};

/**
 * @description: 保存
 * @param {User.UserInfo} user
 * @return {*}
 */
export const userSaveApi = (user: User.UserInfo) => {
  return request.post<string>(PORT1 + `/user/save`, user, { noLoading: true });
};

/**
 * @description: 批量保存
 * @param {User.UserInfo} user
 * @return {*}
 */
export const userBatchSaveApi = (users: User.UserInfo[]) => {
  return request.post<string>(PORT1 + `/user/save`, users, { noLoading: true });
};

/**
 * @description: 删除
 * @param {string[]} ids
 * @return {*}
 */
export const userDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT1 + `/user/delete`, ids, { noLoading: true });
};

// 修改密码
export const editPasswordApi = (params: Login.ResetPassword) => {
  return request.post<string>(PORT1 + `/user/password`, params, { noLoading: true });
};

/**
 * @description: 导出用户数据
 * @param {*} params
 * @return {*}
 */
export const userExportApi = (params: User.UserInfo) => {
  return request.download(PORT1 + `/user/export`, params, { noLoading: true });
};

/**
 * @description: 批量获取用户信息
 * @param ids
 * @return {*}
 */
export const selectUsersByIdsApi = (ids: string[]) => {
  return request.post<User.UserInfo[]>(PORT1 + `/user/selectBatchIds`, ids, {
    noLoading: true,
  });
};

/**
 * @description: 通过部门ids批量获取用户信息
 * @param ids
 * @return {*}
 */
export const selectUsersByDeptIdsApi = (ids: string[]) => {
  return request.post<User.UserInfo[]>(PORT1 + `/user/selectBatchDeptIds`, ids, {
    noLoading: true,
  });
};

/**
 * @description: 通过角色ids批量获取用户信息
 * @param ids
 * @return {*} 返回用户id集合
 */
export const selectUsersByRoleIdsApi = (ids: string[]) => {
  return request.post<Role.RoleUserInfo[]>(PORT1 + `/user/selectBatchRoleIds`, ids, {
    noLoading: true,
  });
};
