<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:43:50
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\signature-config.vue
 * @Description: 签名配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">签名</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" :maxlength="TITLE_MAXLENGTH" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.showLineWidth')">
      <el-switch v-model="_formItem.props.showLineWidth" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.showLineColor')">
      <el-switch v-model="_formItem.props.showLineColor" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.allowLocal')">
      <el-switch v-model="_formItem.props.showLocal" />
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
  import { TITLE_MAXLENGTH } from '@/config/formConfig';

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
