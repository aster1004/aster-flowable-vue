<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-16 14:18:46
 * @FilePath: \aster-flowable-vue\src\components\header\header-left.vue
 * @Description: 左头部
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="header-lf">
    <!-- 折叠菜单 -->
    <div class="mr-20px font-bold" id="collapseIcon">
      <i
        @click="changeCollapse()"
        :class="['iconfont', isCollapse ? 'icon-zhankai' : 'icon-shouqi']"
      ></i>
    </div>
    <!-- 面包屑 -->
    <bread-crumb id="breadcrumb" v-if="globalStore.breadcrumb" />
  </div>
</template>
<script setup lang="ts">
  import { useGlobalStore } from '@/stores/modules/global';
  import { computed } from 'vue';
  import breadCrumb from './breadCrumb.vue';

  const globalStore = useGlobalStore();

  const isCollapse = computed(() => globalStore.isCollapse);

  const changeCollapse = () => globalStore.setGlobalState('isCollapse', !globalStore.isCollapse);
</script>
<style lang="scss" scoped>
  .header-lf {
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      font-size: 22px;
      color: var(--el-header-text-color);
      cursor: pointer;
    }

    .logo-text {
      color: var(--el-header-text-color-regular);
      cursor: pointer;
      font-size: 14px;

      i {
        font-size: 14px;
        color: inherit;
      }
    }
    .logo-text:hover {
      color: var(--el-color-primary);
    }
  }
</style>
