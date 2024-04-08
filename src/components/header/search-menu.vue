<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-01 16:27:27
 * @FilePath: \aster-admin\src\components\header\search-menu.vue
 * @Description: 菜单搜索
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="menu-search-dialog" id="searchMenu">
    <i :class="'iconfont icon-sousuo'" class="toolBar-icon" @click="handleOpen"></i>
    <el-dialog
      v-model="isShowSearch"
      destroy-on-close
      :modal="false"
      :show-close="false"
      :lock-scroll="false"
      fullscreen
      @click="closeSearch"
    >
      <el-autocomplete
        ref="menuInputRef"
        v-model="searchMenu"
        value-key="path"
        placeholder="菜单搜索 ：支持菜单名称、路径"
        :fetch-suggestions="searchMenuList"
        @select="handleClickMenu"
        @click.stop
      >
        <template #prefix>
          <i class="iconfont icon-sousuo"></i>
        </template>
        <template #default="{ item }">
          <i :class="item.icon"></i>
          <span> {{ item.name }} </span>
        </template>
      </el-autocomplete>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/modules/auth';

  const router = useRouter();
  const authStore = useAuthStore();

  const menuList = computed(() =>
    authStore.flatMenuListGet.filter((item) => item.isHide == '1' && item.type == '1'),
  );

  const searchMenuList = (queryString: string, cb: Function) => {
    const results = queryString
      ? menuList.value.filter(filterNodeMethod(queryString))
      : menuList.value;
    console.log('menu--->', results);
    cb(results);
  };

  // 打开搜索框
  const isShowSearch = ref(false);
  const menuInputRef = ref();
  const searchMenu = ref('');

  const handleOpen = () => {
    isShowSearch.value = true;
    nextTick(() => {
      setTimeout(() => {
        menuInputRef.value.focus();
      });
    });
  };

  // 搜索窗关闭
  const closeSearch = () => {
    isShowSearch.value = false;
  };

  // 筛选菜单
  const filterNodeMethod = (queryString: string) => {
    return (restaurant: Menu.MenuOptions) => {
      return (
        restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
        restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1
      );
    };
  };

  // 点击菜单跳转
  const handleClickMenu = (menuItem: Menu.MenuOptions | Record<string, any>) => {
    searchMenu.value = '';
    if (menuItem.openStyle && menuItem.openStyle == '1') window.open(menuItem.path, '_blank');
    else router.push(menuItem.path);
    closeSearch();
  };
</script>
<style scoped lang="scss">
  .menu-search-dialog {
    :deep(.el-dialog) {
      background-color: rgb(0 0 0 / 50%);
      border-radius: 0 !important;
      box-shadow: unset !important;
      .el-dialog__header {
        border-bottom: none !important;
      }
    }
    :deep(.el-autocomplete) {
      position: absolute;
      top: 100px;
      left: 50%;
      width: 550px;
      transform: translateX(-50%);
      .el-input__wrapper {
        background-color: var(--el-bg-color);
      }
    }
  }
  .el-autocomplete__popper {
    .el-icon {
      position: relative;
      top: 2px;
      font-size: 16px;
    }
    span {
      margin: 0 0 0 10px;
      font-size: 14px;
    }
  }
</style>
