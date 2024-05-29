<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 18:15:03
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\dept-picker.vue
 * @Description: 部门
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="mode === 'design'">
    <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
      <div class="add-dept-wrapper">
        <el-select v-model="selectedDepts" placeholder="请选择" disabled />
      </div>
    </el-form-item>
  </div>
  <div v-else-if="mode == 'form'">
    <el-form-item :label="formItem.title" :prop="formItem.id" v-if="!_hidden">
      <div class="add-dept-wrapper">
        <el-select
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
      </div>
    </el-form-item>
    <user-org-picker
      ref="userDeptPickerRef"
      type="dept"
      title="选择部门"
      :form-item="formItem"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref, watchEffect } from 'vue';
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
      type: String as PropType<'design' | 'form' | 'search'>,
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
    selectedDepts.value = [];
    if (isNotEmpty(ids)) {
      await selectDeptsByIdsApi(ids).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          const data = res.data;
          data.forEach((item: Dept.DeptInfo) => {
            selectedDepts.value.push(item);
          });
        }
      });
    }
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
   * @description: 监听_value值变化
   */
  watchEffect(() => {
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
<style scoped lang="scss">
  .add-dept-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
  }
</style>
