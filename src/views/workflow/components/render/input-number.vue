<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 10:36:14
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\input-number.vue
 * @Description: 数字输入框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item
    v-if="!_hidden"
    :prop="formItemProp"
    :label-width="labelWidth"
    :show-message="showMessage"
  >
    <template #label>
      <span v-show="showLabel">{{ formItem.title }}</span>
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
      :readonly="formItem.props.readonly"
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
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty, isNumber } from '@/utils';
  import { instanceInfoByCustomParamsApi } from '@/api/workflow/instance';
  import { ResultEnum } from '@/enums/httpEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Number,
      default: '',
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table'>,
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
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (isNotEmpty(props.tableId)) {
        expression = expression.replaceAll('?', props.tableIndex);
      }
      r = evaluateFormula(expression, props.formData);
    }
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
   * @description: 监听表单数据变化
   */
  const _formData = computed(() => {
    return JSON.parse(JSON.stringify(props.formData));
  });

  /**
   * @description: 监听表单数据变化
   */
  watch(
    () => _formData.value,
    async (nval, oval) => {
      if (nval && props.mode === 'form' && props.formItem && props.formItem.props.default) {
        // 默认值-计算公式
        const defaultConfig = props.formItem.props.default;
        if (defaultConfig.type === 'formula' && isNotEmpty(defaultConfig.value)) {
          Object.keys(nval).forEach((key) => {
            if (
              defaultConfig.value.indexOf(key) != -1 &&
              oval != undefined &&
              nval[key] != oval[key]
            ) {
              const r: any = evaluateFormula(defaultConfig.value, nval) + '';
              if (isNumber(r)) {
                _value.value = r;
              } else {
                _value.value = props.formItem.value;
              }
            }
          });
        }
        // 默认值-数据联动
        if (
          defaultConfig.type === 'linkage' &&
          isNotEmpty(defaultConfig.linkage.formCode) &&
          isNotEmpty(defaultConfig.linkage.conditions) &&
          isNotEmpty(defaultConfig.linkage.dataFill)
        ) {
          const conditionStr = JSON.stringify(defaultConfig.linkage.conditions);
          Object.keys(nval).forEach(async (key) => {
            // 判断联动条件中的当前表单的字段的值是否有变动，如有则重新赋值
            if (conditionStr.indexOf(key) != -1 && oval != undefined && nval[key] != oval[key]) {
              const targetCode = defaultConfig.linkage.formCode[1];
              let targetParams = {};
              defaultConfig.linkage.conditions.forEach((item) => {
                if (isNotEmpty(item.currentFieldId) && isNotEmpty(item.associatedFieldId)) {
                  targetParams[item.associatedFieldId] = nval[item.currentFieldId];
                }
              });
              // 根据条件查询目标表单的流程实例
              await instanceInfoByCustomParamsApi(targetCode, targetParams).then((res) => {
                if (res.code == ResultEnum.SUCCESS) {
                  if (res.data) {
                    const dataFill = defaultConfig.linkage.dataFill;
                    // 如果目标表单中存在该填充字段，则赋值
                    if (res.data.hasOwnProperty(dataFill)) {
                      if (isNumber(res.data[dataFill])) {
                        _value.value = res.data[dataFill];
                      } else {
                        _value.value = props.formItem.value;
                      }
                    }
                  } else {
                    // 流程实例不存在则重置为空
                    _value.value = props.formItem.value;
                  }
                }
              });
            }
          });
        }
      }
    },
    { immediate: true, deep: true },
  );

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  ::v-deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
</style>
