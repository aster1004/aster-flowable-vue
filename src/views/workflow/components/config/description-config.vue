<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-13 15:25:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\description-config.vue
 * @Description: 描述说明配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="描述说明">
      <template #label>
        <div class="flex justify-between items-center">
          <span>描述说明</span>
          <span class="text-xs font-normal">描述说明</span>
        </div>
      </template>
      <el-input type="textarea" v-model="_formItem.title" :rows="2" />
    </el-form-item>
    <el-form-item label="字体大小">
      <el-select v-model="_formItem.props.fontSize">
        <el-option v-for="(item, i) in fontSizeOptions" :key="i" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="字体颜色">
      <color-picker ref="colorPickerRef" v-model="_formItem.props.color" />
    </el-form-item>
    <el-form-item label="显示图标">
      <icon-select
        ref="iconSelectRef"
        v-model:icon="_formItem.props.icon"
        type="button"
        :z-index="9999"
      />
    </el-form-item>
    <el-form-item label="对齐方式">
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

  // 工作流store
  const workFlowStore = useWorkFlowStore();

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
