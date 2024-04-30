<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-28 10:24:39
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\input-text-config.vue
 * @Description: 单行文本 配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="formItem">
    <el-form-item label="控件编码">
      <el-input v-model="formItem.id" readonly />
    </el-form-item>
    <el-form-item label="控件名称">
      <el-input v-model="formItem.title" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>隐藏条件</span>
        <el-tooltip content="隐藏条件，满足条件时隐藏控件" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input type="button" model-value="请设置隐藏条件" @click="showFormula" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="formItem.value" />
    </el-form-item>
    <el-form-item label="提示语">
      <el-input v-model="formItem.props.placeholder" placeholder="请设置提示语" />
    </el-form-item>
    <el-form-item label="必填项">
      <el-switch v-model="formItem.props.required" />
    </el-form-item>

    <formula ref="formulaRef" title="隐藏条件" :formula="formItem.props.formula" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import Formula from '../common/formula.vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const formulaRef = ref();
  /**
   * @description: 显示公式
   */
  const showFormula = () => {
    formulaRef.value.init();
  };

  // 选中的组件
  const formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss">
  .tooltip {
    font-weight: 100;
    padding-left: 5px;
  }
</style>
