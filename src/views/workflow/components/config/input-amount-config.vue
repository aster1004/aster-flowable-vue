<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 10:09:36
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\input-amount-config.vue
 * @Description: 金额输入框配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">金额</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>数值精度</span>
        <el-tooltip content="保留小数点后多少位" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input-number v-model="_formItem.props.precision" :min="0" :max="10" />
    </el-form-item>
    <el-form-item label="展示大写">
      <el-switch v-model="_formItem.props.showChinese" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-select v-model="valueType">
        <el-option label="计算公式" value="formula" />
        <el-option label="数据联动" value="data" />
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
    <el-form-item label="必填项">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>

    <formula ref="defaultValueRef" title="默认值" v-model:formula="defaultValue" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import Formula from '../common/formula.vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 默认值
  const defaultValue = ref<string>('');
  const valueType = ref<string>('formula');
  // 注册组件
  const defaultValueRef = ref();

  /**
   * @description: 显示默认值
   */
  const showDefaultValue = () => {
    defaultValueRef.value.init();
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
