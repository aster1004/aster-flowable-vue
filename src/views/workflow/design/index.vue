<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-15 17:45:56
 * @FilePath: \aster-flowable-vue\src\views\workflow\design\index.vue
 * @Description: 流程设计
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="design-container">
    <el-header class="design-header">
      <design-header ref="designHeaderRef" v-model="activeMenu" @save="save" @publish="publish" />
    </el-header>
    <el-main class="design-main">
      <form-design ref="formDesignRef" v-show="activeMenu === 'formDesign'" />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import DesignHeader from './design-header.vue';
  import FormDesign from '../form/form-design.vue';

  const activeMenu = ref('formDesign');

  /**
   * @description 保存
   */
  const save = () => {
    console.log('save');
  };

  /**
   * @description 发布
   */
  const publish = () => {
    console.log('publish');
  };
</script>
<style scoped lang="scss">
  .design-container {
    height: 100%;
    background-color: #f2f3f5;
  }

  .design-header {
    height: 60px;
    padding: 0 !important;
  }

  .design-main {
    height: calc(100% - 60px);
    margin: 15px 15px 5px;
    padding: 0 !important;
  }
</style>
