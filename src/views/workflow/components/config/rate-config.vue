<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 11:05:30
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\rate-config.vue
 * @Description: 评分配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">评分</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.maxScore')">
      <el-input-number v-model="_formItem.props.max" :min="1" controls-position="right" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.allowHalf')">
      <el-switch v-model="_formItem.props.allowHalf" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.showScore')">
      <el-switch v-model="_formItem.props.showScore" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
