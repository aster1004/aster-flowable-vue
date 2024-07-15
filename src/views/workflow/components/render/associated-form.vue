<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:39:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\associated-form.vue
 * @Description: 关联表单
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
    <template v-if="mode === 'design'">
      <el-input placeholder="请选择" readonly />
    </template>
    <template v-else-if="mode === 'form'">
      <el-select
        v-model="_value"
        :multiple="false"
        :clearable="true"
        :disabled="formItem.props.readonly"
        @change="handleChange"
      >
        <el-option
          v-for="(item, i) in associatedOptions"
          :key="i"
          :label="item.label"
          :value="item"
        >
          {{ item.label }}
        </el-option>
      </el-select>
    </template>
  </el-form-item>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { instanceListByCodeApi } from '@/api/workflow/instance';
  import { ResultEnum } from '@/enums/httpEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Object as PropType<WorkComponent.TreeNode>,
      default: () => {
        return { label: '', value: '' };
      },
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

  // 关联表单的流程实例
  const associatedList = ref<Process.InstanceInfo[]>([]);
  // 关联表单的流程实例选项
  const associatedOptions = ref<any[]>([]);

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
   * @description: 处理关联表单变化
   * @param {*} val 选中的值
   * @return {*}
   */
  const handleChange = (val: WorkComponent.TreeNode) => {
    const associatedFormData = associatedList.value.find(
      (item) => val && item.procInstId === val.value,
    );
    if (
      associatedFormData &&
      props.formItem.props.dataFill &&
      props.formItem.props.dataFill.length > 0
    ) {
      // 先处理没有明细表的规则
      const rules = props.formItem.props.dataFill.filter((item: WorkComponent.DataFillModel) => {
        return item.currentFieldId.indexOf('.') == -1;
      });
      if (isNotEmpty(rules)) {
        rules.forEach((rule: WorkComponent.DataFillModel) => {
          const fieldValue = associatedFormData[rule.associatedFieldId];
          props.formData[rule.currentFieldId] = fieldValue;
        });
      }
      // 再处理有明细表的规则
      const tableRules = props.formItem.props.dataFill.filter(
        (item: WorkComponent.DataFillModel) => {
          return item.currentFieldId.indexOf('.') != -1;
        },
      );
      if (isNotEmpty(tableRules)) {
        tableRules.forEach((rule: WorkComponent.DataFillModel) => {
          const arr = rule.currentFieldId.split('.');
          const tableId = arr[0];
          const tableFieldId = arr[1];

          let obj = {};
          obj[tableFieldId] = associatedFormData[rule.associatedFieldId];
          props.formData[tableId] = [obj];
        });
      }
    }
  };

  /**
   * @description: 监听关联表单的变化
   */
  watch(
    () => props.formItem.props.formCode,
    async (val: string[]) => {
      if (isNotEmpty(val)) {
        await instanceListByCodeApi(val[1], '9').then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            if (res.data && res.data.length > 0) {
              associatedList.value = res.data;

              associatedOptions.value = res.data
                .filter((item: Process.InstanceInfo) => {
                  if (isNotEmpty(props.formItem.props.dataScope.value)) {
                    return evaluateFormula(props.formItem.props.dataScope.value, item);
                  } else {
                    return true;
                  }
                })
                .map((item: Process.InstanceInfo) => {
                  const labels = props.formItem.props.displayField.map((fieldId: string) => {
                    return item[fieldId];
                  });
                  return {
                    value: item.procInstId,
                    label: labels.join('-'),
                  };
                });
            } else {
              associatedOptions.value = [];
            }
          }
        });
      }
    },
    { immediate: true, deep: true },
  );

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

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss"></style>
