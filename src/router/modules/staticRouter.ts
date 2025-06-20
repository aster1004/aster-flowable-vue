/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 15:28:05
 * @FilePath: \aster-flowable-vue\src\router\modules\staticRouter.ts
 * @Description: 静态路由
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { RouteRecordRaw } from 'vue-router';
import { HOME_URL, LOGIN_URL } from '@/config';

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: HOME_URL,
  },
  {
    path: LOGIN_URL,
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/dingLogin',
    name: 'dingLogin',
    component: () => import('@/views/dingLogin.vue'),
    meta: {
      title: '钉钉登录',
    },
  },
  {
    path: '/renderFlow',
    name: 'renderFlow',
    component: () => import('@/views/workflow/components/flow/render-flow.vue'),
    meta: {
      title: '流程图',
    },
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: HOME_URL,
    children: [],
  },
  {
    path: '/workflow/design',
    name: 'design',
    component: () => import('@/views/workflow/design/index.vue'),
    meta: { title: '流程设计' },
  },
];

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/error/403.vue'),
    meta: {
      title: '403页面',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/error/404.vue'),
    meta: {
      title: '404页面',
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/error/500.vue'),
    meta: {
      title: '500页面',
    },
  },
  // Resolve refresh page, route warnings
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/error/404.vue'),
  },
];
