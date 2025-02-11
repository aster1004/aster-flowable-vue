<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 16:25:54
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\table-list-config.vue
 * @Description: 明细表配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">明细表</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.showBorder')">
      <el-switch v-model="_formItem.props.showBorder" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.defaultLines')">
      <el-input-number v-model="_formItem.props.rows" :min="0" :max="10" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.fieldSort')">
      <draggable
        :list="_formItem.props.columns"
        item-key=""
        group="columns"
        class="dragger-main"
        handler=".dragger-option"
        :options="{ animation: 300, sort: true }"
      >
        <template #item="{ element }">
          <div class="dragger-option">
            <el-row>
              <el-col :span="4">
                <i :class="['dragger-icon', element.icon]"></i>
              </el-col>
              <el-col :span="20">
                <span>{{ element.title }}</span>
              </el-col>
            </el-row>
          </div>
        </template>
      </draggable>
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed } from 'vue';
  import draggable from 'vuedraggable';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });
</script>
<style scoped lang="scss">
  .dragger-main {
    width: 100%;
    padding: 0px 10px;
  }

  .dragger-option {
    padding-bottom: 3px;
    color: #afadad;

    .dragger-icon {
      padding: 3px;
      font-size: 20px !important;
    }
  }
</style>
