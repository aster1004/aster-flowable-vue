<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 17:14:12
 * @FilePath: \aster-admin\src\components\tabs\components\MoreButton.vue
 * @Description: 标签栏按钮
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dropdown trigger="click" :teleported="false">
    <div class="more-button">
      <i :class="'iconfont icon-xiangxia'"></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refresh">
          <i class="iconfont icon-shuaxin"></i>{{ $t('tabs.refresh') }}
        </el-dropdown-item>
        <el-dropdown-item @click="maximize">
          <i class="iconfont icon-quanping"></i>{{ $t('tabs.maximize') }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrentTab">
          <i class="iconfont icon-guanbi"></i>{{ $t('tabs.closeCurrent') }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeTabsOnSide('left')">
          <i class="iconfont icon-xiangzuo1"></i>{{ $t('tabs.closeLeft') }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeTabsOnSide('right')">
          <i class="iconfont icon-xiangyou1"></i>{{ $t('tabs.closeRight') }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeOtherTab">
          <i class="iconfont icon-guanbi1"></i>{{ $t('tabs.closeOther') }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab">
          <i class="iconfont icon-gongjulan"></i>{{ $t('tabs.closeAll') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { inject, nextTick, onBeforeUnmount, ref } from 'vue';
  import { HOME_URL } from '@/config';
  import { useTabsStore } from '@/stores/modules/tabs';
  import { useGlobalStore } from '@/stores/modules/global';
  import { useKeepAliveStore } from '@/stores/modules/keepAlive';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const tabStore = useTabsStore();
  const globalStore = useGlobalStore();
  const keepAliveStore = useKeepAliveStore();
  const timer = ref();

  // refresh current page
  const refreshCurrentPage: Function = inject('refresh') as Function;

  const refresh = () => {
    timer.value = setTimeout(() => {
      keepAliveStore.removeKeepAliveName(route.name as string);
      refreshCurrentPage(false);
      nextTick(() => {
        keepAliveStore.addKeepAliveName(route.name as string);
        refreshCurrentPage(true);
      });
    }, 0);
  };

  // maximize current page
  const maximize = () => {
    globalStore.setGlobalState('maximize', true);
  };

  // Close Current
  const closeCurrentTab = () => {
    console.log(route);
    if (route.meta.isAffix == '0') return;
    tabStore.removeTabs(route.fullPath);
  };

  // Close Side
  const closeTabsOnSide = (type: 'left' | 'right') => {
    tabStore.closeTabsOnSide(route.fullPath, type);
  };

  // Close Other
  const closeOtherTab = () => {
    tabStore.closeMultipleTab(route.fullPath);
  };

  // Close All
  const closeAllTab = () => {
    tabStore.closeMultipleTab();
    router.push(HOME_URL);
  };

  /** 页面销毁前清除定时器 */
  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });
</script>

<style scoped lang="scss">
  @import '../index.scss';
</style>
