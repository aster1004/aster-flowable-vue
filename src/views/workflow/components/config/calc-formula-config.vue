<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:46:20
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\calc-formula-config.vue
 * @Description: 计算公式配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">计算公式</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.placeholder')">
      <el-input v-model="_formItem.props.placeholder" placeholder="请设置提示语" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>{{ t('workflow.component.numericalPrecision') }}</span>
        <el-tooltip :content="t('workflow.component.precisionTip')" placement="top">
          <span class="tooltip"><i class="iconfont icon-tishi !text-sm"></i></span>
        </el-tooltip>
      </template>
      <el-input-number v-model="_formItem.props.precision" :min="0" :max="10" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.formulaConfig')">
      <el-button style="width: 100%" :icon="Setting" @click="showFormula">
        {{ t('workflow.component.formulaConfigTip') }}
      </el-button>
      <div class="calc-preview" v-if="_formItem.props.formula">
        <code-mirror
          ref="codeMirrorRef"
          :editable="false"
          :placeholder="t('workflow.component.formulaConfigTip')"
        ></code-mirror>
      </div>
    </el-form-item>
    <!--  计算公式组件  -->
    <formula
      ref="formulaRef"
      :title="t('workflow.component.formulaConfig')"
      :placeholder="t('workflow.component.formulaConfigTip')"
      v-model:formula="_formItem.props.formula"
    />
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref, watchEffect } from 'vue';
  import { Setting } from '@element-plus/icons-vue';
  import Formula from '@/views/workflow/components/common/formula.vue';
  import { isNotEmpty } from '@/utils';
  import { flatFormItems, restorationFormulaByFormItems } from '@/utils/workflow';
  import CodeMirror from '@/views/workflow/components/common/code-mirror.vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const formulaRef = ref();
  const codeMirrorRef = ref();

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

  // 选中的组件
  const _flatFormItems = computed(() => {
    return flatFormItems(workFlowStore.design.formItems);
  });
  watchEffect(() => {
    if (codeMirrorRef.value && isNotEmpty(_formItem.value?.props.formula)) {
      const label = restorationFormulaByFormItems(
        _formItem.value?.props.formula,
        _flatFormItems.value,
      );
      codeMirrorRef.value.setValue(label);
    }
  });
</script>
<style scoped lang="scss">
  .calc-preview {
    word-break: break-all;
    max-height: 110px;
    width: 100%;
    border: 1px dashed var(--el-border-color-light);
    border-top: none;
    overflow: auto;
    color: #a8abb2;
    ::v-deep(.ͼ2 .cm-gutters) {
      display: none;
    }
  }
</style>
