/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\router\index.ts
 * @Description: router
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import { useUserStore } from '@/stores/modules/user';
import { useAuthStore } from '@/stores/modules/auth';
import { LOGIN_URL, ROUTER_WHITE_LIST } from '@/config';
import { initDynamicRouter } from '@/router/modules/dynamicRouter';
import { staticRouter, errorRouter } from '@/router/modules/staticRouter';
// import NProgress from '@/config/nprogress';

const mode = import.meta.env.VITE_ROUTER_MODE;

const router = createRouter({
  history: mode == 'hash' ? createWebHashHistory() : createWebHistory(),
  strict: true,
  routes: [...staticRouter, ...errorRouter],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * @description: 路由拦截
 * @param {*} async
 * @param {*} from
 * @param {*} next
 * @return {*}
 */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  // NProgress 开始
  // NProgress.start();

  // 动态设置标题
  const title = import.meta.env.VITE_APP_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath);
    // resetRouter();
    return next();
  }

  // 判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();

  // 判断是否有 Token，没有重定向到 login 页面
  if (!userStore.token) return next({ path: LOGIN_URL, replace: true });

  // 如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (authStore.authMenuListGet.length == 0) {
    await initDynamicRouter();
    return next({ ...to, replace: true });
  }

  // 存储 routerName 做按钮权限筛选
  authStore.setRouteName(to.name as string);

  // 正常访问页面
  next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthStore();
  authStore.flatMenuListGet.forEach((route) => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  });
};

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  // NProgress.done();
  console.warn('路由错误', error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  // NProgress.done();
});

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};

export default router;
