<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 10:48:49
 * @FilePath: \aster-flowable-vue\src\views\assembly\icon-select\index.vue
 * @Description: 图标选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card content-box">
    <span class="text"> 图标选择器 </span>
    <icon-select v-model:icon="iconValue" />
    <el-descriptions title="配置项" :column="1" border>
      <el-descriptions-item label="iconValue">
        双向绑定的icon值，使用示例：v-model:icon="iconValue"
      </el-descriptions-item>
      <el-descriptions-item label="color"> 图标颜色，默认为空 </el-descriptions-item>
      <el-descriptions-item label="size"> 图标大小，默认为30px </el-descriptions-item>
      <el-descriptions-item label="placeholder"> 输入框占位文本 </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts" name="selectIcon">
  import { ref } from 'vue';
  import IconSelect from '@/components/icon/icon-select.vue';
  const iconValue = ref('');
</script>

<style scoped lang="scss"></style>
