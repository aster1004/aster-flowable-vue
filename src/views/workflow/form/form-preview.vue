<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-08 17:50:14
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-preview.vue
 * @Description: 预览表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-drawer
    v-model="visible"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    :lock-scroll="false"
    :z-index="666"
    size="60%"
  >
    <form-render
      ref="formRenderRef"
      v-model:form-data="formData"
      :form-items="_formItems"
      :form-info="_formInfo"
    />
    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref, watch } from 'vue';
  import FormRender from './form-render.vue';
  import { setDefaultValue } from '@/utils/workflow';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const workFlowStore = useWorkFlowStore();

  /** 显示 */
  const visible = ref(false);
  /** 标题 */
  const title = ref(t('button.preview'));
  // 表单数据
  const formData = ref<WorkForm.FormDataModel>({});
  // 注册组件
  const formRenderRef = ref();

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = () => {
    visible.value = true;
    setDefaultValue(_formItems.value, formData.value);
  };

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
      labelWidth: workFlowStore.design.labelWidth,
    };
    return formInfo;
  });

  /**
   * @description: 表单数据
   */
  const _formData = computed(() => {
    return JSON.parse(JSON.stringify(formData.value));
  });

  watch(
    () => _formData.value,
    (val) => {
      console.log('preview--->', val);
    },
    {
      immediate: true,
      deep: true,
    },
  );

  defineExpose({ init });
</script>
<style scoped lang="scss"></style>
