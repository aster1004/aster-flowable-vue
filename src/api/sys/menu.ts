/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 09:31:52
 * @FilePath: \aster-flowable-vue\src\api\sys\menu.ts
 * @Description: 菜单API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 获取菜单列表
 * @param {Menu.MenuParams} params
 * @return {*}
 */
export const menuListApi = (params?: Menu.MenuParams) => {
  return request.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, params, { noLoading: true });
};

/**
 * @description: 获取菜单信息
 * @param {string} id
 * @return {*}
 */
export const menuInfoApi = (id: string) => {
  return request.get<Menu.MenuOptions>(PORT1 + `/menu/info/` + id, { noLoading: true });
};

/**
 * @description: 添加或编辑
 * @param {Menu.MenuOptions} menu
 * @return {*}
 */
export const menuSaveApi = (menu: Menu.MenuOptions) => {
  return request.post<string>(PORT1 + `/menu/save`, menu, { noLoading: true });
};

/**
 * @description: 删除
 * @param {string} id
 * @return {*}
 */
export const menuDeleteApi = (id: string) => {
  const ids = [id];
  return request.post<string>(PORT1 + `/menu/delete`, ids, { noLoading: true });
};
