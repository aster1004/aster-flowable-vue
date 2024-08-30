<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:15:03
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\dept-picker.vue
 * @Description: 部门
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

      <el-select v-if="mode === 'design'" v-model="selectedDepts" placeholder="请选择" disabled />
      <el-select
        v-else-if="mode == 'form'"
        v-model="_value"
        multiple
        placeholder="请选择"
        :disabled="formItem.props.readonly"
        @click="handleAdd"
      >
        <el-option
          v-for="(item, index) in selectedDepts"
          :key="index"
          :label="item.orgName"
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
          v-for="(item, index) in selectedDepts"
          :key="index"
          :label="item.orgName"
          :value="item.id"
        />
      </el-select>
      <span v-else>
        {{ _names }}
      </span>
      <user-org-picker
        ref="userDeptPickerRef"
        type="dept"
        title="选择部门"
        mode="form"
        :form-item="formItem"
        @success="handleSuccess"
      />
    </el-form-item>
    <div v-else class="print-cell">
      <div class="print-cell-label">
        <span v-show="showLabel">{{ formItem.title }}</span>
      </div>
      <div class="print-cell-value">
        <span>{{ _names }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType, ref, watch, watchEffect } from 'vue';
  import mittBus from '@/utils/mittBus';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isArray, isNotEmpty } from '@/utils';
  import { selectDeptsByIdsApi } from '@/api/sys/dept';
  import { instanceInfoByCustomParamsApi } from '@/api/workflow/process';

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
  // 已选择的部门
  const selectedDepts = ref<Dept.DeptInfo[]>([]);

  /**
   * @description: 选人选部门组件初始化
   * @return {*}
   */
  const handleAdd = () => {
    userDeptPickerRef.value.init(selectedDepts.value);
  };

  /**
   * @description: 添加部门
   * @return {*}
   */
  const handleSuccess = (val: Dept.DeptInfo[]) => {
    selectedDepts.value = [];
    const deptIds = ref<string[]>([]);
    if (val.length > 0) {
      val.forEach((item: Dept.DeptInfo) => {
        selectedDepts.value.push(item);
        item.id && deptIds.value.push(item.id);
      });
    }
    _value.value = deptIds.value;
  };

  /**
   * @description: 根据id查询部门信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const selectDeptsByIds = async (ids: string[]) => {
    if (isNotEmpty(ids)) {
      await selectDeptsByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          selectedDepts.value = [];
          const data = res.data;
          data.forEach((item: Dept.DeptInfo) => {
            selectedDepts.value.push(item);
          });
        }
      });
    } else {
      selectedDepts.value = [];
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
      return props.value;
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
   *  @description: 确保 selectedDepts 的值和_value.value 的值保持同步
   */
  watchEffect(() => {
    if (isNotEmpty(__value.value)) {
      selectDeptsByIds(JSON.parse(__value.value));
    }
  });

  /**
   * @description: 已选中部门的名称
   */
  const _names = computed(() => {
    if (isNotEmpty(selectedDepts.value)) {
      return selectedDepts.value
        .map((item: Dept.DeptInfo) => {
          return item.orgName;
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
      r = evaluateFormula(props.formItem.props.hidden, props.formData);
    }
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
   * @description: 监听_value值变化,获取对象全量信息，用于表单回显
   */
  onMounted(() => {
    selectDeptsByIds(_value.value);
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
</style>
