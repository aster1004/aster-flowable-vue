<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-22 16:11:38
 * @FilePath: \aster-flowable-vue\src\views\workflow\workbench\process-instance-list.vue
 * @Description: 流程实例列表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="main-box">
    <!-- 左侧应用表单树 -->
    <form-tree-filter @change="changeForm" />
    <!-- 右侧表单实例 -->
    <list-render ref="listRenderRef" type="list" :code="formCode" :form-id="formId" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import FormTreeFilter from '../app/form-tree-filter.vue';
  import ListRender from '../list/list-render.vue';

  /** 注册组件 */
  const listRenderRef = ref();
  // 表单编码code
  const formCode = ref('');
  // 表单Id
  const formId = ref('');

  /**
   * @description: 切换表单
   * @param {WorkForm.FormModel} formInfo 选中的表单
   * @return {*}
   */
  const changeForm = (params: WorkForm.QueryParams) => {
    if (params.code && params.id) {
      formCode.value = params.code;
      formId.value = params.id;
    }
  };
</script>
<style lang="scss" scoped></style>
