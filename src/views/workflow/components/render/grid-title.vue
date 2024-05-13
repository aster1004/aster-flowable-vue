<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-10 14:54:53
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\grid-title.vue
 * @Description: 分组标题配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="mode === 'design'">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item :name="formItem.id">
        <template #title>
          <div class="flex justify-between items-center" style="width: 90%; color: #606266">
            <span :class="[formItem.props.fontSize, formItem.props.fontWeight]">
              {{ formItem.title }}
            </span>
            <span class="text-xs" v-show="_items.length === 0">拖入左侧控件到下方方框内</span>
          </div>
        </template>

        <draggable
          class="grid-title"
          item-key="id"
          :list="_items"
          group="form"
          @start="titleDrag = true"
          @end="titleDrag = false"
          @add="onAdd"
          :options="{
            animation: 300,
            chosenClass: 'choose',
            sort: true,
          }"
        >
          <template #item="{ element, index }">
            <div
              class="grid-component grid-item"
              @click.stop="onSelectComponent(element)"
              :style="onSelectedComponentStyle(element)"
            >
              <form-design-render :form-item="element" :mode="mode" />
              <div class="close" v-show="showCloseBtn(element)">
                <i class="iconfont icon-guanbi1" @click="onDeleteComponent(index)"></i>
              </div>
            </div>
          </template>
        </draggable>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div v-else-if="mode == 'form'">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item :name="formItem.id">
        <template #title>
          <div class="flex justify-between items-center" style="width: 90%; color: #606266">
            <span :class="[formItem.props.fontSize, formItem.props.fontWeight]">
              {{ formItem.title }}
            </span>
            <span class="text-xs" v-show="_items.length === 0">拖入左侧控件到下方方框内</span>
          </div>
        </template>
        <div v-for="(item, i) in _items" :key="i">
          <form-design-render
            v-if="item.name === 'GridLayout'"
            v-model:value="_value"
            :form-item="item"
            :form-data="_value"
            :mode="mode"
          />
          <form-design-render
            v-else
            v-model:value="_value[item.id]"
            :form-item="item"
            :form-data="_value"
            :mode="mode"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div v-else> {{ formItem.title }} </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { deleteFormComponent } from '@/utils/workflow';
  import FormDesignRender from '../../form/form-design-render.vue';
  import { ElMessageBox } from 'element-plus';
  import { computed, onMounted, PropType, ref } from 'vue';
  import draggable from 'vuedraggable';
  import { useI18n } from 'vue-i18n';

  const workFlowStore = useWorkFlowStore();
  const { t } = useI18n();

  const emits = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  // 拖拽
  const titleDrag = ref<boolean>(false);
  // 活动面板
  const activeNames = ref<string>('');

  /**
   * @description: 拖拽完成后触发
   * @return {*}
   */
  const onAdd = () => {
    _items.value = _items.value.filter((item) => item.name != 'GridTitle');
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
        deleteFormComponent(_items.value, index);
      })
      .catch(() => {});
  };

  /**
   * @description: 子组件
   * @return {*}
   */
  const _items = computed({
    get() {
      return props.formItem.props.items;
    },
    set(val) {
      props.formItem.props.items = val;
    },
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

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emits('update:value', val);
    },
  });

  onMounted(() => {
    if (props.formItem.id) {
      activeNames.value = props.formItem.id;
    }
  });
</script>
<style scoped lang="scss">
  .grid-title {
    min-height: 50px;
    margin-top: 5px;
    border: 1px solid #e4e4e4;
  }

  .grid-component {
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
  .grid-component:hover {
    border: 1px dashed var(--el-menu-active-color);
    background: var(--el-menu-active-bg-color);
  }
  .grid-item {
    position: relative;
    padding: 15px 25px 15px 15px;
    border: 1px dashed white;
    .el-form-item--default {
      margin-bottom: 0px;
    }
    .el-form-item {
      margin-bottom: 0px;
    }
  }
</style>
