/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-04 09:36:56
 * @FilePath: \aster-flowable-vue\src\stores\modules\global.ts
 * @Description: 全局样式配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { defineStore } from 'pinia';
import { GlobalState } from '@/stores/interface';
import { DEFAULT_PRIMARY } from '@/config';
import piniaPersistConfig from '@/config/piniaPersist';

export const useGlobalStore = defineStore('aster-global', {
  // 修改默认值之后，需清除 localStorage 数据
  state: (): GlobalState => ({
    // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
    layout: 'vertical',
    // element 组件大小
    assemblySize: 'default',
    // 当前系统语言
    language: null,
    // 当前页面是否全屏
    maximize: false,
    // 主题颜色
    primary: DEFAULT_PRIMARY,
    // 深色模式
    isDark: false,
    // 灰色模式
    isGrey: false,
    // 色弱模式
    isWeak: false,
    // 侧边栏反转
    asideInverted: false,
    // 头部反转
    headerInverted: false,
    // 折叠菜单
    isCollapse: false,
    // 面包屑导航
    breadcrumb: true,
    // 面包屑导航图标
    breadcrumbIcon: true,
    // 标签页
    tabs: true,
    // 标签页图标
    tabsIcon: true,
    // 页脚
    footer: true,
  }),
  getters: {},
  actions: {
    // Set GlobalState
    setGlobalState(...args: ObjToKeyValArray<GlobalState>) {
      this.$patch({ [args[0]]: args[1] });
    },
  },
  // 持久化配置
  persist: piniaPersistConfig('aster-global'),
});
