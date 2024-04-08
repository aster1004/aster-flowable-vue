<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 17:10:55
 * @FilePath: \aster-admin\src\views\layout\layout-vertical.vue
 * @Description: 纵向布局
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="layout vertical">
    <el-aside>
      <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
        <div class="logo flex justify-center items-center">
          <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
          <span v-show="!isCollapse" class="logo-text">{{ title }}</span>
        </div>
        <el-scrollbar>
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :router="false"
            :unique-opened="true"
            :collapse-transition="false"
          >
            <aster-menu :menu-list="menuList" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header>
        <header-left />
        <header-right />
      </el-header>
      <aster-main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutVertical">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useGlobalStore } from '@/stores/modules/global';
  import HeaderLeft from '@/components/header/header-left.vue';
  import HeaderRight from '@/components/header/header-right.vue';
  import AsterMenu from '@/components/layout/aster-menu.vue';
  import AsterMain from '@/components/main/index.vue';
  import { useAuthStore } from '@/stores/modules/auth';

  const title = import.meta.env.VITE_APP_TITLE;

  const globalStore = useGlobalStore();
  const isCollapse = computed(() => globalStore.isCollapse);

  const route = useRoute();
  const activeMenu = computed(() => {
    const path = route.path;
    return path;
  });

  const authStore = useAuthStore();
  const menuList = authStore.authMenuList;
</script>

<style scoped lang="scss">
  .el-container {
    width: 100%;
    height: 100%;
    :deep(.el-aside) {
      width: auto;
      background-color: var(--el-menu-bg-color);
      border-right: 1px solid var(--el-aside-border-color);
      .aside-box {
        display: flex;
        flex-direction: column;
        height: 100%;
        transition: width 0.3s ease;
        .el-scrollbar {
          height: calc(100% - 55px);
          .el-menu {
            width: 100%;
            overflow-x: hidden;
            border-right: none;
          }
        }
        .logo {
          box-sizing: border-box;
          height: 55px;
          .logo-img {
            width: 28px;
            object-fit: contain;
            margin-right: 6px;
          }
          .logo-text {
            font-size: 21.5px;
            font-weight: bold;
            color: var(--el-aside-logo-text-color);
            white-space: nowrap;
          }
        }
      }
    }
    .el-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 55px;
      padding: 0 15px;
      background-color: var(--el-header-bg-color);
      border-bottom: 1px solid var(--el-header-border-color);
    }

    .el-footer {
      height: auto;
      padding: 0;
    }
  }
</style>
