/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-16 10:23:46
 * @FilePath: \aster-flowable-vue\src\api\login.ts
 * @Description: 登录API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from './config';

// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return request.post<Login.ResLogin>(PORT1 + `/auth/login`, params, { noLoading: true });
};

// 获取验证码
export const captchaApi = () => {
  return request.get<Login.Captcha>(PORT1 + `/auth/captcha`, { noLoading: true });
};

// 是否启动验证码
export const captchaEnabledApi = () => {
  return request.get<boolean>(PORT1 + `/auth/captcha/enabled`, { noLoading: true });
};

// 是否启动租户
export const tenantEnabledApi = () => {
  return request.get<boolean>(PORT1 + `/auth/tenant/enabled`, { noLoading: true });
};

// 租户列表
export const tenantListApi = () => {
  return request.get<Tenant.TenantInfo[]>(PORT1 + `/auth/tenant`, { noLoading: true });
};

// 获取秘钥
export const secretKeyApi = () => {
  return request.get<string>(PORT1 + `/auth/secretKey`, { noLoading: true });
};

// 用户退出登录
export const logoutApi = () => {
  return request.post<string>(PORT1 + `/auth/logout`);
};

// 个人信息
export const userInfoApi = () => {
  return request.get<User.UserInfo>(PORT1 + `/user/info`, { noLoading: true });
};

// 修改个人信息
export const editUserInfoApi = (params: User.UserInfo) => {
  return request.post<string>(PORT1 + `/user/edit`, params, { noLoading: true });
};

/**
 * @description: 重置密码
 * @param {*} params
 * @return {*}
 */
export const userResetPwdApi = (params: string[]) => {
  return request.post<string>(PORT1 + `/auth/resetPassword`, params, { noLoading: true });
};
