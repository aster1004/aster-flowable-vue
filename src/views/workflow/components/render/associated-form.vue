<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:39:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\associated-form.vue
 * @Description: 关联表单
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
        <span v-show="showLabel">{{ formItem.title }}</span>
      </template>
      <template v-if="mode === 'design'">
        <el-input placeholder="请选择" readonly />
      </template>
      <template v-else-if="mode === 'form'">
        <el-popover :visible="popoverVisible" placement="bottom" :width="minWidth" trigger="click">
          <template #reference>
            <el-input
              ref="popoverInputRef"
              :model-value="_value?.label"
              clearable
              @click="popoverClick"
              @clear="clearPopover"
            />
          </template>
          <div
            ref="selectRef"
            class="el-select-dropdown"
            v-click-outside:="hidePopover"
            @mouseleave="hidePopover"
          >
            <div class="el-scrollbar">
              <div
                class="el-select-dropdown__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default"
              >
              </div>
            </div>
            <ul class="el-scrollbar__view el-select-dropdown__list">
              <li
                v-for="(item, index) in associatedOptions"
                :key="index"
                :class="['el-select-dropdown__item', isActive(item.value) ? 'is-hovering' : '']"
                @mouseenter="hoverItem(item.value, true)"
                @mouseleave="hoverItem(item.value, false)"
                @click.stop="selectOptionClick(item)"
              >
                <span>{{ item.label }}</span>
              </li>
            </ul>
          </div>
        </el-popover>
      </template>
      <template v-else-if="mode === 'search'">
        <el-select
          v-model="_value"
          :multiple="false"
          :clearable="true"
          :disabled="formItem.props.readonly"
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
      <template v-else>
        <el-button class="flex" type="primary" link @click="handleAssociatedForm(_value.value)">
          {{ _value ? _value.label : '' }}
        </el-button>
      </template>
      <form-detail ref="associatedFormDetailRef" />
    </el-form-item>
    <div v-else class="print-cell">
      <div class="print-cell-label">
        <span v-show="showLabel">{{ formItem.title }}</span>
      </div>
      <div class="print-cell-value">
        <span>{{ _value ? _value.label : '' }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref, watch } from 'vue';
  import FormDetail from '../../form/form-detail.vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { instanceListByCodeApi } from '@/api/workflow/process';
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

  // 注册组件
  const associatedFormDetailRef = ref();
  // 显示弹窗
  const popoverVisible = ref(false);
  // 关联表单的流程实例
  const associatedList = ref<Process.InstanceInfo[]>([]);
  // 关联表单的流程实例选项
  const associatedOptions = ref<any[]>([]);
  // 活动选项
  const activeItem = ref('');
  // 最小宽度
  const minWidth = ref(200);
  const popoverInputRef = ref();

  /**
   * @description: 隐藏弹窗
   * @return {*}
   */
  const hidePopover = () => {
    popoverVisible.value = false;
  };

  /**
   * @description: 点击选项
   * @return {*}
   */
  const selectOptionClick = (item: WorkComponent.TreeNode) => {
    _value.value = item;
    handleChange(item);
    popoverVisible.value = false;
  };

  /**
   * @description: 鼠标移入移出
   * @return {*}
   */
  const hoverItem = (val: string, active: boolean) => {
    if (active) {
      activeItem.value = val;
    } else {
      activeItem.value = '';
    }
  };

  /**
   * @description: 是否是活动选项
   * @return {*}
   */
  const isActive = (val: string) => {
    return activeItem.value === val;
  };

  /**
   * @description: 点击输入框
   * @return {*}
   */
  const popoverClick = () => {
    popoverVisible.value = !popoverVisible.value;
    popoverWidth();
  };

  /**
   * @description: 弹窗宽度
   * @return {*}
   */
  const popoverWidth = () => {
    minWidth.value = popoverInputRef.value.$el.offsetWidth;
  };

  const clearPopover = () => {
    _value.value = { label: '', value: '' };
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
   * @description: 打开关联表单
   * @param {*} instanceId 流程实例id
   * @return {*}
   */
  const handleAssociatedForm = (instanceId: string) => {
    const code = props.formItem.props.formCode[1];
    associatedFormDetailRef.value.getInstanceInfoByInstanceId(code, instanceId);
  };

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
   * @description: 监听表单数据变化
   */
  watch(
    () => _formData.value,
    async (nval, oval) => {
      if (
        nval &&
        props.mode === 'form' &&
        props.formItem &&
        props.formItem.props.dataScope &&
        isNotEmpty(props.formItem.props.dataScope.value)
      ) {
        // 数据范围限定公式
        const dataScopeFormula = props.formItem.props.dataScope.value;
        Object.keys(nval).forEach((key) => {
          if (dataScopeFormula.indexOf(key) != -1 && oval != undefined && nval[key] != oval[key]) {
            associatedOptions.value = associatedList.value
              .filter((item: Process.InstanceInfo) => {
                return evaluateFormula(dataScopeFormula, { ...item, ...nval });
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
          }
        });
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
</style>
