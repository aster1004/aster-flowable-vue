<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:43:50
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\signature-combine-config.vue
 * @Description: 签章控件配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">签章</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item label="显示签名">
      <el-switch v-model="_formItem.props.showSignature" />
    </el-form-item>
    <el-form-item label="允许上传本地签名">
      <el-switch v-model="_formItem.props.showLocal" />
    </el-form-item>
    <el-form-item label="显示签章">
      <el-switch v-model="_formItem.props.showSignatureCombine" />
    </el-form-item>
    <el-form-item label="签章大小">
      <el-input-number v-model="_formItem.props.signSize" :controls="false" />
    </el-form-item>
    <el-form-item label="显示日期">
      <el-switch v-model="_formItem.props.showDate" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
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
