<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-10 14:54:53
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\grid-title-config.vue
 * @Description: 分组标题配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">分组标题</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.fontSize')">
      <el-select v-model="_formItem.props.fontSize">
        <el-option v-for="(item, i) in fontSizeOptions" :key="i" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.fontWeight')">
      <el-select v-model="_formItem.props.fontWeight">
        <el-option
          v-for="(item, i) in fontWeightOptions"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.justifiy')">
      <el-select v-model="_formItem.props.justify">
        <el-option
          v-for="(item, i) in justifyOptions"
          :key="i"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 字体大小
  const fontSizeOptions = [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
  ];
  // 字体粗细
  const fontWeightOptions = [
    { label: '100', value: 'font-100' },
    { label: '200', value: 'font-200' },
    { label: '300', value: 'font-300' },
    { label: '400', value: 'font-400' },
    { label: '500', value: 'font-500' },
    { label: '600', value: 'font-600' },
    { label: '700', value: 'font-700' },
    { label: '800', value: 'font-800' },
    { label: '900', value: 'font-900' },
  ];

  // 对齐方式
  const justifyOptions = ref([
    { label: '居左', value: 'justify-start' },
    { label: '居右', value: 'justify-end' },
    { label: '居中', value: 'justify-center' },
  ]);

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
