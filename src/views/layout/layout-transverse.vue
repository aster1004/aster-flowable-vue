<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 17:11:11
 * @FilePath: \aster-flowable-vue\src\views\layout\layout-transverse.vue
 * @Description: 横向布局
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="layout transverse">
    <el-header>
      <div class="logo flex justify-center items-center">
        <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
        <span class="logo-text">{{ title }}</span>
      </div>
      <el-menu mode="horizontal" :default-active="activeMenu" :router="false" :unique-opened="true">
        <!-- 不能直接使用 SubMenu 组件，无法触发 el-menu 隐藏省略功能 -->
        <template v-for="(menu, index) in menuList">
          <el-sub-menu
            v-if="menu.children?.length"
            :key="'sub-menu_' + index"
            :index="menu.path + 'el-sub-menu'"
          >
            <template #title>
              <i :class="menu.icon"></i>
              <span>{{ menu.name }}</span>
            </template>
            <aster-menu :menu-list="menu.children" />
          </el-sub-menu>
          <el-menu-item
            v-else
            :key="'menu-item_' + index"
            :index="menu.path"
            @click="handleClickMenu(menu)"
          >
            <i :class="menu.icon"></i>
            <template #title>
              <span>{{ menu.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <header-right />
    </el-header>
    <aster-main />
  </el-container>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import HeaderRight from '@/components/header/header-right.vue';
  import AsterMain from '@/components/main/index.vue';
  import { useAuthStore } from '@/stores/modules/auth';

  const title = import.meta.env.VITE_APP_TITLE;

  const authStore = useAuthStore();
  const menuList = authStore.authMenuList;

  const route = useRoute();
  const router = useRouter();

  const handleClickMenu = (menu: Menu.MenuOptions) => {
    if (menu.openStyle && menu.openStyle == '1') return window.open(menu.path, '_blank');
    router.push(menu.path);
  };

  const activeMenu = computed(() => {
    const path = route.path;
    return path;
  });
</script>
<style lang="scss">
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
      .logo {
        width: 210px;
        margin-right: 30px;
        .logo-img {
          width: 28px;
          height: 28px;
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
      .el-menu {
        flex: 1;
        height: 100%;
        overflow: hidden;
        border-bottom: none;
        .el-sub-menu__hide-arrow {
          width: 65px;
          height: 55px;
        }
        .el-sub-menu .el-icon.el-sub-menu__icon-more {
          margin: 0 !important;
        }
        .el-menu-item.is-active {
          color: #ffffff !important;
        }
        .is-active {
          background-color: var(--el-color-primary) !important;
          border-bottom-color: var(--el-color-primary) !important;
          &::before {
            width: 0;
          }
          .el-sub-menu__title {
            color: #ffffff !important;
            background-color: var(--el-color-primary) !important;
            border-bottom-color: var(--el-color-primary) !important;
          }
        }
      }
    }

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

    @media screen and (width <= 730px) {
      .logo {
        display: none !important;
      }
    }
  }
</style>
