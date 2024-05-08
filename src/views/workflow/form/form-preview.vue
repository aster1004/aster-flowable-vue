<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-08 17:50:14
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-preview.vue
 * @Description: 预览表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    draggable
  >
    <form-render v-model:form-data="formData" :form-items="_formItems" :form-info="_formInfo" />
    <template #footer>
      <el-button type="primary" @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import FormRender from './form-render.vue';

  const workFlowStore = useWorkFlowStore();

  /** 显示 */
  const visible = ref(false);
  /** 标题 */
  const title = ref('预览');

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = () => {
    visible.value = true;
  };

  const formData = ref<WorkForm.FormDataModel>({});

  const _formItems = computed(() => {
    const formItems = JSON.stringify(workFlowStore.design.formItems);
    return JSON.parse(formItems);
  });

  const _formInfo = computed(() => {
    const formInfo: WorkForm.BaseInfo = {
      formName: workFlowStore.design.formName,
      icon: workFlowStore.design.icon,
      iconColor: workFlowStore.design.iconColor,
      labelPosition: workFlowStore.design.labelPosition,
    };
    return formInfo;
  });

  defineExpose({ init });
</script>
<style scoped lang="scss"></style>
