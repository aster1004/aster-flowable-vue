<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-27 17:07:36
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-initiation.vue
 * @Description: 发起表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-drawer
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    :lock-scroll="false"
    :z-index="666"
    size="100%"
  >
    <form-render
      ref="formRenderRef"
      v-model:form-data="formData"
      :form-items="_formItems"
      :form-info="_formInfo"
    />
    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="validateForm">{{ $t('button.confirm') }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { formInfoApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { ElMessage } from 'element-plus';
  import { computed, ref, watch } from 'vue';
  import FormRender from './form-render.vue';

  // 获取工作流store
  const workFlowStore = useWorkFlowStore();

  /** 显示 */
  const visible = ref(false);
  // 注册组件
  const formRenderRef = ref();
  // 表单数据
  const formData = ref<WorkForm.FormDataModel>({});

  // 表单项
  const _formItems = computed(() => {
    const formItems = JSON.stringify(workFlowStore.design.formItems);
    return JSON.parse(formItems);
  });

  // 表单基本信息
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
   * @description: 加载表单信息
   * @param {string} id 表单主键
   * @return {*}
   */
  const loadFormInfo = async (formId: string) => {
    await formInfoApi(formId).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        workFlowStore.loadForm(res.data);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 加载实例数据
   * @param {string} formId 表单主键
   * @param {string} instanceId 实例主键
   * @return {*}
   */
  const loadFormData = async (formId: string, instanceId?: string) => {
    console.log('加载实例数据');
    console.log(formId, instanceId);
  };

  /**
   * @description: 验证表单
   */
  const validateForm = () => {
    formRenderRef.value.validate();
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = async (formId: string, instanceId?: string) => {
    visible.value = true;
    // 加载表单信息
    await loadFormInfo(formId);
    if (instanceId) {
      // 加载实例数据
      await loadFormData(formId, instanceId);
    } else {
      // 表单项默认值
      formData.value = workFlowStore.design.formItems.reduce(
        (acc, cur) => ({ ...acc, [cur.id]: cur.value }),
        {},
      );
    }
  };

  watch(
    () => formData.value,
    (val) => {
      console.log('preview--->formData');
      console.log(val);
    },
    {
      immediate: true,
      deep: true,
    },
  );

  defineExpose({ init });
</script>
<style scoped lang="scss"></style>
