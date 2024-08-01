<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 10:09:22
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\input-number-config.vue
 * @Description: 数字输入框配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">数字</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>数值精度</span>
        <el-tooltip content="小数点后位数" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input-number v-model="_formItem.props.precision" :min="0" :max="10" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-select v-model="valueType">
        <el-option label="计算公式" value="formula" />
        <el-option label="数据联动" value="linkage" />
      </el-select>
      <el-input @click="showDefaultValue">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="提示语">
      <el-input v-model="_formItem.props.placeholder" placeholder="请设置提示语" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>

    <default-value-formula ref="defaultValueRef" v-model:formula="_formItem.props.default.value" />
    <data-linkage ref="dataLinkageRef" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import DefaultValueFormula from '../common/default-value-formula.vue';
  import DataLinkage from '../common/data-linkage.vue';
  import { ElMessage } from 'element-plus';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const defaultValueRef = ref();
  const dataLinkageRef = ref();
  // 默认值类型
  const valueType = ref<string>('formula');

  /**
   * @description: 显示默认值
   */
  const showDefaultValue = () => {
    if (!_formItem.value || !_formItem.value.props.hasOwnProperty('default')) {
      ElMessage.warning('该控件的配置信息已更改，如要设置默认值需删除后重新拖入表单');
      return;
    }
    if (valueType.value === 'formula') {
      defaultValueRef.value.init();
    }
    if (valueType.value === 'linkage') {
      dataLinkageRef.value.init();
    }
    if (_formItem.value && _formItem.value.props.hasOwnProperty('default')) {
      _formItem.value.props.default.type = valueType.value;
    }
  };

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss">
  .tooltip {
    font-weight: 100;
    padding-left: 5px;
  }
</style>
