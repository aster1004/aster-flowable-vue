<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-23 17:42:09
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\form-component-properties.vue
 * @Description: 加载表单控件属性
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="form-component-properties" v-if="_formItem">
    <el-form label-position="top">
      <el-form-item :label="t('workflow.component.code')">
        <el-input v-model="_formItem.id" readonly />
      </el-form-item>
      <component :is="_formItem.name" :ref="_formItem?.id + 'ConfigRef'" />
      <el-form-item v-if="_formItem.props.hasOwnProperty('hidden')">
        <template #label>
          <span>{{ t('workflow.component.hidden') }}</span>
          <el-tooltip :content="t('workflow.component.hiddenTip')" placement="top">
            <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
          </el-tooltip>
        </template>
        <el-input
          type="button"
          :model-value="t('workflow.component.hiddenBtn')"
          @click="showFormula"
        />
      </el-form-item>
    </el-form>

    <formula
      ref="formulaRef"
      :title="t('workflow.component.hidden')"
      v-model:formula="_formItem.props.hidden"
      :placeholder="t('workflow.component.hiddenPlaceholder')"
    />
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
  import { useI18n } from 'vue-i18n';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 国际化
  const { t } = useI18n();
  // 注册组件
  const formulaRef = ref();

  /**
   * @description: 显示公式
   */
  const showFormula = () => {
    formulaRef.value.init();
  };

  // 选中的组件
  const _formItem = computed(() => {
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
