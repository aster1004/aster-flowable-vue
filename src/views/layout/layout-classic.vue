<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-16 17:45:48
 * @FilePath: \aster-flowable-vue\src\views\layout\layout-classic.vue
 * @Description: 经典布局
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="layout classic">
    <el-header>
      <div class="header-lf mask-image">
        <div class="logo flex justify-center items-center">
          <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
          <span class="logo-text">{{ title }}</span>
        </div>
        <header-left />
      </div>
      <div class="header-ri">
        <header-right />
      </div>
    </el-header>
    <el-container class="classic-content">
      <el-aside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
          <el-scrollbar>
            <el-menu
              :default-active="activeMenu"
              :router="false"
              :collapse="isCollapse"
              :collapse-transition="false"
              :unique-opened="true"
            >
              <aster-menu :menu-list="menuList" />
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-container class="classic-main">
        <aster-main />
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutClassic">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useGlobalStore } from '@/stores/modules/global';
  import HeaderLeft from '@/components/header/header-left.vue';
  import HeaderRight from '@/components/header/header-right.vue';
  import AsterMenu from '@/components/layout/aster-menu.vue';
  import AsterMain from '@/components/main/index.vue';
  import { useAuthStore } from '@/stores/modules/auth';

  const title = import.meta.env.VITE_APP_TITLE;

  const route = useRoute();
  const authStore = useAuthStore();
  const globalStore = useGlobalStore();
  const isCollapse = computed(() => globalStore.isCollapse);
  const menuList = computed(() => authStore.showMenuListGet);
  const activeMenu = computed(() => {
    const path = route.path;
    return path;
  });
</script>

<style scoped lang="scss">
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 55px;
      padding: 0 15px 0 0;
      background-color: var(--el-header-bg-color);
      border-bottom: 1px solid var(--el-header-border-color);
      .header-lf {
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        .logo {
          flex-shrink: 0;
          width: 210px;
          margin-right: 16px;
          .logo-img {
            width: 28px;
            object-fit: contain;
            margin-right: 6px;
          }
          .logo-text {
            font-size: 21.5px;
            font-weight: bold;
            color: var(--el-header-logo-text-color);
            white-space: nowrap;
          }
        }
      }
    }
    .classic-content {
      display: flex;
      height: calc(100% - 55px);
      :deep(.el-aside) {
        width: auto;
        background-color: var(--el-menu-bg-color);
        border-right: 1px solid var(--el-aside-border-color);
        .aside-box {
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: width 0.3s ease;
          .el-menu {
            width: 100%;
            overflow-x: hidden;
            border-right: none;
          }
        }
      }
      .classic-main {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .mask-image {
    padding-right: 50px;
    mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
  }
</style>
