<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 11:20:49
 * @FilePath: \aster-flowable-vue\src\components\dict\dict-radio.vue
 * @Description: 字典radio
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-radio-group :model-value="modelValue + ''" @change="$emit('update:modelValue', $event)">
    <el-radio v-for="data in dataList" :key="data.dictValue" :label="data.dictValue">{{
      data.dictLabel
    }}</el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { getDictDataList } from '@/utils';

  const appStore = useAppStore();

  const props = defineProps({
    modelValue: {
      type: [Number, String],
      required: true,
    },
    dictType: {
      type: String,
      required: true,
    },
  });

  const dataList = getDictDataList(appStore.dictList, props.dictType);
</script>
