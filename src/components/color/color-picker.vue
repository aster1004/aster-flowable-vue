<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-25 09:53:47
 * @FilePath: \aster-flowable-vue\src\components\color\color-picker.vue
 * @Description: 颜色选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->

<template>
  <div>
    <el-color-picker
      :model-value="modelValue"
      show-alphax
      :size="size"
      :predefine="colors"
      :validate-event="validate"
      @change="handleChange"
    />
  </div>
</template>
<script setup lang="ts">
  import { PropType } from 'vue';
  import { isEmpty } from '@/utils';

  const emits = defineEmits(['update:modelValue']);
  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    size: {
      type: String as PropType<'large' | 'default' | 'small'>,
      default: () => 'small',
    },
    validate: {
      type: Boolean,
      default: () => false,
    },
  });

  // 颜色
  const colors = [
    '#fd726d',
    '#ff8c00',
    '#daa96e',
    '#409eff',
    '#0c819f',
    '#009688',
    '#27ae60',
    '#9b59b6',
    '#e6e6e6',
    '#2c2c2c',
  ];

  /**
   * @description: 颜色值改变
   * @param {string} val
   * @return {*}
   */
  const handleChange = (val: string) => {
    if (isEmpty(val)) {
      emits('update:modelValue', '');
    } else {
      emits('update:modelValue', val);
    }
  };
</script>
<style scoped lang="scss"></style>
