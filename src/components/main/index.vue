<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-04 15:06:09
 * @FilePath: \aster-admin\src\components\main\index.vue
 * @Description: main
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <aster-maximize v-if="maximize" />
  <aster-tabs v-if="tabs" />
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <aster-footer v-if="footer" />
</template>
<script setup lang="ts">
  import { onBeforeUnmount, provide, ref, watch } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/modules/global';
  import { useKeepAliveStore } from '@/stores/modules/keepAlive';
  import AsterFooter from '@/components/layout/aster-footer.vue';
  import AsterTabs from '@/components/tabs/index.vue';
  import AsterMaximize from '@/components/maximize/index.vue';

  const globalStore = useGlobalStore();
  const { tabs, footer, maximize, isCollapse } = storeToRefs(globalStore);

  const keepAliveStore = useKeepAliveStore();
  const { keepAliveName } = storeToRefs(keepAliveStore);

  // 注入刷新页面方法
  const isRouterShow = ref(true);
  const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
  provide('refresh', refreshCurrentPage);

  // 监听当前页面是否最大化，动态添加 class
  watch(
    () => maximize.value,
    () => {
      const app = document.getElementById('app') as HTMLElement;
      if (maximize.value) app.classList.add('main-maximize');
      else app.classList.remove('main-maximize');
    },
    { immediate: true },
  );

  // 监听窗口大小变化，折叠侧边栏
  const screenWidth = ref(0);
  const listeningWindow = useDebounceFn(() => {
    screenWidth.value = document.body.clientWidth;
    if (!isCollapse.value && screenWidth.value < 1200)
      globalStore.setGlobalState('isCollapse', true);
    if (isCollapse.value && screenWidth.value > 1200)
      globalStore.setGlobalState('isCollapse', false);
  }, 100);
  window.addEventListener('resize', listeningWindow, false);
  onBeforeUnmount(() => {
    window.removeEventListener('resize', listeningWindow);
  });
</script>
<style lang="scss" scoped>
  .el-main {
    box-sizing: border-box;
    padding: 10px 12px;
    overflow-x: hidden;
    background-color: var(--el-bg-color-page);
  }
  .el-footer {
    height: auto;
    padding: 0;
  }
</style>
