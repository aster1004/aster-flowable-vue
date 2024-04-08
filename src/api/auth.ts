/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 09:26:35
 * @FilePath: \aster-admin\src\api\auth.ts
 * @Description: 权限API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from './config';

// 获取菜单权限
export const getAuthMenuListApi = () => {
  return request.get<Menu.MenuOptions[]>(PORT1 + `/auth/menu`, {}, { noLoading: true });
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return request.get<string[]>(PORT1 + `/auth/authority`, {}, { noLoading: true });
};
