<template>
  <div v-if="mode === 'design'">
    <div class="flex justify-between" style="color: #606266">
      <span class="text-sm">分栏布局</span>
      <span class="text-xs" v-show="_items.length === 0">拖入左侧控件到下方方框内</span>
    </div>
    <draggable
      class="grid-layout"
      item-key="id"
      :list="_items"
      group="form"
      @start="layoutDrag = true"
      @end="layoutDrag = false"
      :options="{
        animation: 300,
        chosenClass: 'choose',
        sort: true,
      }"
    >
      <template #item="{ element, index }">
        <div
          class="grid-component w-form-item"
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
  </div>
  <div v-else-if="mode == 'form'">
    <el-row :gutter="formItem.props.gutter" :justify="formItem.props.justify">
      <el-col v-for="(item, i) in _items" :key="i" :span="_span(i)">
        <form-design-render
          v-model:value="_value[item.id]"
          :form-item="item"
          :form-data="_value"
          :mode="mode"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { deleteFormComponent } from '@/utils/workflow';
  import FormDesignRender from '../../form/form-design-render.vue';
  import { ElMessageBox } from 'element-plus';
  import { computed, PropType, ref } from 'vue';
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
  const layoutDrag = ref<boolean>(false);

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
      ? 'border-left: 4px solid var(--el-color-primary);background: #ecf8ff;'
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
   * @description: 计算栅格占据的列数
   * @param {*} index
   * @return {*}
   */
  const _span = (index: number) => {
    const cols: number[] = props.formItem.props.cols
      ? props.formItem.props.cols.split(',')
      : [12, 12];
    const len = cols.length;
    return Number(cols[index % len]);
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
</script>
<style scoped lang="scss">
  .grid-layout {
    min-height: 50px;
    margin-top: 5px;
    border: 1px solid #bbb;
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
          color: #f56c6c;
        }
      }
    }
  }
  .grid-component:hover {
    border: 1px dashed #409eff;
    background: #ecf8ff;
  }
  .w-form-item {
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
