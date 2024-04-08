<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 15:03:56
 * @FilePath: \aster-flowable-vue\src\views\assembly\editor\index.vue
 * @Description: 富文本编辑器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card content-box">
    <span class="text"> 富文本编辑器 </span>
    <WangEditor v-model:value="content" height="400px" />
    <el-button type="primary" @click="dialogVisible = true"> 内容预览 </el-button>
    <el-descriptions title="配置项" :column="1" border>
      <el-descriptions-item label="value">
        双向绑定的 value 值，使用示例： v-model:value="content">
      </el-descriptions-item>
      <el-descriptions-item label="toolbarConfig">
        富文本 ToolBar区域 配置：
        <a href="https://www.wangeditor.com/v5/toolbar-config.html">
          https://www.wangeditor.com/v5/toolbar-config.html
        </a>
      </el-descriptions-item>
      <el-descriptions-item label="editorConfig">
        富文本 编辑区域 配置：
        <a href="https://www.wangeditor.com/v5/editor-config.html">
          https://www.wangeditor.com/v5/editor-config.html
        </a>
      </el-descriptions-item>
      <el-descriptions-item label="height"> 富文本高度，默认为 500px </el-descriptions-item>
      <el-descriptions-item label="mode">
        富文本模式，默认为 default（"default" | "simple"）
      </el-descriptions-item>
      <el-descriptions-item label="hideToolBar">
        隐藏 ToolBar 区域，默认为 false
      </el-descriptions-item>
      <el-descriptions-item label="disabled"> 禁用富文本编辑器，默认为 false </el-descriptions-item>
    </el-descriptions>
    <el-dialog
      v-model="dialogVisible"
      title="富文本内容预览"
      width="1300px"
      top="50px"
      :lock-scroll="false"
    >
      <div class="view" v-html="content"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="wangEditor">
  import { ref } from 'vue';
  import WangEditor from '@/components/wangEditor/index.vue';

  const content = ref('');

  const dialogVisible = ref(false);
</script>

<style scoped lang="scss">
  .el-button {
    margin-top: 20px;
  }
  :deep(.el-dialog__body) {
    height: 700px !important;
  }
</style>
