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
 * @description: 单条信息
 * @param {string} id
 * @return {*}
 */
export const userInfoApi = (id: string) => {
  return request.get<User.UserInfo>(PORT1 + `/user/info/` + id, { noLoading: true });
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
