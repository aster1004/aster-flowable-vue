<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-08 09:41:39
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\grid-layout-config.vue
 * @Description: 一行多列配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件编码"> </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed } from 'vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
