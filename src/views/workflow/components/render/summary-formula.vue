<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:46:47
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\summary-formula.vue
 * @Description: 汇总计算，用来计算明细表中的汇总数据，包括求和、求平均值等
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
        :readonly="_readonly"
        :controls="false"
        style="width: 100%"
      />
      <el-input-number
        v-else-if="mode === 'search'"
        v-model="_value"
        clearable
        :precision="formItem.props.precision"
        :placeholder="formItem.props.placeholder"
        :controls="false"
        style="width: 100%"
      />
      <span v-else>{{ _value }}</span>
    </el-form-item>

    <div v-else class="print-cell" ref="printRef">
      <div class="print-cell-label" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</p>
      </div>
      <div class="print-cell-value" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printValueRef">{{ _value }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, nextTick, onMounted, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { ElMessage } from 'element-plus';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';
  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Number,
      default: '',
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
   * 计算公式的值
   */
  const parseFormula = () => {
    if (props.formItem.props.formula) {
      let expression = props.formItem.props.formula;
      console.log('------当前公式：', expression);
      let regex = /\[\?\]/g; // 正则表达式，全局匹配 `[?]`
      if (regex.test(expression)) {
        // 通过正则获取函数名称和函数参数
        let regex = /([\w]+)\(([^)]+)\)/;
        let match = regex.exec(expression);
        if (match) {
          handleFunction(match);
        } else {
          // 说明没使用函数，并且计算公式在当前明细表中，所以让支持一般的表达式解析，
          if (isNotEmpty(props.tableId)) {
            expression = expression.replaceAll('?', props.tableIndex);
          }
          _value.value = evaluateFormula(expression, props.formData);
        }
      } else {
        //如果没有明细表变量，则走正常的表达式处理
        _value.value = evaluateFormula(expression, props.formData);
      }
    }
  };

  /**
   * 处理函数
   * @param match
   *        match[0]:"AVG(field6867564635973[?].field1124964639172 )"
   *        match[1]:"AVG"
   *        match[2]:"field6867564635973[?].field1124964639172 "
   */
  const handleFunction = (match: any[]) => {
    let functionName = match[1];
    let functionArgs = match[2];
    if (functionArgs.indexOf('[?]') > -1) {
      // 获取明细表中的数组名称，即fieldxxxx开头的数组
      let fields = functionArgs.split('[?].');
      let fieldArray = [];
      if (fields.length > 0) {
        let array = fields[0];
        fieldArray = props.formData?.[array] ? props.formData[array] : [];
      }

      switch (functionName.toUpperCase()) {
        case 'SUM':
          _value.value = sumFunction(fieldArray);
          break;
        case 'AVG':
          _value.value = sumFunction(fieldArray) / (fieldArray.length > 0 ? fieldArray.length : 1);
          break;
        case 'MAX':
          _value.value = maxFunction(fieldArray);
          break;
        case 'MIN':
          _value.value = minFunction(fieldArray);
          break;
        default:
          ElMessage.warning('明细表中暂不支持该函数：' + functionName);
          break;
      }
    }
  };

  /**
   * @description: 求和函数
   * @param fieldArray：明细表的字段数组
   */
  const sumFunction = (fieldArray: any[]) => {
    let sum = 0;
    let expression = props.formItem.props.formula;
    fieldArray.forEach((_item, index) => {
      // 通过循环依次替换表达式中的下标，然后计算表达式的值
      const subExp = expression.replace(/\[\?\]/g, () => '[' + index + ']');
      sum += evaluateFormula(subExp, props.formData);
    });
    return sum;
  };

  /**
   * @description: 最大值函数
   * @param fieldArray
   */
  function maxFunction(fieldArray: any[]) {
    let expression = props.formItem.props.formula;
    let max = 0;
    fieldArray.forEach((_item, index) => {
      // 通过循环依次替换表达式中的下标，然后计算表达式的值
      const subExp = expression.replace(/\[\?\]/g, () => '[' + index + ']');
      const currentMax = evaluateFormula(subExp, props.formData);
      if (index === 0) {
        max = currentMax;
      }
      if (currentMax > max) {
        max = currentMax;
      }
    });
    return max;
  }
  /**
   * @description: 最小值函数
   * @param fieldArray
   */
  function minFunction(fieldArray: any[]) {
    let expression = props.formItem.props.formula;
    let min = 0;
    fieldArray.forEach((_item, index) => {
      // 通过循环依次替换表达式中的下标，然后计算表达式的值
      const subExp = expression.replace(/\[\?\]/g, () => '[' + index + ']');
      const currentMax = evaluateFormula(subExp, props.formData);
      if (index === 0) {
        min = currentMax;
      }
      if (currentMax < min) {
        min = currentMax;
      }
    });
    return min;
  }

  watch(
    () => props.formData,
    () => {
      parseFormula();
    },
    { immediate: true, deep: true },
  );

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
  ::v-deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
</style>
