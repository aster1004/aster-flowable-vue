<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 14:21:28
 * @FilePath: \aster-flowable-vue\src\views\assembly\tree-filter\index.vue
 * @Description: 树形筛选器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="content-box">
    <tree-filter
      ref="treeFilterRef"
      title="部门列表(单选)"
      label="name"
      :request-api="deptListApi"
      :default-value="treeFilterValue.deptId"
      @change="changeTreeFilter"
    />
    <tree-filter
      ref="treeFilterMultipleRef"
      title="部门列表(多选)"
      label="name"
      multiple
      :request-api="deptListApi"
      :default-value="treeFilterMultipleValue.deptId"
      @change="changeTreeFilterMultiple"
    />
    <div class="descriptions-box card">
      <span class="text"> 树形筛选器 </span>
      <el-descriptions title="配置项" :column="1" border>
        <el-descriptions-item label="requestApi"> 请求分类数据的 api </el-descriptions-item>
        <el-descriptions-item label="data">
          分类数据，如果有分类数据，则不会执行 api 请求
        </el-descriptions-item>
        <el-descriptions-item label="title"> treeFilter 标题 </el-descriptions-item>
        <el-descriptions-item label="id"> 选择的id，默认为 “id” </el-descriptions-item>
        <el-descriptions-item label="label"> 显示的label，默认为 “label” </el-descriptions-item>
        <el-descriptions-item label="multiple"> 是否为多选，默认为 false </el-descriptions-item>
        <el-descriptions-item label="defaultValue"> 默认选中的值 </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
<script setup lang="ts" name="treeFilter">
  import { reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { deptListApi } from '@/api/sys/dept';
  import TreeFilter from '@/components/tree/tree-filter.vue';

  const treeFilterValue = reactive({ deptId: '1' });
  const changeTreeFilter = (val: string) => {
    ElMessage.success(`你选择了 id 为 ${val} 的数据`);
    treeFilterValue.deptId = val;
  };

  const treeFilterMultipleValue = reactive({ deptId: ['111'] });
  const changeTreeFilterMultiple = (val: string[]) => {
    ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据`);
    treeFilterMultipleValue.deptId = val;
  };
</script>
<style lang="scss" scoped>
  .content-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .descriptions-box {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }
  }
</style>
