<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-17 10:31:43
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-design.vue
 * @Description: 表单设计
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<!-- 模板 -->
<template>
  <el-container style="height: 100%">
    <!-- 左侧组件列表 -->
    <el-aside class="form-left">
      <el-scrollbar style="height: 100%">
        <div class="left-container" v-for="(config, index) in componentConfigExport" :key="index">
          <div class="left-title">
            <span>{{ config.title }}</span>
          </div>
          <draggable
            class="left-content"
            item-key="name"
            :list="config.components"
            :sort="false"
            :group="{ name: 'form', pull: 'clone', put: false }"
            @start="leftDrag = true"
            @end="leftDrag = false"
            :clone="clone"
          >
            <template #item="{ element }">
              <div class="left-component">
                <i :class="[element.icon, '!text-xs', 'mr-3px']"></i>
                <span class="text-xs">{{ element.title }}</span>
              </div>
            </template>
          </draggable>
        </div>
      </el-scrollbar>
    </el-aside>
    <!-- 中间表单内容 -->
    <el-main class="form-main">
      <div class="main-container">
        <div class="main-header">
          <el-button size="small" @click="preview">
            <template #icon>
              <i class="iconfont icon-jiankong !text-xs pr-5px"></i>
            </template>
            {{ $t('button.preview') }}
          </el-button>
        </div>
        <div :style="mainContentClass" @click="release">
          <el-scrollbar style="height: 100%">
            <el-form
              ref="formDesignRef"
              :label-width="formInfo.labelWidth"
              :label-position="formInfo.labelPosition"
            >
              <draggable
                class="main-content"
                item-key="id"
                :list="formItems"
                group="form"
                @start="mainDrag = true"
                @end="mainDrag = false"
                :options="{
                  animation: 300,
                  chosenClass: 'choose',
                  sort: true,
                }"
              >
                <template #item="{ element, index }">
                  <div
                    class="main-component w-form-item"
                    @click.stop="onSelectComponent(element)"
                    :style="onSelectedComponentStyle(element)"
                  >
                    <form-design-render :form-item="element" mode="design" />
                    <div class="close" v-show="showCloseBtn(element)">
                      <i class="iconfont icon-guanbi1" @click="onDeleteComponent(index)"></i>
                    </div>
                  </div>
                </template>
              </draggable>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </el-main>
    <!-- 右侧表单属性 -->
    <el-aside class="form-right">
      <el-scrollbar style="height: 100%">
        <el-tabs v-model="rightActiveTab" class="right-tabs">
          <el-tab-pane label="控件属性" name="component">
            <form-component-properties />
          </el-tab-pane>
          <el-tab-pane label="表单属性" name="form">
            <form-properties />
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </el-aside>
    <form-preview ref="formPreviewRef" />
  </el-container>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { deleteFormComponent, generateFieldId } from '@/utils/workflow';
  import { componentConfigExport } from '@/views/workflow/components/component-config-export';
  import FormProperties from '@/views/workflow/components/form-properties.vue';
  import FormComponentProperties from '@/views/workflow/components/form-component-properties.vue';
  import FormDesignRender from './form-design-render.vue';
  import FormPreview from './form-preview.vue';
  import { ElMessageBox } from 'element-plus';
  import { computed, onMounted, ref, watch } from 'vue';
  import draggable from 'vuedraggable';
  import { useI18n } from 'vue-i18n';

  const workFlowStore = useWorkFlowStore();
  const { t } = useI18n();

  // 注册组件
  const formPreviewRef = ref();

  /** 拖拽中 */
  const leftDrag = ref<boolean>(false);
  const mainDrag = ref<boolean>(false);
  /** 右侧激活的tab */
  const rightActiveTab = ref('');

  /**
   * @description: 复制
   * @param {*} element 组件
   * @return {*}
   */
  const clone = (element: WorkComponent.ComponentConfig) => {
    element.id = generateFieldId();
    return JSON.parse(JSON.stringify(element));
  };

  /**
   * @description: 释放组件
   * @return {*}
   */
  const release = () => {
    _selectedItem.value = null;
  };

  /**
   * @description: 选中组件
   * @param {*} element 组件
   * @return {*}
   */
  const onSelectComponent = (element: WorkComponent.ComponentConfig) => {
    _selectedItem.value = element;
  };

  /**
   * @description: 选中组件才显示删除按钮
   * @param element
   * @return boolean
   */
  const showCloseBtn = (element: WorkComponent.ComponentConfig) => {
    if (_selectedItem.value && _selectedItem.value.id === element.id) {
      return true;
    }
    return false;
  };

  /**
   * @description: 选中组件样式
   * @param {*} element 组件
   * @return {*}
   */
  const onSelectedComponentStyle = (element: WorkComponent.ComponentConfig) => {
    return _selectedItem.value && _selectedItem.value.id === element.id
      ? 'border-left: 4px solid var(--el-color-primary);background: var(--el-menu-active-bg-color);'
      : '';
  };

  /**
   * @description: 删除组件
   * @param {*} index 组件下标
   * @return {*}
   */
  const onDeleteComponent = (index: number) => {
    ElMessageBox.confirm(t('header.deleteComp'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        deleteFormComponent(formItems.value, index);
        _selectedItem.value = null;
      })
      .catch(() => {});
  };

  /**
   * 中间样式
   */
  const mainContentClass = computed(() => {
    if (formItems.value.length === 0 && !leftDrag.value) {
      return {
        backgroundImage: 'url(src/assets/images/form-empty.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      };
    }
    return { overflow: 'auto' };
  });

  /**
   * @description: 已绘制的表单
   */
  const formItems = computed(() => {
    return workFlowStore.design.formItems;
  });

  /**
   * @description: 表单数据
   */
  const formInfo = computed(() => {
    return workFlowStore.design;
  });

  /**
   * @description: 选中的表单组件
   */
  const _selectedItem = computed({
    get() {
      return workFlowStore.selectFormItem;
    },
    set(val) {
      workFlowStore.selectFormItem = val;
    },
  });

  // 监听选中的表单组件
  watch(
    () => workFlowStore.selectFormItem,
    (val) => {
      rightActiveTab.value = val == null ? 'form' : 'component';
    },
    {
      immediate: true,
      deep: true,
    },
  );

  /**
   * @description: 表单预览
   * @return {*}
   */
  const preview = () => {
    formPreviewRef.value.init();
  };

  onMounted(() => {
    rightActiveTab.value = 'form';
  });
</script>
<style scoped lang="scss">
  .el-container .el-aside {
    background-color: #f2f3f5;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-container .el-main {
    overflow: hidden;
    padding: 0;
  }

  .el-aside {
    box-sizing: border-box;
    flex-shrink: 0;
    width: var(--el-aside-width, 280px);
  }

  .form-left {
    margin: 0 5px;
  }

  .form-main {
    margin: 0 5px;
  }

  .form-right {
    margin: 0 5px;
    background-color: #fff !important;
  }

  .left-container {
    background-color: #fff;
    padding: 10px;
    margin-bottom: 5px;

    .left-title {
      text-align: left;
      height: 36px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span {
        font-size: 14px;
        font-weight: 700;
        color: #304265;
      }
    }
    .left-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      overflow: hidden;
      padding: 4px;
    }

    .left-component {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #304265;
      width: 110px;
      height: 32px;
      background: #fff;
      border-radius: 5px;
      margin-bottom: 8px;
      padding-left: 8px;
      border: 1px solid #ccc;
    }
    .left-component:hover {
      background-color: var(--el-menu-active-bg-color);
      color: var(--el-menu-active-color);
      cursor: grab;
      border: 1px solid var(--el-menu-active-color);
      box-shadow: 0px 3px 6px 0px var(--el-color-primary-light-6);
    }
  }

  .main-container {
    background-color: #fff;
    margin-bottom: 5px;
    height: 100%;
    padding: 0px 10px;

    .main-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 40px;
      padding-top: 5px;
    }

    .main-content {
      height: calc(100vh - 120px);
      max-height: calc(100vh - 80px);

      .main-component {
        position: relative;
        padding-left: 10px;
        padding-right: 20px;
        .close {
          position: absolute;
          top: 0px;
          right: 0px;
          i {
            font-size: large;
            cursor: pointer;
            color: #8c8c8c;
            padding: 5px;

            &:hover {
              color: $primary-color;
            }
          }
        }
      }
      .main-component:hover {
        border: 1px dashed var(--el-menu-active-color);
        background: var(--el-menu-active-bg-color);
      }
      .w-form-item {
        position: relative;
        padding: 15px 25px 15px 15px;
        margin: 5px 2px;
        border: 1px dashed white;
        background: #fbfcfd;
        .el-form-item--default {
          margin-bottom: 0px;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
      }
    }
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
</style>
