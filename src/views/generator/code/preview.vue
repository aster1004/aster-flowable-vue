<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-29 10:04:20
 * @FilePath: \aster-admin\src\views\generator\code\preview.vue
 * @Description: 预览界面
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="preview.open"
    draggable
    :close-on-click-modal="false"
    :title="preview.title"
    append-to-body
    :lock-scroll="false"
  >
    <el-tabs v-model="preview.activeName">
      <el-tab-pane
        v-for="(item, key) in preview.data"
        :key="key"
        :label="item.fileName"
        :name="key"
      >
        <code-mirror v-model="item.content" :height="610"></code-mirror>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { ElLoading } from 'element-plus';
  import { previewApi } from '@/api/gen/index';
  import CodeMirror from '@/components/codemirror/index.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const preview = reactive({
    open: false,
    title: t('button.preview'),
    data: [] as Generator.PreviewInfo[],
    activeName: ref(0),
  });
  const init = async (tableId: string) => {
    const loadingInstance = ElLoading.service({ fullscreen: true });
    try {
      let resData = await previewApi(tableId);
      preview.activeName = 0;
      preview.data = resData.data;
      preview.open = true;
    } finally {
      loadingInstance.close();
    }
  };
  defineExpose({
    init,
  });
</script>
