<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:44:54
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\associated-property-config.vue
 * @Description: 关联属性配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">关联属性</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
      <span class="text-xs font-normal label-tip">
        注：关联其他表单的某个字段，且会跟随关联表单对应的字段值实时变化
      </span>
    </el-form-item>
    <el-form-item label="关联表单字段">
      <el-select
        v-model="_formItem.props.associatedForm.fieldId"
        :clearable="true"
        @change="handleChange"
      >
        <el-option v-for="(item, i) in _formOptions" :key="i" :label="item.title" :value="item.id">
          {{ item.title }}
        </el-option>
      </el-select>
      <el-select v-model="associateFieldId" :clearable="true">
        <el-option v-for="(item, i) in fieldOptions" :key="i" :label="item.title" :value="item.id">
          {{ item.title }}
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isNotEmpty } from '@/utils';
  import { flatFormItems, flatFormItemsExclude } from '@/utils/workflow';
  import { ElMessage } from 'element-plus';
  import { computed, ref, watch } from 'vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 关联表单字段选项
  const fieldOptions = ref<WorkComponent.ComponentConfig[]>([]);
  // 关联表单字段id
  const associateFieldId = ref('');

  // 关联表单选项
  const _formOptions = computed(() => {
    const items = flatFormItems(workFlowStore.design.formItems);
    return isNotEmpty(items) ? items.filter((item) => item.name === 'AssociatedForm') : [];
  });

  /**
   * @description: 获取关联表单信息
   * @return {*}
   */
  const getAssociatedFormInfo = async (code: string) => {
    await formInfoByCodeApi(code).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        const items = res.data.formItems;
        // 排除无法显示的字段
        fieldOptions.value = flatFormItemsExclude(items);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 处理关联表单值变化
   * @param {string} val 选中的值
   * @return {*}
   */
  const handleChange = async (val: string) => {
    // 先置空字段选项
    fieldOptions.value = [];
    if (isNotEmpty(val)) {
      const item = _formOptions.value.find((item) => item.id === val);
      if (item && item.props.formCode.length === 2) {
        await getAssociatedFormInfo(item.props.formCode[1]);
      }
    }
  };

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  // 监听关联表单id变化
  watch(
    () => _formItem.value?.props.associatedForm.fieldId,
    (val: string) => {
      if (_formItem.value) {
        if (isNotEmpty(val)) {
          const item = _formOptions.value.find((item) => item.id === val);
          if (item && item.props.formCode.length === 2) {
            _formItem.value.props.associatedForm.formCode = item.props.formCode[1];
          } else {
            _formItem.value.props.associatedForm.formCode = '';
          }
        } else {
          _formItem.value.props.associatedForm.formCode = '';
        }
      }
    },
    { immediate: true, deep: true },
  );

  // 监听关联字段id变化
  watch(
    () => associateFieldId.value,
    (val: string) => {
      if (_formItem.value) {
        if (val && isNotEmpty(val)) {
          _formItem.value.props.associatedField = fieldOptions.value.find(
            (item) => item.id === val,
          );
          _formItem.value.props.associatedField.props.required = false;
          _formItem.value.props.associatedField.props.readonly = true;
        } else {
          _formItem.value.props.associatedField = {
            id: '',
            title: '',
            name: '',
            icon: '',
            value: '',
            valueType: '',
            props: {},
          };
        }
      }
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss">
  .label-tip {
    color: var(--el-text-color-placeholder);
  }
</style>
