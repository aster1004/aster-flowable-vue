<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:42:39
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\area-config.vue
 * @Description: 省市区配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div style="width: 100%" v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">省市区</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.areaLevel')">
      <el-select v-model="_formItem.props.level">
        <el-option
          v-for="(item, index) in levelOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.placeholder')">
      <el-input v-model="_formItem.props.placeholder" />
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

  // 地区级别
  const levelOptions = [
    { label: '省', value: 1 },
    { label: '省-市', value: 2 },
    { label: '省-市-区', value: 3 },
  ];

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
