<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-16 13:54:08
 * @FilePath: \aster-flowable-vue\src\components\header\theme-setting.vue
 * @Description: 样式配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <i class="iconfont icon-pifu" @click="showTheme" id="themeSetting"></i>
</template>
<script setup lang="ts">
  import mittBus from '@/utils/mittBus';
  const showTheme = () => {
    mittBus.emit('openThemeDrawer');
  };
</script>
<style lang="scss"></style>
