<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-11 11:28:24
 * @FilePath: \aster-flowable-vue\src\components\dict\dict-checkbox.vue
 * @Description: 字典多选框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-checkbox-group
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
    :disabled="disabled"
  >
    <el-checkbox
      v-for="data in dataList"
      :key="data.dictValue"
      :label="data.dictLabel"
      :value="data.dictValue"
    />
  </el-checkbox-group>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { getDictDataList } from '@/utils';

  const appStore = useAppStore();

  const props = defineProps({
    modelValue: {
      type: Array,
      required: true,
    },
    dictType: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const dataList = getDictDataList(appStore.dictList, props.dictType);
</script>
