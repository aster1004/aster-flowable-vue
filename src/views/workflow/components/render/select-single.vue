<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 14:18:45
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\select-single.vue
 * @Description: 单选框
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="!_hidden">
    <div class="el-form-item" v-if="mode != 'print'">
      <template v-if="mode === 'design'">
        <el-form-item
          :prop="formItemProp"
          :label-width="labelWidth"
          :show-message="showMessage"
          style="width: 100%"
        >
          <template #label>
            <span v-show="showLabel" style="line-height: normal">{{ _formItem.title }}</span>
          </template>
          <template v-if="_formItem.props.expand">
            <el-radio-group :model-value="_formItem.value" readonly>
              <el-radio v-for="(item, i) in options" :key="i" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else>
            <el-select
              :model-value="_formItem.value"
              :multiple="false"
              :clearable="true"
              :disabled="true"
            >
              <el-option
                v-for="(item, i) in options"
                :key="i"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </template>

      <template v-else-if="mode === 'form'">
        <el-form-item
          :prop="formItemProp"
          :label-width="labelWidth"
          :show-message="showMessage"
          style="width: 100%"
        >
          <template #label>
            <span v-show="showLabel">{{ formItem.title }}</span>
          </template>
          <template v-if="formItem.props.expand">
            <el-radio-group v-model="_value" :disabled="_readonly">
              <el-radio v-for="(item, i) in options" :key="i" :value="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else>
            <el-select
              v-model="_value"
              filterable
              :multiple="false"
              :clearable="true"
              :disabled="_readonly"
            >
              <el-option
                v-for="(item, i) in options"
                :key="i"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </template>
      <template v-else-if="mode === 'search'">
        <el-form-item
          :prop="formItemProp"
          :label-width="labelWidth"
          :show-message="showMessage"
          style="width: 100%"
        >
          <template #label>
            <span v-show="showLabel">{{ formItem.title }}</span>
          </template>
          <el-select v-model="_value" :multiple="false" :clearable="true">
            <el-option
              v-for="(item, i) in options"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        {{ _label }}
      </template>
    </div>
    <div v-else class="print-cell" ref="printRef">
      <div class="print-cell-label" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</p>
      </div>
      <div class="print-cell-value" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printValueRef">{{ _label }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useAppStore } from '@/stores/modules/app';
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { getDictDataList, isNotEmpty } from '@/utils';
  import { instanceListByCodeApi } from '@/api/workflow/process';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
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

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 字典
  const appStore = useAppStore();
  // 选项
  const options = ref<any[]>([]);

  // 打印 宽度
  const printRef = ref();
  const printLabelRef = ref();
  const printValueRef = ref();
  const printMaxHeight = ref(32);

  /**
   * @description: 更新高度
   */
  const updateHeight = () => {
    const parentHeight = printRef.value.parentNode?.offsetHeight;
    const labelHeight = printLabelRef.value?.offsetHeight;
    const valueHeight = printValueRef.value?.offsetHeight;
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
    if (!props.showLabel) {
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
   * @description: 获取动态选项
   * @return {*}
   */
  const getDynamicOptions = async () => {
    if (
      isNotEmpty(props.formItem.props.dynamic.value) &&
      props.formItem.props.dynamic.value.length == 3
    ) {
      await instanceListByCodeApi(props.formItem.props.dynamic.value[1], '9').then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          if (res.data && res.data.length > 0) {
            options.value = res.data.map((item: Process.InstanceInfo) => {
              const fieldId = props.formItem.props.dynamic.value[2];
              const label = item[fieldId];
              return {
                value: label,
                label: label,
              };
            });
          } else {
            options.value = [];
          }
        } else {
          options.value = [];
        }
      });
    } else {
      options.value = [];
    }
  };

  /**
   * @description: 根据选项类型获取选项值
   * @param {*} type 选项类型
   * @return {*}
   */
  const handleOptions = async (type: string) => {
    if (type === 'static') {
      options.value = props.formItem.props.options.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
    } else if (type === 'dict') {
      const dataList = getDictDataList(appStore.dictList, props.formItem.props.dictType);
      options.value = dataList.map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictLabel,
        };
      });
    } else if (type === 'dynamic') {
      await getDynamicOptions();
    } else {
      options.value = [];
    }
  };

  // 监听选项类型变化
  watch(
    () => props.formItem.props.type,
    async (type: string) => {
      // 根据选项类型获取选项值
      await handleOptions(type);
    },
    { immediate: true, deep: true },
  );

  // 设计阶段监听组件默认值的变化
  const _formItem = computed(() => {
    if (workFlowStore.selectFormItem && workFlowStore.selectFormItem.id === props.formItem.id) {
      // 默认值变化时，根据选项类型重新获取选项值
      handleOptions(workFlowStore.selectFormItem.props.type);
      return workFlowStore.selectFormItem;
    } else {
      return props.formItem;
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
   * @description: 标签
   */
  const _label = computed(() => {
    let label = '';
    if (isNotEmpty(_value.value)) {
      const node = options.value.find((o) => o.value === _value.value);
      if (node) {
        label = node.label;
      }
    }
    return label;
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
   * @description: 监听打印高度
   */
  watch(
    () => [props.mode, printRef.value],
    () => {
      if (printRef.value && props.mode === 'print') {
        updateHeight();
      }
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    const dataStr = JSON.stringify(props.formData);
    if (!props.formItem.id || dataStr.indexOf(props.formItem.id) == -1) {
      _value.value = props.formItem.value;
    }
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
</style>
