<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 18:33:43
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\date-time-range-config.vue
 * @Description: 日期范围配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">日期</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" :maxlength="TITLE_MAXLENGTH" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.dateFormat')">
      <el-select v-model="_formItem.props.format" placeholder="请选择日期格式">
        <el-option
          v-for="(item, index) in formatOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.displayDuration')">
      <el-switch v-model="_formItem.props.showLength" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { TITLE_MAXLENGTH } from '@/config/formConfig';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 日期格式
  const formatOptions = ref([
    { label: '年-月-日', value: 'YYYY-MM-DD' },
    { label: '年-月-日 时:分', value: 'YYYY-MM-DD HH:mm' },
    { label: '年-月-日 时:分:秒', value: 'YYYY-MM-DD HH:mm:ss' },
  ]);

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
