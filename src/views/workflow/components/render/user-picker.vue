<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:13:48
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\user-picker.vue
 * @Description: 人员
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

      <el-select v-if="mode === 'design'" v-model="selectedUsers" placeholder="请选择" disabled />
      <el-select
        v-else-if="mode == 'form'"
        v-model="_value"
        multiple
        placeholder="请选择"
        :disabled="_readonly"
        @click="handleAdd"
      >
        <el-option
          v-for="(item, index) in selectedUsers"
          :key="index"
          :label="isNotEmpty(item.realName) ? item.realName : item.nickName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-else-if="mode == 'search'"
        v-model="_value"
        multiple
        placeholder="请选择"
        @click="handleAdd"
      >
        <el-option
          v-for="(item, index) in selectedUsers"
          :key="index"
          :label="isNotEmpty(item.realName) ? item.realName : item.nickName"
          :value="item.id"
        />
      </el-select>
      <span v-else>
        {{ _names }}
      </span>
      <user-org-picker
        ref="userDeptPickerRef"
        type="user"
        title="选择人员"
        :form-item="formItem"
        mode="form"
        @success="handleSuccess"
      />
    </el-form-item>
    <div v-else class="print-cell" ref="printRef">
      <div class="print-cell-label" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</p>
      </div>
      <div class="print-cell-value" :style="{ height: printMaxHeight + 'px' }">
        <p ref="printValueRef">{{ _names }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType, ref, watch, watchEffect } from 'vue';
  import mittBus from '@/utils/mittBus';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { selectUsersByIdsApi } from '@/api/sys/user';
  import { instanceInfoByCustomParamsApi } from '@/api/workflow/process';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isArray, isNotEmpty } from '@/utils';
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

  // 选人选部门组件
  const userDeptPickerRef = ref();
  // 已选择的人员
  const selectedUsers = ref<User.UserInfo[]>([]);

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

  /**
   * @description: 选人选部门组件初始化
   * @return {*}
   */
  const handleAdd = () => {
    if (props.mode === 'form' && _readonly.value) {
      return;
    }
    userDeptPickerRef.value.init(selectedUsers.value);
  };

  /**
   * @description: 选人选部门组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleSuccess = (val: User.UserInfo[]) => {
    selectedUsers.value = [];
    const userIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: User.UserInfo) => {
        selectedUsers.value.push(item);
        item.id && userIds.value.push(item.id);
      });
    }
    _value.value = userIds.value;
  };

  /**
   * @description: 批量获取用户信息
   * @param {*} ids
   * @return {*}
   */
  const selectUsersByIds = async (ids: string[]) => {
    if (isNotEmpty(ids)) {
      await selectUsersByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          selectedUsers.value = [];
          const data = res.data;
          data.forEach((item: User.UserInfo) => {
            selectedUsers.value.push(item);
          });
        }
      });
    } else {
      selectedUsers.value = [];
    }
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
      if (props.value && isArray(props.value)) {
        return props.value;
      }
      return [];
    },
    set(val) {
      emit('update:value', val);
    },
  });

  // 用于深度监听值的变化
  const __value = computed(() => {
    return JSON.stringify(_value.value);
  });

  /**
   *  @description: 确保selectedUsers 和_value.value 的值保持同步
   */
  watchEffect(() => {
    if (isNotEmpty(__value.value)) {
      selectUsersByIds(JSON.parse(__value.value));
    }
  });

  /**
   * @description: 已选中用户的名称
   */
  const _names = computed(() => {
    if (isNotEmpty(selectedUsers.value)) {
      return selectedUsers.value
        .map((item: User.UserInfo) => {
          return isNotEmpty(item.realName) ? item.realName : item.nickName;
        })
        .join(',');
    }
    return '';
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
    // 判断流程节点下该控件是否隐藏
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.HIDDEN;
    }
    // 如果是必填则动态添加rule
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
        // 默认值-数据联动
        const defaultConfig = props.formItem.props.default;
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
                    if (res.data.hasOwnProperty(dataFill) && isNotEmpty(res.data[dataFill])) {
                      const associatedValue = res.data[dataFill];
                      if (isArray(associatedValue)) {
                        _value.value = associatedValue;
                      } else {
                        _value.value =
                          associatedValue.indexOf('[') != -1 ? JSON.parse(associatedValue) : [];
                      }
                    } else {
                      _value.value = props.formItem.value;
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

  onMounted(async () => {
    await selectUsersByIds(_value.value);
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
</style>
