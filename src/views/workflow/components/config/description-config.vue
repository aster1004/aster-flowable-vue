<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-13 15:25:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\description-config.vue
 * @Description: 描述说明配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.description')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.description') }}</span>
          <span class="text-xs font-normal">描述说明</span>
        </div>
      </template>
      <el-input type="textarea" v-model="_formItem.title" :rows="3" :maxlength="maxlength" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.fontSize')">
      <el-select v-model="_formItem.props.fontSize">
        <el-option v-for="(item, i) in fontSizeOptions" :key="i" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.fontColor')">
      <color-picker ref="colorPickerRef" v-model="_formItem.props.color" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.showIcon')">
      <icon-select
        ref="iconSelectRef"
        v-model:icon="_formItem.props.icon"
        type="icon"
        :z-index="9999"
      />
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
  import ColorPicker from '@/components/color/color-picker.vue';
  import IconSelect from '@/components/icon/icon-select.vue';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 输入长度限制
  const maxlength = 1000;
  // 字体大小
  const fontSizeOptions = ref([
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
  ]);

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
