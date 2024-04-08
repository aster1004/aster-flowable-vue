<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 17:14:12
 * @FilePath: \aster-admin\src\components\tabs\index.vue
 * @Description: 标签
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="item in tabsMenuList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.close"
        >
          <template #label>
            <i :class="item.icon" v-show="item.icon && tabsIcon" class="tabs-icon"></i>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
      <MoreButton />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Sortable from 'sortablejs';
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGlobalStore } from '@/stores/modules/global';
  import { useTabsStore } from '@/stores/modules/tabs';
  import { useAuthStore } from '@/stores/modules/auth';
  import { TabsPaneContext, TabPaneName } from 'element-plus';
  import MoreButton from './components/MoreButton.vue';

  const route = useRoute();
  const router = useRouter();
  const tabStore = useTabsStore();
  const authStore = useAuthStore();
  const globalStore = useGlobalStore();

  const tabsMenuValue = ref(route.fullPath);
  const tabsMenuList = computed(() => tabStore.tabsMenuList);
  const tabsIcon = computed(() => globalStore.tabsIcon);

  // 初始化需要固定的 tabs
  const initTabs = () => {
    authStore.flatMenuListGet.forEach((item) => {
      if (item.isAffix == '0' && !(item.isHide == '0')) {
        const tabsParams = {
          icon: item.icon,
          title: item.name,
          path: item.path,
          name: item.name,
          close: !(item.isAffix == '0'),
          isKeepAlive: item.isKeepAlive == '0',
        };
        tabStore.addTabs(tabsParams);
      }
    });
  };

  // tabs 拖拽排序
  const tabsDrop = () => {
    Sortable.create(document.querySelector('.el-tabs__nav') as HTMLElement, {
      draggable: '.el-tabs__item',
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        const tabsList = [...tabStore.tabsMenuList];
        const currRow = tabsList.splice(oldIndex as number, 1)[0];
        tabsList.splice(newIndex as number, 0, currRow);
        tabStore.setTabs(tabsList);
      },
    });
  };

  // Tab add
  const tabAdd = () => {
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: !(route.meta.isAffix == '0'),
      isKeepAlive: (route.meta.isKeepAlive == '0') as boolean,
    };
    tabStore.addTabs(tabsParams);
    tabsMenuValue.value = route.fullPath;
  };

  // Tab Click
  const tabClick = (tabItem: TabsPaneContext) => {
    const fullPath = tabItem.props.name as string;
    router.push(fullPath);
  };

  // Remove Tab
  const tabRemove = (fullPath: TabPaneName) => {
    tabStore.removeTabs(fullPath as string, fullPath == route.fullPath);
  };

  onMounted(() => {
    tabsDrop();
    initTabs();
  });

  // 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
  watch(
    () => route.fullPath,
    () => {
      if (route.meta.isFull) return;
      tabAdd();
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss">
  @import './index.scss';
</style>
