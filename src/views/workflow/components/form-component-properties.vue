<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-23 17:42:09
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\form-component-properties.vue
 * @Description: 加载表单控件属性
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="form-component-properties">
    <el-form label-position="top">
      <component :is="formItem?.name" :ref="formItem?.id + 'ConfigRef'" />
    </el-form>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import configExport from './config/config-export';
  export default defineComponent({
    components: configExport,
  });
</script>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed } from 'vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 组件配置
  const formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss">
  .form-component-properties {
    padding: 5px 15px;
  }

  ::v-deep(.el-form-item__label) {
    font-weight: 600;
  }
</style>
