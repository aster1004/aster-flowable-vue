<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 10:40:48
 * @FilePath: \aster-flowable-vue\src\components\dict\dict-select.vue
 * @Description: 字典select
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :clearable="clearable"
    :disabled="disabled"
    @change="$emit('update:modelValue', $event)"
  >
    <el-option
      v-for="data in dataList"
      :key="data.dictValue"
      :label="data.dictLabel"
      :value="data.dictValue"
      >{{ data.dictLabel }}</el-option
    >
  </el-select>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { getDictDataList } from '@/utils';

  const appStore = useAppStore();

  const props = defineProps({
    modelValue: {
      type: [String, Array],
      required: true,
    },
    dictType: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    clearable: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    placeholder: {
      type: String,
      required: false,
      default: () => '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const dataList = getDictDataList(appStore.dictList, props.dictType);
</script>
