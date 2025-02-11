<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:38:41
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\associated-form-config.vue
 * @Description: 关联表单配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">关联表单</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.associatedForm')">
      <el-cascader
        v-model="_formItem.props.formCode"
        :options="treeNodes"
        :show-all-levels="false"
        clearable
        filterable
        placeholder="请选择关联表单"
        @change="handleChange"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item :label="t('workflow.component.dataScope')">
      <el-input :value="_formItem.props.dataScope.label" readonly @click="showDataScope">
        <template #suffix>
          <i class="iconfont icon-plus"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="t('workflow.component.dataFill')">
      <el-input readonly @click="showDataFill">
        <template #suffix>
          <i class="iconfont icon-plus"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="t('workflow.component.displayField')">
      <el-select
        v-model="_formItem.props.displayField"
        :multiple="true"
        :clearable="true"
        :disabled="_formItem.props.readonly"
      >
        <el-option
          v-for="(item, i) in displayFormItems"
          :key="i"
          :label="item.title"
          :value="item.id"
        >
          {{ item.title }}
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.required')">
      <el-switch v-model="_formItem.props.required" />
    </el-form-item>

    <data-scope
      ref="dataScopeRef"
      :title="`关联表单-${_formItem.props.formName}`"
      v-model:label="_formItem.props.dataScope.label"
      v-model:formula="_formItem.props.dataScope.value"
    />

    <data-fill ref="dataFillRef" @updateDataFill="updateDataFill" />
  </div>
</template>
<script setup lang="ts">
  import { appFormTreeApi } from '@/api/workflow/app';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isNotEmpty } from '@/utils';
  import { ElMessage } from 'element-plus';
  import { computed, onBeforeMount, ref, watchEffect } from 'vue';
  import DataScope from '../common/data-scope.vue';
  import DataFill from '../common/data-fill.vue';
  import { flatFormItemsExclude } from '@/utils/workflow';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const dataScopeRef = ref();
  const dataFillRef = ref();
  // 表单树
  const treeNodes = ref<WorkComponent.TreeNode[]>([]);
  // 关联表单信息
  const associatedFormInfo = ref<WorkForm.FormModel>();
  // 关联表单的表单项
  const displayFormItems = ref<WorkComponent.ComponentConfig[]>([]);

  /**
   * @description: 显示应用表单树
   * @return {*}
   */
  const getTreeData = () => {
    appFormTreeApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        treeNodes.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 级联选中值变化
   * @param {string[]} val 选中的值
   * @return {*}
   */
  const handleChange = (val: string[]) => {
    if (val && isNotEmpty(val) && val.length === 2) {
      let formName = '';
      treeNodes.value.forEach((app) => {
        if (app.value === val[0]) {
          app.children?.forEach((form) => {
            if (form.value === val[1]) {
              formName = form.label;
            }
          });
        }
      });
      if (_formItem.value) {
        // 如果值变动, 则数据填充规则和数据范围限定都需清空
        if (_formItem.value.props.formCode != val) {
          _formItem.value.props.dataFill = [];
          _formItem.value.props.dataScope = {
            label: '',
            value: '',
          };
        }
        _formItem.value.props.formCode = val;
        _formItem.value.props.formName = formName;
      }
    } else {
      // 值置空时, 需清空所有数据
      if (_formItem.value) {
        _formItem.value.props.formCode = [];
        _formItem.value.props.formName = '';
        _formItem.value.props.dataFill = [];
        _formItem.value.props.dataScope = {
          label: '',
          value: '',
        };
      }
    }
  };

  /**
   * @description: 获取关联表单信息
   * @return {*}
   */
  const getAssociatedFormInfo = async (code: string) => {
    await formInfoByCodeApi(code).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        associatedFormInfo.value = res.data;
        if (_formItem.value) {
          _formItem.value.props.displayField = associatedFormInfo.value.dataTitle;
        }
        displayFormItems.value = flatFormItemsExclude(res.data.formItems).filter((item) => {
          return (
            item.name !== 'AssociatedForm' &&
            item.name !== 'UserPicker' &&
            item.name !== 'DeptPicker'
          );
        });
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 显示数据范围限定
   * @return {*}
   */
  const showDataScope = () => {
    // 显示数据范围限定
    if (associatedFormInfo.value && isNotEmpty(associatedFormInfo.value)) {
      dataScopeRef.value.init(associatedFormInfo.value?.formItems);
    } else {
      ElMessage.error('请先选择关联表单');
    }
  };

  /**
   * @description: 显示数据填充规则
   * @return {*}
   */
  const showDataFill = () => {
    // 数据填充规则
    const dataFill = _formItem.value?.props.dataFill;
    // 当前表单的表单项
    const formItems = workFlowStore.design.formItems;
    // 显示数据填充规则
    if (associatedFormInfo.value && isNotEmpty(associatedFormInfo.value)) {
      dataFillRef.value.init(dataFill, formItems, associatedFormInfo.value?.formItems);
    } else {
      ElMessage.error('请先选择关联表单');
    }
  };

  /**
   * @description: 更新数据填充规则
   * @param {WorkComponent.DataFillModel[]} dataFill
   * @return {*}
   */
  const updateDataFill = (dataFill: WorkComponent.DataFillModel[]) => {
    if (_formItem.value) _formItem.value.props.dataFill = dataFill;
  };

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  watchEffect(() => {
    // 获取关联表单信息
    if (
      _formItem.value &&
      _formItem.value.props.formCode &&
      _formItem.value.props.formCode.length === 2
    ) {
      getAssociatedFormInfo(_formItem.value?.props.formCode[1]);
    }
  });

  onBeforeMount(() => {
    getTreeData();
  });
</script>
<style scoped lang="scss"></style>
