<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-26 11:38:49
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\input-text.vue
 * @Description: input输入框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item :label="formItem.title" :prop="formItem.id">
    <el-input
      v-if="mode === 'design'"
      :model-value="_value"
      :placeholder="formItem.props.placeholder"
      readonly
    />
    <el-input
      v-else-if="mode === 'form'"
      v-model="_value"
      clearable
      :placeholder="formItem.props.placeholder"
      :readonly="formItem.props.readonly"
    />
    <el-input
      v-else
      v-model="_value"
      size="small"
      clearable
      :placeholder="formItem.props.placeholder"
    />
  </el-form-item>
</template>
<script setup lang="ts">
  import { computed, PropType } from 'vue';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });
</script>
<style scoped lang="scss"></style>
