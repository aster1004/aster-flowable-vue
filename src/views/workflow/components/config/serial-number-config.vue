<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:22:30
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\serial-number-config.vue
 * @Description: 流水号配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">流水号</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item label="流水号规则">
      <template #label>
        <div class="flex justify-between items-center">
          <span>流水号规则</span>
          <el-button type="primary" link class="text-xs font-normal" @click="showRules">
            设置
          </el-button>
        </div>
      </template>
      <el-input :model-value="displayRule" disabled />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <!-- 配置规则 -->
    <serial-number-rule ref="serialNumberConfigRef" @saveRules="saveRules" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import SerialNumberRule from '../common/serial-number-rule.vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const serialNumberConfigRef = ref();
  // 规则展示
  const displayRule = ref('');
  // 显示规则
  const showRules = () => {
    const rules = _formItem.value ? _formItem.value.props.rules : [];
    serialNumberConfigRef.value.init(rules);
  };

  // 保存规则
  const saveRules = (rules: WorkComponent.SerialNumberRule[], displayValue: string) => {
    if (_formItem.value) {
      _formItem.value.props.rules = rules;
    }
    displayRule.value = displayValue;
  };

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
