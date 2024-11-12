/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-03 17:46:32
 * @FilePath: \aster-flowable-vue\src\config\index.ts
 * @Description: 默认配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

// 首页地址（默认）
export const HOME_URL: string = '/home';

// 登录页地址（默认）
export const LOGIN_URL: string = '/login';

// 默认主题颜色
export const DEFAULT_PRIMARY: string = '#fd726d';

// 路由白名单地址（必须是本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST: string[] = ['/500'];

// 默认头像
export const AVATAR_URL = './src/assets/images/avatar.png';

// 浏览附件服务器
export const PREVIEW_URL = 'http://106.37.75.241:9107/onlinePreview?url=';
