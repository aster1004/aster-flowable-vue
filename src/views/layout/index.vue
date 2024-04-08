<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 17:10:47
 * @FilePath: \aster-admin\src\views\layout\index.vue
 * @Description: 布局
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <suspense>
    <template #default>
      <component :is="LayoutComponents[layout]" />
    </template>
    <template #fallback>
      <aster-loading />
    </template>
  </suspense>

  <theme-drawer />
</template>
<script setup lang="ts">
  import { LayoutType } from '@/stores/interface';
  import { computed, type Component } from 'vue';
  import { useGlobalStore } from '@/stores/modules/global';
  import LayoutVertical from './layout-vertical.vue';
  import LayoutTransverse from './layout-transverse.vue';
  import LayoutClassic from './layout-classic.vue';
  import LayoutColumns from './layout-columns.vue';
  import ThemeDrawer from '@/components/theme/theme-drawer.vue';
  import AsterLoading from '@/components/loading/index.vue';

  const LayoutComponents: Record<LayoutType, Component> = {
    vertical: LayoutVertical, // 纵向布局
    classic: LayoutClassic, // 经典布局
    transverse: LayoutTransverse, // 横向布局
    columns: LayoutColumns, // 分栏布局
  };

  const globalStore = useGlobalStore();
  const layout = computed(() => globalStore.layout);
</script>
