<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 17:58:02
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\upload-image-config.vue
 * @Description: 图片配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">图片</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" :maxlength="TITLE_MAXLENGTH" />
    </el-form-item>

    <el-form-item>
      <template #label>
        <span>{{ t('workflow.component.imageSize') }}</span>
        <el-tooltip content="限制单个图片最大大小-MB（为0则不限制）" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input-number
        v-model="_formItem.props.maxSize"
        :min="0"
        controls-position="right"
        placeholder="单个文件最大大小"
      />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>{{ t('workflow.component.imageNum') }}</span>
        <el-tooltip content="限制最大上传数量（为0则不限制）" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input-number
        v-model="_formItem.props.maxNumber"
        :min="0"
        controls-position="right"
        placeholder="最多上传几张图片"
      />
    </el-form-item>
    <el-form-item :label="t('workflow.component.imageZip')">
      <el-switch v-model="_formItem.props.enableZip" />
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
