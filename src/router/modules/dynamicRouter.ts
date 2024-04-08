/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 15:28:05
 * @FilePath: \aster-admin\src\router\modules\dynamicRouter.ts
 * @Description: 动态路由
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import router from '@/router/index';
import { LOGIN_URL } from '@/config';
import { RouteRecordRaw } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useUserStore } from '@/stores/modules/user';
import { useAuthStore } from '@/stores/modules/auth';

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue');

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  try {
    // 1.获取菜单列表 && 按钮权限列表
    await authStore.getAuthMenuList();
    await authStore.getAuthButtonList();

    // 2.判断当前用户有没有菜单权限
    if (!authStore.authMenuListGet.length) {
      ElNotification({
        title: '无权限访问',
        message: '当前账号无任何菜单权限，请联系系统管理员！',
        type: 'warning',
        duration: 3000,
      });
      userStore.setToken('');
      router.replace(LOGIN_URL);
      return Promise.reject('No permission');
    }
    // 3.添加动态路由
    authStore.flatMenuListGet.forEach((item) => {
      item.children && delete item.children;

      const { ...obj } = item;

      const meta = {
        title: item.name,
        icon: item.icon,
        isAffix: item.isAffix,
      };

      obj['meta'] = meta;

      if (item.component && typeof item.component == 'string') {
        obj.component = modules['/src/views' + item.component + '.vue'];
      }
      if (item.isFull == '0') {
        router.addRoute(obj as unknown as RouteRecordRaw);
      } else {
        router.addRoute('layout', obj as unknown as RouteRecordRaw);
      }
    });
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userStore.setToken('');
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
