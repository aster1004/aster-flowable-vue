<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-03 11:02:24
 * @FilePath: \aster-flowable-vue\src\views\workflow\list\list-design.vue
 * @Description: 列表设计
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="list-container">
    <el-main class="list-main">
      <list-render ref="listRenderRef" />
    </el-main>
    <el-aside class="list-aside">
      <el-scrollbar style="height: 100%">
        <el-tabs v-model="activeTab" class="right-tabs">
          <el-tab-pane :label="t('workflow.list.fieldSetting')" name="field">
            <field-settings ref="fieldSettingsRef" />
          </el-tab-pane>
          <el-tab-pane :label="t('workflow.list.listSetting')" name="list">
            <list-settings ref="listSettingsRef" />
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </el-aside>
  </el-container>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import FieldSettings from './field-settings.vue';
  import ListSettings from './list-settings.vue';
  import ListRender from './list-render.vue';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 默认选中字段设置
  const activeTab = ref('field');
</script>
<style scoped lang="scss">
  .el-container .el-main {
    overflow: hidden;
    padding: 0;
  }

  .list-container {
    height: 100%;

    .list-main {
      margin: 0 5px;
    }

    .list-aside {
      margin: 0 5px;
      border-radius: 6px;
      background-color: var(--el-bg-color);
      border: 1px solid var(--el-aside-border-color);
    }

    ::v-deep(.el-tabs__header) {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* 去掉tabs标签栏下的下划线 */
    ::v-deep(.el-tabs__nav-wrap::after) {
      position: static !important;
    }
  }
</style>
