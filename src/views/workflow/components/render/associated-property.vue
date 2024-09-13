<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:45:24
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\associated-property.vue
 * @Description: 关联属性
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="!_hidden">
    <template v-if="mode === 'design'">
      <el-form-item
        :prop="formItemProp"
        :label-width="labelWidth"
        :show-message="showMessage"
        style="width: 100%"
      >
        <template #label>
          <span v-show="showLabel">{{ formItem.title }}</span>
        </template>
        <span class="label-tip"> 用于展示关联表单的属性, 且数据不会保存 </span>
      </el-form-item>
    </template>
    <template v-else-if="mode == 'form' || mode === 'search'">
      <el-form-item
        :prop="formItemProp"
        :label-width="labelWidth"
        :show-message="showMessage"
        style="width: 100%"
      >
        <template #label>
          <span v-show="showLabel">{{ formItem.title }}</span>
        </template>
        <form-design-render
          v-if="
            isNotEmpty(formItem.props.associatedForm.formCode) &&
            isNotEmpty(formItem.props.associatedField)
          "
          v-model:value="_value"
          :form-item="_associatedFormItem"
          :form-data="_associatedFormData"
          :mode="mode"
          :show-label="false"
        />
        <span v-else></span>
      </el-form-item>
    </template>
    <template v-else-if="mode == 'print'">
      <form-design-render
        v-if="
          isNotEmpty(formItem.props.associatedForm.formCode) &&
          isNotEmpty(formItem.props.associatedField)
        "
        v-model:value="_value"
        :form-item="_associatedFormItem"
        :form-data="_associatedFormData"
        :mode="mode"
      />
    </template>
    <template v-else>
      <form-design-render
        v-if="
          isNotEmpty(formItem.props.associatedForm.formCode) &&
          isNotEmpty(formItem.props.associatedField)
        "
        v-model:value="_value"
        :form-item="_associatedFormItem"
        :form-data="_associatedFormData"
        :mode="mode"
        :show-label="false"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula, flatFormItems } from '@/utils/workflow';
  import { computed, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty, isObject } from '@/utils';
  import FormDesignRender from '../../form/form-design-render.vue';
  import { instanceInfoByInstanceIdApi } from '@/api/workflow/task';
  import { ResultEnum } from '@/enums/httpEnum';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: String,
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

  // 值
  const _value = ref<any>();
  const _associatedFormData = ref({});
  const _associatedFormItem = ref<WorkComponent.ComponentConfig>();

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
   * @description: 监听表单数据变化
   */
  const _formData = computed(() => {
    return JSON.parse(JSON.stringify(props.formData));
  });

  // 监听关联表单数据变化
  watch(
    () => _formData.value[props.formItem.props.associatedForm.fieldId],
    async (val) => {
      if (
        val &&
        isNotEmpty(val) &&
        isNotEmpty(val.value) &&
        isNotEmpty(props.formItem.props.associatedField)
      ) {
        const code = props.formItem.props.associatedForm.formCode;
        let instance;
        if (isObject(val)) {
          instance = val;
        } else {
          instance = JSON.parse(val);
        }

        await instanceInfoByInstanceIdApi(code, instance.value).then((res) => {
          if (res.code === ResultEnum.SUCCESS) {
            _associatedFormData.value = res.data.instanceInfo;
            _value.value = _associatedFormData.value[props.formItem.props.associatedField];
            _associatedFormItem.value = flatFormItems(res.data.formInfo.formItems).find(
              (item) => item.id === props.formItem.props.associatedField,
            );
            if (_associatedFormItem.value) {
              _associatedFormItem.value.props.required = false;
              _associatedFormItem.value.props.readonly = true;
              _associatedFormItem.value.title = props.formItem.title;
            }
          } else {
            _associatedFormData.value = {};
            _value.value = undefined;
            _associatedFormItem.value = undefined;
          }
        });
      } else {
        _associatedFormData.value = {};
        _value.value = undefined;
        _associatedFormItem.value = undefined;
      }
    },
    { immediate: true, deep: true },
  );

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
  .label-tip {
    color: var(--el-text-color-placeholder);
  }

  ::v-deep(.el-form-item__content > .el-form-item--default) {
    width: 100%;
  }

  ::v-deep(.el-form-item__content > .el-form-item--default > .el-form-item__label) {
    width: 0px !important;
    padding: 0px !important;
    height: 0px !important;
    line-height: 0px !important;
  }

  ::v-deep(.el-form-item__content) {
    .el-form-item--default .el-form-item__label {
      width: 0px !important;
      padding: 0px !important;
      height: 0px !important;
      line-height: 0px !important;
    }
  }
</style>
