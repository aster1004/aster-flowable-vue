<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 10:09:36
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\input-amount-config.vue
 * @Description: 金额输入框配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">金额</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
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
    <el-form-item :label="t('workflow.component.displayChinese')">
      <el-switch v-model="_formItem.props.showChinese" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.defaultValue')">
      <el-select v-model="valueType">
        <el-option label="计算公式" value="formula" />
        <el-option label="数据联动" value="linkage" />
      </el-select>
      <el-input @click="showDefaultValue">
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="t('workflow.component.placeholder')">
      <el-input v-model="_formItem.props.placeholder" placeholder="请设置提示语" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>

    <formula
      ref="defaultValueRef"
      v-if="valueType === 'formula' && _formItem.props.default"
      v-model:formula="_formItem.props.default.value"
      type="assignment"
      :header-title="`${_formItem.title}的值=`"
    />
    <data-linkage ref="dataLinkageRef" v-if="valueType === 'linkage' && _formItem.props.default" />
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, onMounted, ref } from 'vue';
  import Formula from '../common/formula.vue';
  import DataLinkage from '../common/data-linkage.vue';
  import { ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const defaultValueRef = ref();
  const dataLinkageRef = ref();
  // 默认值类型
  const valueType = ref<string>('formula');

  /**
   * @description: 显示默认值
   */
  const showDefaultValue = () => {
    if (!_formItem.value || !_formItem.value.props.hasOwnProperty('default')) {
      ElMessage.warning('该控件的配置信息已更改，如要设置默认值需删除后重新拖入表单');
      return;
    }
    if (valueType.value === 'formula') {
      defaultValueRef.value.init();
    }
    if (valueType.value === 'linkage') {
      dataLinkageRef.value.init();
    }
    if (_formItem.value && _formItem.value.props.hasOwnProperty('default')) {
      _formItem.value.props.default.type = valueType.value;
    }
  };

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  // 打开组件时，获取默认值类型
  onMounted(() => {
    if (_formItem.value && _formItem.value.props.default) {
      valueType.value = _formItem.value.props.default.type;
    } else {
      valueType.value = 'formula';
    }
  });
</script>
<style scoped lang="scss">
  .tooltip {
    font-weight: 100;
    padding-left: 5px;
  }
</style>
