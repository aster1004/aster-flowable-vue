<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 17:11:18
 * @FilePath: \aster-flowable-vue\src\views\layout\layout-columns.vue
 * @Description: 分栏布局
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="layout columns">
    <div class="aside-split">
      <div class="logo flex justify-center items-center">
        <img class="logo-img" src="@/assets/images/logo.png" alt="logo" />
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div
            v-for="(item, index) in menuList"
            :key="'menu_' + index"
            class="split-item"
            :class="{
              'split-active':
                splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path,
            }"
            @click="changeSubMenu(item)"
          >
            <i :class="item.icon"></i>
            <span class="title">{{ item.name }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside
      :class="{ 'not-aside': !subMenuList.length }"
      :style="{ width: isCollapse ? '65px' : '210px' }"
    >
      <div class="logo flex justify-center items-center">
        <span class="logo-text">{{ isCollapse ? 'A' : title }}</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :router="false"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <aster-menu :menu-list="subMenuList" />
        </el-menu>
      </el-scrollbar>
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

<script setup lang="ts" name="layoutColumns">
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGlobalStore } from '@/stores/modules/global';
  import HeaderLeft from '@/components/header/header-left.vue';
  import HeaderRight from '@/components/header/header-right.vue';
  import AsterMenu from '@/components/layout/aster-menu.vue';
  import AsterMain from '@/components/main/index.vue';
  import { useAuthStore } from '@/stores/modules/auth';

  const title = import.meta.env.VITE_APP_TITLE;

  const route = useRoute();
  const router = useRouter();
  const globalStore = useGlobalStore();
  const isCollapse = computed(() => globalStore.isCollapse);

  const authStore = useAuthStore();
  const menuList = authStore.authMenuList;

  const subMenuList = ref<Menu.MenuOptions[]>([]);
  const splitActive = ref('');
  watch(
    () => [menuList, route],
    () => {
      // 当前菜单没有数据直接 return
      if (!menuList.length) return;
      splitActive.value = route.path;

      const menuItem = menuList.filter((item: Menu.MenuOptions) => {
        return route.path === item.path || `/${route.path.split('/')[1]}` === item.path;
      });
      if (menuItem.length > 0 && menuItem[0].children?.length)
        return (subMenuList.value = menuItem[0].children);
      subMenuList.value = [];
    },
    {
      deep: true,
      immediate: true,
    },
  );

  // change SubMenu
  const changeSubMenu = (item: Menu.MenuOptions) => {
    splitActive.value = item.path;
    if (item.children && item.children.length) {
      return (subMenuList.value = item.children);
    }
    subMenuList.value = [];
    router.push(item.path);
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
    .aside-split {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 70px;
      height: 100%;
      background-color: var(--el-menu-bg-color);
      border-right: 1px solid var(--el-aside-border-color);
      .logo {
        box-sizing: border-box;
        height: 55px;
        .logo-img {
          width: 32px;
          object-fit: contain;
        }
      }
      .el-scrollbar {
        height: calc(100% - 55px);
        .split-list {
          flex: 1;
          .split-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 70px;
            cursor: pointer;
            transition: all 0.3s ease;
            .el-icon {
              font-size: 20px;
            }
            .title {
              margin-top: 6px;
              font-size: 12px;
            }
            .el-icon,
            .title {
              color: var(--el-menu-text-color);
            }
          }
          .split-active {
            background-color: var(--el-color-primary) !important;
            .el-icon,
            .title {
              color: #ffffff !important;
            }
          }
        }
      }
    }
    .not-aside {
      width: 0 !important;
      border-right: none !important;
    }
    .el-aside {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background-color: var(--el-menu-bg-color);
      border-right: 1px solid var(--el-aside-border-color);
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
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: var(--el-aside-logo-text-color);
          white-space: nowrap;
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
      border-bottom: 1px solid var(--el-border-color-light);
    }
  }
</style>
