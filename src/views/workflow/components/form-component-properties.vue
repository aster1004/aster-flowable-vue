<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-23 17:42:09
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\form-component-properties.vue
 * @Description: 加载表单控件属性
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="form-component-properties" v-if="formItem">
    <el-form label-position="top">
      <el-form-item label="控件编码">
        <el-input v-model="formItem.id" readonly />
      </el-form-item>
      <component :is="formItem.name" :ref="formItem?.id + 'ConfigRef'" />
      <el-form-item v-if="formItem.props.hasOwnProperty('hidden')">
        <template #label>
          <span>隐藏条件</span>
          <el-tooltip content="隐藏条件，满足条件时隐藏控件" placement="top">
            <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
          </el-tooltip>
        </template>
        <el-input type="button" model-value="请设置隐藏条件" @click="showFormula" />
      </el-form-item>
    </el-form>

    <formula ref="formulaRef" title="隐藏条件" v-model:formula="formItem.props.hidden" />
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
  import { computed, ref } from 'vue';
  import Formula from './common/formula.vue';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const formulaRef = ref();

  /**
   * @description: 显示公式
   */
  const showFormula = () => {
    formulaRef.value.init();
  };

  // 选中的组件
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
  .tooltip {
    font-weight: 100;
    padding-left: 5px;
  }
</style>
