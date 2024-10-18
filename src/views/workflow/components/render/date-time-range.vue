<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 18:34:42
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\date-time-range.vue
 * @Description: 日期范围
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="!_hidden">
    <el-form-item
      v-if="mode != 'print'"
      :prop="formItemProp"
      :label-width="labelWidth"
      :show-message="showMessage"
    >
      <template #label>
        <span v-show="showLabel" style="line-height: normal">{{ formItem.title }}</span>
      </template>
      <el-input v-if="mode === 'design'" :model-value="formItem.value" readonly />
      <div v-else-if="mode === 'form'" class="w-full">
        <el-date-picker
          v-model="_value"
          :type="dateType"
          :format="formItem.props.format"
          :value-format="formItem.props.format"
          :readonly="_readonly"
          clearable
          style="width: 100%"
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
        style="width: 100%"
      />
      <span v-else>{{ _value }}</span>
    </el-form-item>
    <div v-else class="print-cell" ref="printRef">
      <div class="print-cell-label" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</p>
      </div>
      <div class="print-cell-value" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printValueRef">{{ _value ? _value.join('至') : '' }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula, getDateLength, getDateTypeByFormat } from '@/utils/workflow';
  import { computed, nextTick, onMounted, PropType, ref } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
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
    tableId: {
      type: String,
      default: '',
    },
    tableIndex: {
      type: Number,
      default: 0,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
  });

  // 打印 宽度
  const printRef = ref();
  const printLabelRef = ref();
  const printValueRef = ref();
  const printMaxHeight = ref(32);

  /**
   * @description: 更新高度
   */
  const updateHeight = () => {
    const parentHeight = printRef.value.parentNode.offsetHeight;
    const labelHeight = printLabelRef.value.offsetHeight;
    const valueHeight = printValueRef.value.offsetHeight;
    printMaxHeight.value = Math.max(parentHeight, labelHeight, valueHeight);
  };

  // 键
  const formItemProp = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return props.tableId + '.' + props.tableIndex + '.' + props.formItem.id;
    } else {
      return props.formItem.id;
    }
  });

  // 标签长度
  const labelWidth = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return '12px';
    } else {
      return '';
    }
  });

  // 是否显示校验信息
  const showMessage = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return false;
    } else {
      return true;
    }
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
    // 解析隐藏条件公式
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (isNotEmpty(props.tableId)) {
        expression = expression.replaceAll('?', props.tableIndex);
      }
      r = evaluateFormula(expression, props.formData);
    }
    // 判断流程节点下该控件是否隐藏
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.HIDDEN;
    }
    // 如果是必填则动态添加rule
    if (props.formItem.props.required) {
      // 调用form-render的方法
      mittBus.emit('changeFormRules', {
        hidden: r,
        fieldId: isNotEmpty(props.tableId)
          ? props.tableId + '.' + props.tableIndex + '.' + props.formItem.id
          : props.formItem.id,
        fieldName: props.formItem.title,
        trigger: 'blur',
      });
    }
    return r;
  });

  /**
   * @description: 是否只读, true-只读
   */
  const _readonly = computed(() => {
    let r = props.formItem.props.readonly;
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.READONLY;
    }
    return r;
  });

  /**
   * @description: 获取日期长度
   */
  const dateLength = computed(() => {
    return getDateLength(_value.value, props.formItem.props.format);
  });

  onMounted(() => {
    if (props.mode === 'print') {
      nextTick(() => {
        updateHeight();
      });
    }
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
  .date-length {
    color: #afadad;
    font-size: smaller;
    text-align: right;
  }
</style>
