<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 17:58:30
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\upload-file-config.vue
 * @Description: 附件配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">附件</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>

    <el-form-item>
      <template #label>
        <span>附件大小</span>
        <el-tooltip content="限制单个附件最大大小-MB（为0则不限制）" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input-number
        v-model="_formItem.props.maxSize"
        :min="0"
        controls-position="right"
        placeholder="单个附件最大大小"
      />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>附件数量</span>
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
    <el-form-item>
      <template #label>
        <span>附件类型</span>
        <el-tooltip content="限制附件上传类型（为空则不限制）" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-select v-model="_formItem.props.fileTypes" multiple clearable>
        <el-option
          v-for="(item, index) in acceptList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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

  // 附件类型
  const acceptList = [
    { label: '图像', value: 'image/*' },
    { label: '视频', value: 'video/*' },
    { label: '音频', value: 'audio/*' },
    {
      label: '文档',
      value: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv',
    },
    { label: '压缩', value: '.zip,.rar,.7z,.tar.gz' },
    { label: '其他', value: '.html,.css,.js,.json,.vue,.java,.class,.exe' },
  ];
</script>
<style scoped lang="scss"></style>
