<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:15:03
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\dept-picker.vue
 * @Description: 部门
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
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, onMounted, PropType, ref } from 'vue';
  import mittBus from '@/utils/mittBus';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import { selectDeptsByIdsApi } from '@/api/sys/dept';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
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
   * @description: 监听_value值变化
   */
  onMounted(() => {
    selectDeptsByIds(_value.value);
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

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss"></style>
