<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 10:36:14
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\input-number.vue
 * @Description: 数字输入框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
    <el-input-number
      v-if="mode === 'design'"
      :model-value="_value"
      :precision="formItem.props.precision"
      :placeholder="formItem.props.placeholder"
      :controls="false"
      readonly
      style="width: 100%"
    />
    <el-input-number
      v-else-if="mode === 'form'"
      v-model="_value"
      clearable
      :precision="formItem.props.precision"
      :placeholder="formItem.props.placeholder"
      :readonly="formItem.props.readonly"
      :controls="false"
      style="width: 100%"
    />
    <el-input-number
      v-else-if="mode === 'search'"
      v-model="_value"
      size="small"
      clearable
      :precision="formItem.props.precision"
      :placeholder="formItem.props.placeholder"
      :controls="false"
      style="width: 100%"
    />
    <span v-else>{{ _value }}</span>
  </el-form-item>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType } from 'vue';
  import mittBus from '@/utils/mittBus';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Number,
      default: '',
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
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

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      r = evaluateFormula(props.formItem.props.hidden, props.formData);
    }
    if (props.formItem.props.required) {
      // 调用form-render的方法
      mittBus.emit('changeFormRules', {
        hidden: r,
        fieldId: props.formItem.id,
        fieldName: props.formItem.title,
        trigger: 'blur',
      });
    }
    return r;
  });
</script>
<style scoped lang="scss"></style>
