<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 10:36:25
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\input-amount.vue
 * @Description: 金额输入框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item :prop="formItem.id" v-if="!_hidden">
    <template #label>
      <span v-show="showLabel">{{ formItem.title }}</span>
    </template>
    <div v-if="mode === 'design'" style="width: 100%">
      <el-input-number
        :model-value="_value"
        :precision="formItem.props.precision"
        :placeholder="formItem.props.placeholder"
        :controls="false"
        style="width: 100%"
        readonly
      />
      <div class="amount" v-if="formItem.props.showChinese">
        {{ chineseAmount }}
      </div>
    </div>
    <div v-else-if="mode === 'form'" style="width: 100%">
      <el-input-number
        v-model="_value"
        clearable
        :precision="formItem.props.precision"
        :placeholder="formItem.props.placeholder"
        :readonly="formItem.props.readonly"
        :controls="false"
        style="width: 100%"
      />
      <div class="amount" v-if="formItem.props.showChinese">
        {{ chineseAmount }}
      </div>
    </div>
    <el-input-number
      v-else-if="mode === 'search'"
      v-model="_value"
      size="small"
      clearable
      :precision="formItem.props.precision"
      :placeholder="formItem.props.placeholder"
      style="width: 100%"
    />
    <span v-else>{{ _value }}</span>
  </el-form-item>
</template>
<script setup lang="ts">
  import { convertToChineseAmount, evaluateFormula } from '@/utils/workflow';
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
    isChildTable: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    showLabel: {
      type: Boolean,
      default: true,
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
   * @description: 大写金额
   */
  const chineseAmount = computed(() => {
    return convertToChineseAmount(_value.value);
  });

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (props.isChildTable) {
        expression = expression.replaceAll('?', props.index);
      }
      r = evaluateFormula(expression, props.formData);
    }
    if (props.formItem.props.required && !props.isChildTable) {
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

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  .amount {
    color: #afadad;
    font-size: smaller;
    text-align: right;
  }
</style>
