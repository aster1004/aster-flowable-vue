<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-03 15:19:20
 * @FilePath: \aster-flowable-vue\src\views\workflow\list\list-settings.vue
 * @Description: 列表设置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="list-container">
    <el-form label-position="top">
      <el-form-item label="排序字段">
        <el-select v-model="sortBy" placeholder="请选择">
          <el-option
            v-for="(item, index) in _formItem"
            :key="index"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序方式">
        <el-select v-model="sortDirection" placeholder="请选择">
          <el-option
            v-for="(item, index) in sortDirections"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="功能按钮"> </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { flatFormItemsExclude } from '@/utils/workflow';
  import { computed, ref, watchEffect } from 'vue';
  import { defaultComponentConfig } from '../components/component-config-export';
  import { useWorkFlowStore } from '@/stores/modules/workflow';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 排序字段
  const sortBy = ref<string>(
    workFlowStore.design.listSettings.sortBy ? workFlowStore.design.listSettings.sortBy : '',
  );
  // 排序方式
  const sortDirection = ref<string>(
    workFlowStore.design.listSettings.sortDirection
      ? workFlowStore.design.listSettings.sortDirection
      : '',
  );
  // 所有的排序方式
  const sortDirections = ref([
    { label: '升序', value: 'asc' },
    { label: '降序', value: 'desc' },
  ]);

  // 表单项扁平化，排除不需要的控件
  const _formItem = computed(() => {
    let items = flatFormItemsExclude(workFlowStore.design.formItems);
    items = [...defaultComponentConfig, ...items];
    return items;
  });

  // 监听数据
  watchEffect(() => {
    // 将排序字段、排序方式、功能按钮同步给store
    workFlowStore.design.listSettings.sortBy = sortBy.value;
    workFlowStore.design.listSettings.sortDirection = sortDirection.value;
  });
</script>
<style scoped lang="scss">
  .list-container {
    padding: 5px 15px;

    ::v-deep(.el-form-item__label) {
      font-weight: 600;
    }
  }
</style>
