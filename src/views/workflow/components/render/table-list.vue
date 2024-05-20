<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 16:25:25
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\table-list.vue
 * @Description: 明细表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form v-if="mode === 'design'" class="table-list">
    <div class="table-title">
      <span class="text-sm">{{ formItem.title }}</span>
    </div>
    <el-row>
      <el-col :span="18" class="table-border">
        <div class="table-main">
          <el-table
            :data="designValue"
            :border="formItem.props.showBorder"
            :cell-style="cellStyle"
            :header-cell-style="headerCellStyle"
            :key="Math.random()"
            style="width: 100%"
          >
            <el-table-column
              v-for="(item, index) in _columns"
              :key="index"
              :prop="item.id"
              :label="item.title"
              header-align="center"
              align="center"
            >
              <template #default>
                <div
                  class="table-component"
                  @click.stop="onSelectComponent(item)"
                  :style="onSelectedComponentStyle(item)"
                >
                  <form-design-render :form-item="item" :mode="mode" :isChildTable="true" />
                  <div class="close" v-show="showCloseBtn(item)">
                    <i class="iconfont icon-guanbi1" @click="onDeleteComponent(index)"></i>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="6" class="table-border">
        <div class="table-tip">
          <span class="text-xs">拖入左侧控件到此处</span>
        </div>
        <draggable
          ref="draggerRef"
          class="table-dragger"
          :style="tableDraggerStyle"
          item-key="id"
          :list="_columns"
          group="form"
          @start="tableDrag = true"
          @end="tableDrag = false"
          @add="onAdd"
          :options="{
            animation: 300,
            chosenClass: 'choose',
            sort: true,
          }"
        >
          <template #item="{ index }">
            <span style="display: none"> {{ index }} </span>
          </template>
        </draggable>
      </el-col>
    </el-row>
  </el-form>
  <el-form v-else-if="mode == 'form'">
    <div class="table-main" :id="formItem.id">
      <div class="flex justify-between items-center pb-5px">
        <span class="text-base font-600">{{ formItem.title }}</span>
      </div>
      <el-table
        :data="_value"
        :border="formItem.props.showBorder"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        :key="Math.random()"
        style="width: 100%"
        max-height="250"
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          header-align="center"
          align="center"
        />
        <el-table-column
          v-for="(item, index) in _columns"
          :key="index"
          :prop="item.id"
          :label="item.title"
          header-align="center"
          align="center"
        >
          <template #header>
            <span style="color: #da4b2b" v-show="item.props.required"> * </span>
            {{ item.title }}
          </template>
          <template #default="scope">
            <div class="table-component">
              <form-design-render
                v-model:value="_value[scope.$index][item.id]"
                :form-data="formData"
                :form-item="item"
                :mode="mode"
                :isChildTable="true"
                :index="scope.$index"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label.operate')" fixed="right" width="150" align="center">
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handleCopy(scope.row, scope.$index)"
            >
              <i class="iconfont icon-xinzeng"></i>{{ $t('button.copy') }}
            </el-button>
            <el-button size="small" link type="primary" @click="handleRemove(scope.$index)">
              <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-btn">
        <el-button @click="handleAdd"> <i class="iconfont icon-xinzeng pr-5px"></i>增加 </el-button>
      </div>
    </div>
  </el-form>
  <div v-else> 出现未知错误,请联系管理员 </div>
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
      type: Array<WorkForm.FormDataModel>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  // 拖拽
  const tableDrag = ref<boolean>(false);

  // 单元格样式
  const cellStyle = ref({
    padding: '0px',
  });

  // 表头样式
  const headerCellStyle = ref({
    fontSize: '0.875rem',
    fontWeight: 600,
    padding: '3px 0',
  });

  // dragger样式
  const tableDraggerStyle = computed(() => {
    const len = props.formItem.props.columns.length;
    return {
      height: len > 0 ? '90px' : '60px',
    };
  });

  /**
   * @description: 拖拽完成后触发
   * @return {*}
   */
  const onAdd = () => {
    _columns.value = _columns.value.filter(
      (item: WorkComponent.ComponentConfig) =>
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
      ? 'padding-left: 3px; border-left: 4px solid var(--el-color-primary);background: var(--el-menu-active-bg-color);'
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
        deleteFormComponent(_columns.value, index);
      })
      .catch(() => {});
  };

  /**
   * @description: 子组件
   * @return {*}
   */
  const _columns = computed({
    get() {
      return props.formItem.props.columns;
    },
    set(val) {
      props.formItem.props.columns = val;
    },
  });

  // 设计时的数据
  const designValue = computed(() => {
    let obj = {};
    _columns.value.forEach((col) => {
      obj[col.id] = col.value;
    });
    return _columns.value.length > 0 ? [obj] : [];
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
   * @description: 添加一行
   * @return {*}
   */
  const handleAdd = () => {
    // 使用展开语法来创建对象，提高代码简洁性
    const rowData = _columns.value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    // 检查当前_value的类型，确保它可以被push操作
    if (_value.value == null || !Array.isArray(_value.value)) {
      _value.value = [rowData];
    } else {
      _value.value.push(rowData);
    }
  };

  /**
   * @description: 复制一行
   * @param {*} rowData 行数据
   * @param {*} index 行下标
   * @return {*}
   */
  const handleCopy = (rowData: any, index: number) => {
    // 使用splice()方法插入元素
    _value.value.splice(index + 1, 0, rowData);
  };

  /**
   * @description: 删除一行
   * @param {*} index 行下标
   * @return {*}
   */
  const handleRemove = (index: number) => {
    _value.value.splice(index, 1);
  };

  // const validate = (callback: Function) => {
  //   // 验证表单数据
  //   let isValid = false;
  //   // 需要每一行都验证必填

  // };
</script>
<style scoped lang="scss">
  .table-main {
    background: var(--el-fill-color-blank);
  }

  .table-list {
    color: #606266;

    .table-title {
      padding-bottom: 5px;
      font-weight: 600;
    }

    .table-border {
      border: 1px solid #ebeef5;
    }

    .table-component {
      position: relative;

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
  }
  .table-tip {
    position: absolute;
    right: 20px;
    top: 10px;
    bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #909399;
  }
  .table-dragger {
    width: 100%;
    position: relative;
  }
  .table-btn {
    width: 100%;
    padding-top: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  ::v-deep(.el-form-item__label) {
    padding: 0px !important;
  }

  ::v-deep(.el-form-item--default) {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
  }
</style>
