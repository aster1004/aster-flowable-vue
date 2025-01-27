<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-08 09:41:39
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\config\grid-layout-config.vue
 * @Description: 一行多列配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="_formItem">
    <el-form-item :label="t('workflow.component.name')">
      <template #label>
        <div class="flex justify-between items-center">
          <span>{{ t('workflow.component.name') }}</span>
          <span class="text-xs font-normal">一行多列</span>
        </div>
      </template>
      <el-input v-model="_formItem.title" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.justifiy')">
      <el-select v-model="_formItem.props.justify">
        <el-option
          v-for="item in justifyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('workflow.component.columnGutter')">
      <el-input v-model="_gutter" type="number" placeholder="请输入分栏间隔" />
    </el-form-item>
    <el-form-item :label="t('workflow.component.columnCount')">
      <el-select v-model="_formItem.props.cols">
        <el-option value="12,12" label="一行两列[1:1]">
          <el-row
            class="layout-bg"
            :justify="_formItem.props.justify"
            :gutter="_formItem.props.gutter"
          >
            <el-col :span="12"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="12"><div class="layout-bg-light"></div></el-col>
          </el-row>
        </el-option>
        <el-option value="8,8,8" label="一行三列[1:1:1]">
          <el-row
            class="layout-bg"
            :justify="_formItem.props.justify"
            :gutter="_formItem.props.gutter"
          >
            <el-col :span="8"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="8"><div class="layout-bg-light"></div></el-col>
            <el-col :span="8"><div class="layout-bg-deep"></div></el-col>
          </el-row>
        </el-option>
        <el-option value="6,6,6,6" label="一行四列[1:1:1:1]">
          <el-row
            class="layout-bg"
            :justify="_formItem.props.justify"
            :gutter="_formItem.props.gutter"
          >
            <el-col :span="6"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="6"><div class="layout-bg-light"></div></el-col>
            <el-col :span="6"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="6"><div class="layout-bg-light"></div></el-col>
          </el-row>
        </el-option>
        <el-option value="12,6,6" label="一行三列[2:1:1]">
          <el-row
            class="layout-bg"
            :justify="_formItem.props.justify"
            :gutter="_formItem.props.gutter"
          >
            <el-col :span="12"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="6"><div class="layout-bg-light"></div></el-col>
            <el-col :span="6"><div class="layout-bg-deep"></div></el-col>
          </el-row>
        </el-option>
        <el-option value="6,6,12" label="一行三列[1:1:2]">
          <el-row
            class="layout-bg"
            :justify="_formItem.props.justify"
            :gutter="_formItem.props.gutter"
          >
            <el-col :span="6"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="6"><div class="layout-bg-light"></div></el-col>
            <el-col :span="12"><div class="layout-bg-deep"></div></el-col>
          </el-row>
        </el-option>
        <el-option value="6,12,6" label="一行三列[1:2:1]">
          <el-row
            class="layout-bg"
            :justify="_formItem.props.justify"
            :gutter="_formItem.props.gutter"
          >
            <el-col :span="6"><div class="layout-bg-deep"></div></el-col>
            <el-col :span="12"><div class="layout-bg-light"></div></el-col>
            <el-col :span="6"><div class="layout-bg-deep"></div></el-col>
          </el-row>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 对齐方式
  const justifyOptions = ref([
    { value: 'start', label: '左对齐' },
    { value: 'end', label: '右对齐' },
    { value: 'center', label: '居中对齐' },
    { value: 'space-between', label: '均匀排列,两端对齐' },
    { value: 'space-around', label: '均匀排列,空间相同' },
    { value: 'space-evenly', label: '均匀排列,间隔相等' },
  ]);

  // 选中的组件
  const _formItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  // 栅格间隔
  const _gutter = computed({
    get() {
      return _formItem.value ? _formItem.value.props.gutter : 0;
    },
    set(val) {
      if (_formItem.value) {
        _formItem.value.props.gutter = Number(val);
      }
    },
  });
</script>
<style scoped lang="scss">
  .layout-bg {
    padding-top: 5px;
  }
  .layout-bg-deep {
    min-height: 30px;
    background-color: #d3dce6;
  }

  .layout-bg-light {
    min-height: 30px;
    background-color: #e5e9f2;
  }
</style>
