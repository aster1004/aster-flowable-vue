<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:13:40
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\user-picker-config.vue
 * @Description: 用户配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">人员选择</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item label="提示内容">
      <template #label>
        <div class="flex justify-between items-center">
          <span>提示内容</span>
          <span class="text-xs font-normal">提示内容</span>
        </div>
      </template>
      <el-input v-model="_formItem.props.placeholder" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <el-form-item label="是否多选">
      <el-switch v-model="_formItem.props.multiple" />
    </el-form-item>
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
