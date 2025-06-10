<template>
  <div v-if="mode === 'design'">
    <div class="flex justify-between items-center" style="color: #606266">
      <span class="text-sm">一行多列</span>
      <span class="text-xs">拖入左侧控件到下方方框内</span>
    </div>
    <el-row :gutter="formItem.props.gutter">
      <el-col v-for="(item, i) in _items" :key="i" :span="_span(i)">
        <draggable
          :ref="`draggerRef${i}`"
          class="grid-layout"
          item-key="id"
          :list="item"
          group="form"
          @start="layoutDrag = true"
          @end="layoutDrag = false"
          @add="onAdd(i)"
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
                <i class="iconfont icon-guanbi1" @click="onDeleteComponent(i, index)"></i>
              </div>
            </div>
          </template>
        </draggable>
      </el-col>
    </el-row>
  </div>
  <div v-else-if="mode == 'form'">
    <el-row :gutter="formItem.props.gutter" :justify="formItem.props.justify">
      <el-col v-for="(item, i) in _items" :key="i" :span="_span(i)">
        <form-design-render
          v-for="subItem in item"
          v-model:value="_value[subItem.id]"
          :form-item="subItem"
          :form-data="_value"
          :mode="mode"
        />
      </el-col>
    </el-row>
  </div>
  <div v-else-if="mode == 'print'">
    <div class="print-layout" v-for="(item, index) in _printItems" :key="index">
      <template v-for="(subItem, i) in item">
        <form-design-render
          v-if="isNotEmpty(subItem.id)"
          v-model:value="_value[subItem.id]"
          :form-item="subItem"
          :form-data="_value"
          :mode="mode"
          :class="_printClass(index, i)"
          :key="subItem.id"
        />
        <div v-else :class="_printClass(index, i)"> </div>
      </template>
    </div>
  </div>
  <div v-else></div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { deleteFormComponent, deleteComponentValidate } from '@/utils/workflow';
  import FormDesignRender from '../../form/form-design-render.vue';
  import { ElMessageBox } from 'element-plus';
  import { computed, onBeforeMount, PropType, ref, watch } from 'vue';
  import draggable from 'vuedraggable';
  import { useI18n } from 'vue-i18n';
  import { isNotEmpty } from '@/utils';

  const workFlowStore = useWorkFlowStore();
  const { t } = useI18n();

  const emits = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
      default: 'design',
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  // 拖拽
  const layoutDrag = ref<boolean>(false);
  // 打印表单项
  const _printItems = ref<WorkComponent.ComponentConfig[][]>([]);

  /**
   * @description: 拖拽完成后触发
   * @param {*} i 表单项索引
   * @return {*}
   */
  const onAdd = (i) => {
    _items.value[i] = _items.value[i].filter(
      (item) =>
        item.name != 'GridTitle' &&
        item.name != 'GridLayout' &&
        item.name != 'TableList' &&
        item.name != 'Description',
    );
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
  const onDeleteComponent = (draggerIndex: number, index: number) => {
    // 校验其他组件中是否引用了该组件
    const validateFlag = deleteComponentValidate(
      workFlowStore.design.formItems,
      _items.value[draggerIndex][index].id,
    );
    if (!validateFlag) {
      return;
    }
    ElMessageBox.confirm(t('header.deleteComp'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        deleteFormComponent(_items.value[draggerIndex], index);
        _selectedItem.value = null;
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
   * @description: 计算打印样式
   * @param {*} index
   * @return {*}
   */
  const _printClass = (index: number, i: number) => {
    let clazzs: string[] = [];
    const cols: number[] = props.formItem.props.cols
      ? props.formItem.props.cols.split(',')
      : [12, 12];
    const len = Number(cols[index % cols.length]);
    if (len == 12) {
      clazzs.push('print-w-12');
    } else if (len == 8) {
      clazzs.push('print-w-8');
    } else if (len == 6) {
      clazzs.push('print-w-6');
    } else {
      clazzs.push('print-w-6');
    }
    if (index > 0) {
      clazzs.push('print-border-top');
    }
    if (i > 0) {
      clazzs.push('print-border-left');
    }
    return clazzs;
  };

  /**
   * 计算打印表单项
   */
  const getPrintItems = (items: WorkComponent.ComponentConfig[][]) => {
    if (props.mode === 'print' && items && items.length > 0) {
      const rows = items.length;
      const cols = Math.max(...items.map((row) => row.length));
      _printItems.value = new Array(cols).fill(null).map(() => []);
      // 遍历原始矩阵，并填充新数组
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // 如果当前列存在，则取值；否则填充 null 或其他默认值
          _printItems.value[j][i] =
            items[i][j] !== undefined
              ? items[i][j]
              : {
                  id: '',
                  name: '',
                  title: '',
                  icon: '',
                  value: '',
                  valueType: '',
                  props: {},
                };
        }
      }
    }
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

  /**
   * 设置分栏的数量
   */
  const refreshSpan = () => {
    // 初始化分栏数据值
    const spanProps = props.formItem.props;
    // 获取当前分栏列数
    const number = spanProps.cols.split(',').length;
    if (number > spanProps.items.length) {
      for (let i = 0; i < number; i++) {
        if (!spanProps.items[i]) {
          spanProps.items.push([]);
        }
      }
    } else {
      spanProps.items.length = number;
    }
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  onBeforeMount(() => {
    refreshSpan();
    getPrintItems(props.formItem.props.items);
  });

  /**
   * @description: 监听布局列数变化
   * @return {*}
   */
  watch(
    () => props.formItem.props.cols,
    () => {
      refreshSpan();
    },
  );

  /**
   * @description: 计算打印布局
   * @return {*}
   */
  watch(
    () => props.formItem.props.items,
    (val) => {
      getPrintItems(val);
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);

  .grid-layout {
    min-height: 66px;
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
