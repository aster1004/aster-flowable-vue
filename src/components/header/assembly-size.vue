<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-02 10:02:01
 * @FilePath: \aster-admin\src\components\header\assembly-size.vue
 * @Description: 全局字体大小
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dropdown trigger="click" @command="setAssemblySize" id="assemblySize">
    <i :class="'iconfont icon-font-size'" class="toolBar-icon"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in assemblySizeList"
          :key="item.value"
          :command="item.value"
          :disabled="assemblySize === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useGlobalStore } from '@/stores/modules/global';
  import { AssemblySizeType } from '@/stores/interface';

  const globalStore = useGlobalStore();
  const assemblySize = computed(() => globalStore.assemblySize);

  const assemblySizeList = [
    { label: '默认', value: 'default' },
    { label: '大型', value: 'large' },
    { label: '小型', value: 'small' },
  ];

  const setAssemblySize = (item: AssemblySizeType) => {
    if (assemblySize.value === item) return;
    globalStore.setGlobalState('assemblySize', item);
  };
</script>
