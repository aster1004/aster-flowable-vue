<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 15:20:41
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\print-template.vue
 * @Description: 打印模板
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    title="打印预览"
    v-model="visible"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    height="100%"
  >
    <div id="defaultPrint">
      <default-print
        :form-data="formData"
        :form-items="formItems"
        :form-info="formInfo"
        :form-status="formStatus"
      />
    </div>

    <template #footer>
      <el-button type="primary" v-print="printObj">打印</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { PropType, ref } from 'vue';
  import DefaultPrint from '../components/print/default-print.vue';
  import print from 'vue3-print-nb';

  defineProps({
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => ({}),
    },
    formItems: {
      type: Array as PropType<WorkComponent.ComponentConfig[]>,
      default: () => [],
    },
    formInfo: {
      type: Object as PropType<WorkForm.BaseInfo>,
      default: () => ({
        formName: '',
        icon: '',
        iconColor: '',
        labelPosition: '',
        labelWidth: 80,
      }),
    },
    formStatus: {
      type: String,
      default: '',
    },
  });

  // 是否显示弹窗
  const visible = ref(false);

  // 注册打印插件
  const vPrint = print;
  // 打印配置
  const printObj = ref({
    id: 'defaultPrint',
    popTitle: '&nbsp', // 页眉
  });

  // 打印预览
  const init = () => {
    visible.value = true;
  };

  defineExpose({ init });
</script>
<style scoped lang="scss">
  // 去除页眉
  @page {
    size: auto;
    margin-top: 3mm;
  }
</style>
