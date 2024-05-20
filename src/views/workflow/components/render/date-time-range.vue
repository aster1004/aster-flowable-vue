<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 18:34:42
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\date-time-range.vue
 * @Description: 日期范围
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item :prop="formItem.id" v-if="!_hidden">
    <template #label>
      <span v-show="!isChildTable">{{ formItem.title }}</span>
    </template>
    <div v-if="mode === 'design'">
      <el-date-picker
        v-model="_value"
        :type="dateType"
        :format="formItem.props.format"
        :value-format="formItem.props.format"
        readonly
      />
      <div class="date-length" v-if="formItem.props.showLength">
        {{ dateLength }}
      </div>
    </div>
    <div v-else-if="mode === 'form'">
      <el-date-picker
        v-model="_value"
        :type="dateType"
        :format="formItem.props.format"
        :value-format="formItem.props.format"
        :readonly="formItem.props.readonly"
        clearable
      />
      <div class="date-length" v-if="formItem.props.showLength">
        {{ dateLength }}
      </div>
    </div>
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
  import { evaluateFormula, getDateLength, getDateTypeByFormat } from '@/utils/workflow';
  import { computed, PropType } from 'vue';
  import mittBus from '@/utils/mittBus';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
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
  });

  /**
   * @description: 日期类型
   */
  const dateType = computed(() => {
    return getDateTypeByFormat(props.formItem.props.format, true);
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

  /**
   * @description: 获取日期长度
   */
  const dateLength = computed(() => {
    return getDateLength(_value.value, props.formItem.props.format);
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  .date-length {
    color: #afadad;
    font-size: smaller;
    text-align: right;
  }
</style>
