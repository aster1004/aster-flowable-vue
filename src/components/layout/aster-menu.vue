<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 17:36:44
 * @FilePath: \aster-flowable-vue\src\components\layout\aster-menu.vue
 * @Description: 菜单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <template v-for="menu in menuList">
    <el-sub-menu v-if="menu.children && menu.children?.length" :index="menu.path" :key="menu.path">
      <template #title>
        <i :class="menu.icon"></i>
        <span>{{ menu.name }}</span>
      </template>
      <aster-menu :menu-list="menu.children" />
    </el-sub-menu>
    <el-menu-item
      v-else
      :index="menu.path"
      @click="handleClickMenu(menu)"
      :key="menu.path + 'el-menu-item'"
    >
      <i :class="menu.icon"></i>
      <template #title>
        <span>{{ menu.name }}</span>
      </template>
    </el-menu-item>
  </template>
</template>
<script setup lang="ts">
  import { useRouter } from 'vue-router';

  defineProps<{ menuList: Menu.MenuOptions[] }>();

  const router = useRouter();

  const handleClickMenu = (menu: Menu.MenuOptions) => {
    if (menu.openStyle && menu.openStyle == '1') return window.open(menu.path, '_blank');
    router.push(menu.path);
  };
</script>
<style lang="scss">
  .el-sub-menu .el-sub-menu__title:hover {
    color: var(--el-menu-hover-text-color) !important;
    background-color: transparent !important;
  }
  .el-sub-menu {
    i {
      margin: 0 5px;
      width: var(--el-menu-icon-width);
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .el-menu--collapse {
    .is-active {
      .el-sub-menu__title {
        color: #ffffff !important;
        background-color: var(--el-color-primary) !important;
      }
    }
  }
  .el-menu-item {
    i {
      margin: 0 5px;
      width: var(--el-menu-icon-width);
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
    &:hover {
      color: var(--el-menu-hover-text-color);
    }
    &.is-active {
      color: var(--el-menu-active-color) !important;
      background-color: var(--el-menu-active-bg-color) !important;
      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 4px;
        content: '';
        background-color: var(--el-color-primary);
      }
    }
  }
  .vertical,
  .classic,
  .transverse {
    .el-menu-item {
      &.is-active {
        &::before {
          left: 0;
        }
      }
    }
  }
  .columns {
    .el-menu-item {
      &.is-active {
        &::before {
          right: 0;
        }
      }
    }
  }
  .classic,
  .transverse {
    #driver-highlighted-element-stage {
      background-color: #606266 !important;
    }
  }
</style>
