<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 18:34:33
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\date-time.vue
 * @Description: 日期
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
    <el-date-picker
      v-if="mode === 'design'"
      v-model="_value"
      :type="dateType"
      :format="formItem.props.format"
      :value-format="formItem.props.format"
      readonly
    />
    <el-date-picker
      v-else-if="mode === 'form'"
      v-model="_value"
      :type="dateType"
      :format="formItem.props.format"
      :value-format="formItem.props.format"
      :readonly="formItem.props.readonly"
      clearable
    />
    <el-date-picker
      v-else-if="mode === 'search'"
      v-model="_value"
      :type="dateType"
      :format="formItem.props.format"
      :value-format="formItem.props.format"
      clearable
    />
    <span v-else>{{ _value }}</span>
  </el-form-item>
</template>
<script setup lang="ts">
  import { evaluateFormula, getDateTypeByFormat } from '@/utils/workflow';
  import { computed, PropType } from 'vue';
  import mittBus from '@/utils/mittBus';

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
   * @description: 日期类型
   */
  const dateType = computed(() => {
    return getDateTypeByFormat(props.formItem.props.format);
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
