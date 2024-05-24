<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 18:33:43
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\date-time-range-config.vue
 * @Description: 日期范围配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item label="控件名称">
      <template #label>
        <div class="flex justify-between items-center">
          <span>控件名称</span>
          <span class="text-xs font-normal">日期</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item label="日期格式">
      <el-select v-model="_formItem.props.format" placeholder="请选择日期格式">
        <el-option
          v-for="(item, index) in formatOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <el-form-item label="展示时长">
      <el-switch v-model="_formItem.props.showLength" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 日期格式
  const formatOptions = ref([
    { label: '年-月-日', value: 'YYYY-MM-DD' },
    { label: '年-月-日 时:分', value: 'YYYY-MM-DD HH:mm' },
    { label: '年-月-日 时:分:秒', value: 'YYYY-MM-DD HH:mm:ss' },
  ]);

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss"></style>
