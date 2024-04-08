<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-16 14:10:46
 * @FilePath: \aster-flowable-vue\src\components\maximize\index.vue
 * @Description: 最大化
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="maximize" @click="exitMaximize">
    <i class="iconfont icon-close"></i>
  </div>
</template>

<script setup lang="ts">
  import { useGlobalStore } from '@/stores/modules/global';

  const globalStore = useGlobalStore();
  const exitMaximize = () => {
    globalStore.setGlobalState('maximize', false);
  };
</script>

<style scoped lang="scss">
  .maximize {
    position: fixed;
    top: -25px;
    right: -25px;
    z-index: 999;
    width: 55px;
    height: 55px;
    cursor: pointer;
    background-color: var(--el-color-info);
    border-radius: 50%;
    opacity: 0.9;
    &:hover {
      background-color: var(--el-color-info-dark-2);
    }
    .iconfont {
      position: relative;
      top: 46%;
      left: 19%;
      font-size: 14px;
      color: #ffffff;
    }
  }
</style>
