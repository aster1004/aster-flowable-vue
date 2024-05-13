<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-15 17:45:56
 * @FilePath: \aster-flowable-vue\src\views\workflow\design\index.vue
 * @Description: 流程设计
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="design-container">
    <el-header class="design-header">
      <design-header ref="designHeaderRef" v-model="activeMenu" @save="save" @publish="publish" />
    </el-header>
    <el-main class="design-main">
      <form-design ref="formDesignRef" v-show="activeMenu === 'formDesign'" />
      <process-design ref="processDesignRef" v-show="activeMenu === 'processDesign'" />
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import DesignHeader from './design-header.vue';
  import FormDesign from '../form/form-design.vue';
  import ProcessDesign from '../process/process-design.vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { formSaveApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  const activeMenu = ref('formDesign');

  // 流程设计
  const processDesignRef = ref();

  let route = useRoute();

  /**
   * @description 保存
   */
  const save = () => {
    console.log('save');
    nextTick(() => {
      processDesignRef.value.jsonValue();
    });
    workFlowStore.design;
  };

  /**
   * @description 发布
   */
  const publish = () => {
    console.log('publish');
    nextTick(() => {
      processDesignRef.value.jsonValue();
    });
    console.info(workFlowStore.design);
    formSaveApi(workFlowStore.design).then((res) => {
      console.info('保存成功');
      console.info(res);
      if (res.code == ResultEnum.SUCCESS) {
        ElMessage.success({
          message: t('common.success'),
          duration: 500,
          onClose: () => {},
        });
      }
    });
  };

  onMounted(() => {
    if (route.query.appId && typeof route.query.appId === 'string') {
      workFlowStore.design.appId = route.query.appId;
    }
  });
</script>
<style scoped lang="scss">
  .design-container {
    height: 100%;
    background-color: #f2f3f5;
  }

  .design-header {
    height: 60px;
    padding: 0 !important;
  }

  .design-main {
    height: calc(100% - 60px);
    margin: 15px 15px 5px;
    padding: 0 !important;
  }
</style>
