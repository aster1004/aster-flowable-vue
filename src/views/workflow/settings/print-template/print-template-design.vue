<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-10-23 14:40:53
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\print-template\print-template-design.vue
 * @Description: 打印模板设计
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="print-design">
    <el-aside>
      <div class="print-design-left">
        <!-- 系统字段 -->
        <div class="left-container">
          <div class="left-title">
            <span>系统字段</span>
          </div>
          <div class="left-content">
            <div
              class="left-component"
              v-for="(item, index) in _defaultComponentConfig"
              :key="index"
              draggable="true"
              @dragstart="dragstart(item, $event)"
            >
              <i :class="[item.icon, '!text-xs', 'mr-3px']"></i>
              <span class="text-xs">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <!-- 表单字段 -->
        <div class="left-container">
          <div class="left-title">
            <span>表单字段</span>
          </div>
          <div class="left-content">
            <div
              class="left-component"
              v-for="(item, index) in _formItems"
              :key="index"
              draggable="true"
              @dragstart="dragstart(item, $event)"
            >
              <i :class="[item.icon, '!text-xs', 'mr-3px']"></i>
              <span class="text-xs">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-aside>
    <el-main class="print-design-main">
      <div class="main-container">
        <div class="main-header" ref="mainHeaderRef">
          <p>
            提示：从左侧拖拽字段到下方编辑器中，类似<span>名称: ${xxx}</span
            >的数据将在打印时替换成实际数据!
          </p>
        </div>
        <div class="main-content">
          <tinymce-editor ref="tinymceEditorRef" v-model:value="_value" :height="tinymceHeight" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { flatFormItems } from '@/utils/workflow';
  import { defaultComponentConfig } from '@/views/workflow/components/component-config-export';
  import TinymceEditor from '@/components/tinymce-editor/index.vue';
  import { computed, ref } from 'vue';

  const emits = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '设计模板',
    },
  });

  const workFlowStore = useWorkFlowStore();
  const mainHeaderRef = ref();
  const tinymceHeight = ref(600);

  /**
   * @description: 拖拽
   * @param {*} formItem 表单项
   * @param {*} event 事件
   * @return {*}
   */
  const dragstart = (formItem: WorkComponent.ComponentConfig, event) => {
    event.dataTransfer.setData('text', JSON.stringify(formItem));
  };

  /**
   * @description: 系统默认字段
   * @return {*}
   */
  const _defaultComponentConfig = computed(() => {
    return [
      {
        id: 'formName',
        title: '表单名称',
        name: 'formName',
        icon: workFlowStore.design.icon,
        value: workFlowStore.design.formName,
        valueType: 'string',
        props: {},
      },
      ...defaultComponentConfig,
    ];
  });

  /**
   * @description: 已绘制的表单项
   */
  const _formItems = computed(() => {
    const items = JSON.parse(JSON.stringify(workFlowStore.design.formItems));
    return flatFormItems(items);
  });

  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emits('update:value', val);
    },
  });
</script>
<style scoped lang="scss">
  .el-container .el-aside {
    height: auto !important;
  }
  .print-design {
    height: 100%;
  }

  .print-design-left {
    height: 100%;
    margin: 0 5px;
    border-radius: 6px;
    border: 1px solid var(--el-aside-border-color);

    .left-container {
      padding: 10px;

      .left-title {
        text-align: left;
        height: 26px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
          font-size: 14px;
          font-weight: 700;
          color: var(--el-text-color-primary);
        }
      }
      .left-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow: hidden;
      }

      .left-component {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: var(--el-text-color-primary);
        width: 130px;
        min-height: 32px;
        background: var(--el-fill-color-blank);
        border-radius: 5px;
        margin-bottom: 8px;
        padding: 2px 8px 2px;
        border: 1px solid var(--el-border-color);
      }
      .left-component:hover {
        background-color: var(--el-menu-active-bg-color);
        color: var(--el-menu-active-color);
        cursor: grab;
        border: 1px solid var(--el-menu-active-color);
        box-shadow: 0px 3px 6px 0px var(--el-color-primary-light-6);
      }
    }
  }

  .print-design-main {
    height: 100%;
    margin: 0 5px;
    border-radius: 6px;
    border: 1px solid var(--el-aside-border-color);
    background-color: var(--el-bg-color) !important;

    .main-container {
      margin-bottom: 5px;
      height: 100%;
      padding: 0px 10px;

      .main-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 40px;
        padding: 10px 15px;
        p {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          span {
            border: 1px solid #91caff;
            color: #0958d9;
            padding: 2px 7px;
            border-radius: 5px;
          }
        }
      }

      .main-content {
        max-height: calc(100vh - 120px);
      }
    }
  }
</style>
