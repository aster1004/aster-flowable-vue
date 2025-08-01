/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 17:56:24
 * @FilePath: \aster-flowable-vue\src\stores\modules\tabs.ts
 * @Description: 标签
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import router from '@/router';
import { defineStore } from 'pinia';
import { getUrlWithParams } from '@/utils';
import { useKeepAliveStore } from './keepAlive';
import { TabsState, TabsMenuProps } from '@/stores/interface';
import piniaPersistConfig from '@/config/piniaPersist';

const keepAliveStore = useKeepAliveStore();

export const useTabsStore = defineStore('aster-tabs', {
  state: (): TabsState => ({
    tabsMenuList: [],
  }),
  actions: {
    // Add Tabs
    async addTabs(tabItem: TabsMenuProps) {
      if (this.tabsMenuList.some((item) => item.path === tabItem.path)) {
        return;
      }
      this.tabsMenuList.push(tabItem);
      if (
        keepAliveStore.keepAliveName &&
        keepAliveStore.keepAliveName.length > 0 &&
        !keepAliveStore.keepAliveName.includes(tabItem.name) &&
        tabItem.isKeepAlive
      ) {
        keepAliveStore.addKeepAliveName(tabItem.name);
      }
    },
    // Remove Tabs
    async removeTabs(tabPath: string, isCurrent: boolean = true) {
      if (isCurrent) {
        this.tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = this.tabsMenuList[index + 1] || this.tabsMenuList[index - 1];
          if (!nextTab) return;
          router.push(nextTab.path);
        });
      }
      // remove keepalive
      const tabItem = this.tabsMenuList.find((item) => item.path === tabPath);
      tabItem?.isKeepAlive && keepAliveStore.removeKeepAliveName(tabItem.name);
      // set tabs
      this.tabsMenuList = this.tabsMenuList.filter((item) => item.path !== tabPath);
    },
    // Close Side
    async closeTabsOnSide(path: string, type: 'left' | 'right') {
      const currentIndex = this.tabsMenuList.findIndex((item) => item.path === path);
      if (currentIndex !== -1) {
        const range =
          type === 'left' ? [0, currentIndex] : [currentIndex + 1, this.tabsMenuList.length];
        this.tabsMenuList = this.tabsMenuList.filter((item, index) => {
          return index < range[0] || index >= range[1] || !item.close;
        });
      }
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter((item) => item.isKeepAlive);
      keepAliveStore.setKeepAliveName(KeepAliveList.map((item) => item.name));
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter((item) => {
        return item.path === tabsMenuValue || !item.close;
      });
      // set keepalive
      const KeepAliveList = this.tabsMenuList.filter((item) => item.isKeepAlive);
      keepAliveStore.setKeepAliveName(KeepAliveList.map((item) => item.name));
    },
    // Set Tabs
    async setTabs(tabsMenuList: TabsMenuProps[]) {
      this.tabsMenuList = tabsMenuList;
    },
    // Set Tabs Title
    async setTabsTitle(title: string) {
      this.tabsMenuList.forEach((item) => {
        if (item.path == getUrlWithParams()) item.title = title;
      });
    },
  },
  // 持久化配置
  persist: piniaPersistConfig('aster-tabs'),
});
