<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-07-04 15:25:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-detail.vue
 * @Description: 表单详情
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <form-render
    ref="formRenderRef"
    v-model:form-data="formData"
    :form-items="_formItems"
    :form-info="_formInfo"
  />
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { instanceInfoApi } from '@/api/workflow/instance';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import { computed, reactive, ref, watch } from 'vue';
  import FormRender from './form-render.vue';

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
    procDefId: {
      type: String,
      default: '',
    },
  });

  const workFlowStore = useWorkFlowStore();

  // 表单数据
  const formData = ref<WorkForm.FormDataModel>({});

  // 查询参数
  const queryParams = reactive<Process.InstanceQueryParams>({
    id: props.id,
    code: props.code,
    procDefId: props.procDefId,
  });

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = () => {
    instanceInfoApi(queryParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        const instanceInfo = res.data.instanceInfo;
        const formDesignInfo = res.data.formInfo;
        if (isNotEmpty(instanceInfo)) {
          for (const key in instanceInfo) {
            if (key.indexOf('field') != -1) {
              formData.value[key] = instanceInfo[key];
            }
          }
        }
        if (isNotEmpty(formDesignInfo)) {
          workFlowStore.design = formDesignInfo;
        }
      }
    });
  };

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
   * 监听数据变化
   */
  watch(
    () => [props.id, props.code, props.procDefId],
    ([id, code, procDefId]) => {
      if (isNotEmpty(id) && isNotEmpty(code)) {
        queryParams.id = id;
        queryParams.code = code;
        queryParams.procDefId = procDefId;
        init();
      }
    },
  );
</script>
<style scoped lang="scss"></style>
