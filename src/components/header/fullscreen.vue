<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-15 18:05:42
 * @FilePath: \aster-flowable-vue\src\components\header\fullscreen.vue
 * @Description: 全屏
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="fullscreen" id="fullscreen">
    <i
      :class="['iconfont', isFullscreen ? 'icon-suoxiao' : 'icon-quanping']"
      class="toolBar-icon"
      @click="handleFullScreen"
    ></i>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import screenfull from 'screenfull';

  const isFullscreen = ref(screenfull.isFullscreen);

  onMounted(() => {
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) isFullscreen.value = true;
      else isFullscreen.value = false;
    });
  });

  const handleFullScreen = () => {
    if (!screenfull.isEnabled) ElMessage.warning('当前您的浏览器不支持全屏 ❌');
    screenfull.toggle();
  };
</script>
