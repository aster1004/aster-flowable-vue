<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 14:29:05
 * @FilePath: \aster-admin\src\components\header\breadCrumb.vue
 * @Description: 面包屑
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div :class="['breadcrumb-box mask-image', !globalStore.breadcrumbIcon && 'no-icon']">
    <el-breadcrumb :separator-icon="ArrowRight">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
          <div class="el-breadcrumb__inner is-link" @click="onBreadcrumbClick(item, index)">
            <i
              :class="item.icon"
              v-show="item.icon && globalStore.breadcrumbIcon"
              class="breadcrumb-icon"
            ></i>
            <span class="breadcrumb-title">{{ item.name }}</span>
          </div>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { HOME_URL } from '@/config';
  import { useRoute, useRouter } from 'vue-router';
  import { ArrowRight } from '@element-plus/icons-vue';
  import { useAuthStore } from '@/stores/modules/auth';
  import { useGlobalStore } from '@/stores/modules/global';
  import { isNotEmpty } from '@/utils';

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const globalStore = useGlobalStore();

  const breadcrumbList = computed(() => {
    let breadcrumbData =
      authStore.breadcrumbListGet[route.matched[route.matched.length - 1].path] ?? [];
    // 🙅‍♀️不需要首页面包屑可删除以下判断
    if (breadcrumbData[0].path !== HOME_URL) {
      breadcrumbData = [
        { path: HOME_URL, icon: 'iconfont icon-SmartHome mr-2px', name: '首页', enName: 'Home' },
        ...breadcrumbData,
      ];
    }
    return breadcrumbData;
  });

  // Click Breadcrumb
  const onBreadcrumbClick = (item: Menu.MenuOptions, index: number) => {
    if (index !== breadcrumbList.value.length - 1 && isNotEmpty(item.component))
      router.push(item.path);
  };
</script>
<style lang="scss" scoped>
  .breadcrumb-box {
    display: flex;
    align-items: center;
    overflow: hidden;
    .el-breadcrumb {
      white-space: nowrap;
      .el-breadcrumb__item {
        position: relative;
        display: inline-block;
        float: none;
        .el-breadcrumb__inner {
          display: inline-flex;
          &.is-link {
            color: var(--el-header-text-color);
            &:hover {
              color: var(--el-color-primary);
            }
          }
          .breadcrumb-icon {
            margin-top: 2px;
            margin-right: 6px;
            font-size: 16px;
          }
          .breadcrumb-title {
            margin-top: 3px;
          }
        }
        &:last-child .el-breadcrumb__inner,
        &:last-child .el-breadcrumb__inner:hover {
          color: var(--el-header-text-color-regular);
        }
        :deep(.el-breadcrumb__separator) {
          position: relative;
          top: -1px;
        }
      }
    }
  }
  .no-icon {
    .el-breadcrumb {
      .el-breadcrumb__item {
        top: -2px;
        :deep(.el-breadcrumb__separator) {
          top: 2px;
        }
      }
    }
  }
</style>
