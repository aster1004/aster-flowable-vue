<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-16 11:50:31
 * @FilePath: \aster-flowable-vue\src\components\loading\index.vue
 * @Description: loading
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="loading-box">
    <div class="loading-wrap">
      <span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>
    </div>
  </div>
</template>

<script setup lang="ts" name="Loading"></script>

<style scoped lang="scss">
  .loading-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .loading-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 98px;
    }
  }
  .dot {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    width: 32px;
    height: 32px;
    font-size: 32px;
    transform: rotate(45deg);
    animation: ant-rotate 1.2s infinite linear;
  }
  .dot i {
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    background-color: var(--el-color-primary);
    border-radius: 100%;
    opacity: 0.3;
    transform: scale(0.75);
    transform-origin: 50% 50%;
    animation: ant-spin-move 1s infinite linear alternate;
  }
  .dot i:nth-child(1) {
    top: 0;
    left: 0;
  }
  .dot i:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.4s;
  }
  .dot i:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }
  .dot i:nth-child(4) {
    bottom: 0;
    left: 0;
    animation-delay: 1.2s;
  }

  @keyframes ant-rotate {
    to {
      transform: rotate(405deg);
    }
  }

  @keyframes ant-spin-move {
    to {
      opacity: 1;
    }
  }
</style>
