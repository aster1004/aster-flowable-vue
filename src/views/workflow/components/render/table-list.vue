<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-14 16:25:25
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\table-list.vue
 * @Description: 明细表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="!_hidden">
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
                min-width="120px"
              >
                <template #default>
                  <div
                    class="table-component"
                    @click.stop="onSelectComponent(item)"
                    :style="onSelectedComponentStyle(item)"
                  >
                    <form-design-render
                      :form-item="item"
                      :mode="mode"
                      :table-id="formItem.id"
                      :table-index="index"
                      :show-label="false"
                    />
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
    <div v-else-if="mode == 'form'">
      <div class="table-main" :id="formItem.id">
        <div class="flex items-center justify-between pb-5px">
          <span class="text-sm font-600">{{ formItem.title }}</span>
        </div>
        <el-table
          :data="_value"
          :border="formItem.props.showBorder"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          :key="Math.random()"
          style="width: 100%"
          max-height="250px"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <div @click="openRowInfo(scope.$index)">
                <span> {{ scope.$index + 1 }} </span>
                <span class="hover-text">
                  <i class="iconfont icon-fangda"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in _columns"
            :key="index"
            :prop="item.id"
            :label="item.title"
            header-align="center"
            align="center"
            min-width="120px"
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
                  :table-id="formItem.id"
                  :table-index="scope.$index"
                  :show-label="false"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!formItem.props.readonly"
            :label="$t('label.operate')"
            fixed="right"
            width="80"
            align="center"
          >
            <template #default="scope">
              <el-dropdown placement="top-start" trigger="click">
                <span><i class="iconfont icon-gengduo1"></i></span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleCopy(scope.row, scope.$index)">
                      <i class="iconfont icon-xinzeng !text-sm"></i>{{ $t('button.copy') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleRemove(scope.$index)">
                      <i class="iconfont icon-shanchu !text-sm"></i>{{ $t('button.delete') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleClear(scope.$index)">
                      <i class="iconfont icon-huancunjiankong !text-sm"></i>
                      {{ $t('workflow.clearRow') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleAdd(scope.$index, 'above')">
                      <i class="iconfont icon-xiangshang !text-sm"></i>
                      {{ $t('workflow.addRowAbove') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleAdd(scope.$index, 'below')">
                      <i class="iconfont icon-xiangxia !text-sm"></i>
                      {{ $t('workflow.addRowBelow') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-btn" v-if="!formItem.props.readonly">
          <el-button @click="handleAdd()">
            <i class="iconfont icon-xinzeng pr-5px"></i>增加
          </el-button>
        </div>
      </div>
      <el-drawer v-model="rowVisible" :append-to-body="true" @close="closeRowInfo">
        <el-form label-width="auto">
          <span>第 {{ rowIndex + 1 }} 行</span>
          <div v-for="(item, index) in _columns" :key="index">
            <form-design-render
              v-model:value="_value[rowIndex][item.id]"
              :form-data="formData"
              :form-item="item"
              :mode="mode"
              :isChildTable="true"
              :index="rowIndex"
            />
          </div>
        </el-form>
        <template #footer>
          <el-button @click="prevRowInfo(rowIndex)" :disabled="rowIndex === 0">
            {{ $t('workflow.prevRow') }}
          </el-button>
          <el-button type="primary" @click="nextRowInfo(rowIndex)">
            {{ $t('workflow.nextRow') }}
          </el-button>
        </template>
      </el-drawer>
    </div>
    <div v-else-if="mode == 'print'" class="print-table-list">
      <div class="print-table-list-header">
        {{ formItem.title }}
      </div>
      <table>
        <thead>
          <tr>
            <th> 序号 </th>
            <th v-for="(item, index) in _columns" :key="index" class="print-border-left">{{
              item.title
            }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in _value" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td v-for="(item, i) in _columns" :key="i" class="print-border-left">
              {{ data[item.id] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else> {{ _value }} </div>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { deleteComponentValidate, deleteFormComponent, evaluateFormula } from '@/utils/workflow';
  import FormDesignRender from '../../form/form-design-render.vue';
  import { ElMessageBox } from 'element-plus';
  import { computed, PropType, ref } from 'vue';
  import draggable from 'vuedraggable';
  import { useI18n } from 'vue-i18n';
  import { generateUUID, isDef } from '@/utils';
  const workFlowStore = useWorkFlowStore();
  const { t } = useI18n();

  const emits = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<WorkForm.FormDataModel[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
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
  // 显示行数据详情
  const rowVisible = ref<boolean>(false);
  // 行下标
  const rowIndex = ref<number>(0);

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
    // 校验其他组件中是否引用了该组件
    const validateFlag = deleteComponentValidate(
      workFlowStore.design.formItems,
      _columns.value[index].id,
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
        deleteFormComponent(_columns.value, index);
        _selectedItem.value = null;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * @description: 子组件
   * @return {*}
   */
  const _columns = computed({
    get() {
      if (props.formItem.props.readonly) {
        return props.formItem.props.columns.map((col) => {
          col.props.readonly = true;
          return col;
        });
      } else {
        return props.formItem.props.columns;
      }
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
   * @param {*} index 行下标
   * @param {*} position 添加位置
   * @return {*}
   */
  const handleAdd = (index?: number, position?: 'above' | 'below') => {
    console.log(JSON.stringify(_value.value));
    // 使用展开语法来创建对象，提高代码简洁性
    const rowData = _columns.value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    // 给每一行数据添加id
    rowData[`id`] = generateUUID();
    // 检查当前_value的类型，确保它可以被push操作
    if (_value.value == null || !Array.isArray(_value.value)) {
      _value.value = [rowData];
    } else {
      if (isDef(index)) {
        if (position === 'above') {
          _value.value.splice(index, 0, rowData);
        } else {
          _value.value.splice(index + 1, 0, rowData);
        }
      } else {
        _value.value.push(rowData);
      }
    }
  };

  /**
   * @description: 复制一行
   * @param {*} rowData 行数据
   * @param {*} index 行下标
   * @return {*}
   */
  const handleCopy = (rowData: any, index: number) => {
    const data = JSON.parse(JSON.stringify(rowData));
    // 更改id
    data[`id`] = generateUUID();
    // 使用splice()方法插入元素
    _value.value.splice(index + 1, 0, data);
  };

  /**
   * @description: 清空一行
   * @param {*} index 行下标
   * @return {*}
   */
  const handleClear = (index: number) => {
    const rowData = _columns.value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    _value.value[index] = rowData;
  };

  /**
   * @description: 删除一行
   * @param {*} index 行下标
   * @return {*}
   */
  const handleRemove = (index: number) => {
    _value.value.splice(index, 1);
  };

  /**
   * @description: 显示详情
   * @param {*} index
   * @return {*}
   */
  const openRowInfo = (index: number) => {
    rowVisible.value = true;
    rowIndex.value = index;
  };

  /**
   * @description: 关闭详情
   * @return {*}
   */
  const closeRowInfo = () => {
    rowVisible.value = false;
  };

  /**
   * @description: 上一条
   * @param {*} index
   * @return {*}
   */
  const prevRowInfo = (index: number) => {
    if (index == 0) {
      rowIndex.value = index;
    } else {
      rowIndex.value = index - 1;
    }
  };

  /**
   * @description: 下一条
   * @param {*} index
   * @return {*}
   */
  const nextRowInfo = (index: number) => {
    // 若是最后一条，则新增一行
    if (index == _value.value.length - 1) {
      handleAdd();
    }
    rowIndex.value = index + 1;
  };

  // const validate = (callback: Function) => {
  //   // 验证表单数据
  //   let isValid = false;
  //   // 需要每一行都验证必填

  // };

  /**
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      r = evaluateFormula(expression, props.formData);
    }
    return r;
  });

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);

  .table-main {
    background: var(--el-fill-color-blank);
    color: #606266;
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
    padding: 8px 0px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .table-popover {
    padding: 5px 10px;

    i {
      padding-right: 5px;
    }
  }

  ::v-deep(.el-form-item--default) {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
  }

  ::v-deep(.el-table-fixed-column--right .cell) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.el-scrollbar__wrap--hidden-default) {
    scrollbar-width: none;
    min-height: 60px;
  }
  .el-table__row {
    position: relative;
  }
  .hover-text {
    display: none;
    margin-left: 4px;
    color: #333;
  }
  .el-table__row:hover {
    .hover-text {
      display: inline-flex;
    }
  }
</style>
