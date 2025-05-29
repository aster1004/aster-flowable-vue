<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-28 10:24:39
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\input-text-config.vue
 * @Description: 单行文本 配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">单行文本</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" :maxlength="TITLE_MAXLENGTH" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.defaultValue')">
      <el-select v-model="valueType">
        <el-option label="计算公式" value="formula" />
        <el-option label="数据联动" value="linkage" />
      </el-select>
      <el-input @click="showDefaultValue" readonly>
        <template #suffix>
          <i class="iconfont icon-xinzeng" style="color: var(--el-color-primary)" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="t('workflow.component.placeholder')">
      <el-input
        v-model="_formItem.props.placeholder"
        placeholder="请设置提示语"
        :maxlength="PLACEHOLDER_MAXLENGTH"
      />
    </el-form-item>
    <el-form-item :label="t('workflow.component.format')">
      <el-select v-model="_formItem.props.format">
        <el-option
          v-for="(item, index) in InputTextFormats"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.checkDuplicate')">
      <el-switch v-model="_formItem.props.duplicate" />
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
  import { InputTextFormats } from '@/enums/workFlowEnum';
  import { useI18n } from 'vue-i18n';
  import { PLACEHOLDER_MAXLENGTH, TITLE_MAXLENGTH } from '@/config/formConfig';

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
<style scoped lang="scss"></style>
