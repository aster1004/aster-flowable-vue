<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 14:18:30
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\select-single-config.vue
 * @Description: 单选框配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">单选框</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <select-config ref="singleConfigRef" v-model:form-item="_formItem" />
    <el-form-item label="提示语">
      <el-input v-model="_formItem.props.placeholder" placeholder="请设置提示语" />
    </el-form-item>
    <el-form-item label="必填项">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import SelectConfig from './select-config.vue';
  import { computed } from 'vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
