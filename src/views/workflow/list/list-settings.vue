<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-03 15:19:20
 * @FilePath: \aster-flowable-vue\src\views\workflow\list\list-settings.vue
 * @Description: 列表设置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="list-container">
    <el-form label-position="top">
      <el-form-item label="排序字段">
        <el-select v-model="sortBy" placeholder="请选择">
          <el-option
            v-for="(item, index) in _formItem"
            :key="index"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序方式">
        <el-select v-model="sortDirection" placeholder="请选择">
          <el-option
            v-for="(item, index) in sortDirections"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="flex justify-between items-center">
            <span>功能按钮</span>
            <el-popover placement="left-start" trigger="click" :width="240" :show-arrow="false">
              <template #reference>
                <i class="iconfont icon-xinzeng"></i>
              </template>
              <div class="function-popover-title" style="width: 100%">
                <span>查询字段</span>
                <div class="flex justify-center items-center">
                  <span class="pr-10px">全选</span>
                  <el-checkbox
                    v-model="functionCheckAll"
                    :indeterminate="functionIndeterminate"
                    @change="handleFunctionCheckAll"
                  ></el-checkbox>
                </div>
              </div>
              <div class="function-popover-content">
                <el-checkbox-group
                  v-model="functionCheckedIds"
                  :style="{
                    height: functionButtons.length * 30 + 10 + 'px',
                    overflow: 'auto',
                  }"
                  style="max-height: 500px"
                  @change="handleFunctionCheckChange"
                >
                  <div
                    class="function-popover-checkbox"
                    v-for="(item, index) in functionButtons"
                    :key="index"
                  >
                    <div class="function-popover-checkbox-title">
                      {{ item.title }}
                    </div>
                    <div class="function-popover-checkbox-o">
                      <el-checkbox :value="item.id" :label="item.id" />
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </el-popover>
          </div>
        </template>
        <draggable
          :list="actions"
          item-key=""
          group="functionButton"
          class="function-button"
          handler=".function-button-item"
          :options="{ animation: 300, sort: true }"
        >
          <template #item="{ element }">
            <div class="function-button-item">
              <el-row>
                <el-col :span="3" class="flex justify-center items-center">
                  <i :class="['!text-lg function-button-icon', element.icon]"></i>
                </el-col>
                <el-col :span="17" class="function-button-title">
                  <span>{{ element.title }}</span>
                </el-col>
                <el-col :span="4">
                  <i
                    class="iconfont icon-shanchu function-button-icon"
                    @click="handleQueryRemove(element.id)"
                  ></i>
                </el-col>
              </el-row>
            </div>
          </template>
        </draggable>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { flatFormItemsExclude } from '@/utils/workflow';
  import { computed, ref, watch, watchEffect } from 'vue';
  import { defaultComponentConfig } from '../components/component-config-export';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import draggable from 'vuedraggable';

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 排序字段
  const sortBy = ref<string>(
    workFlowStore.design.listSettings.sortBy ? workFlowStore.design.listSettings.sortBy : '',
  );
  // 排序方式
  const sortDirection = ref<string>(
    workFlowStore.design.listSettings.sortDirection
      ? workFlowStore.design.listSettings.sortDirection
      : '',
  );
  // 所有的排序方式
  const sortDirections = ref([
    { label: '升序', value: 'asc' },
    { label: '降序', value: 'desc' },
  ]);

  // 所有的功能按钮
  const functionButtons = ref<WorkForm.FunctionButton[]>([
    { id: '1', title: '刷新', icon: 'iconfont icon-shuaxin', click: 'handleQuery' },
    { id: '2', title: '筛选', icon: 'iconfont icon-sousuo', click: 'handleShowQuery' },
    { id: '3', title: '导入', icon: 'iconfont icon-shangchuan', click: 'handleImport' },
    { id: '4', title: '导出', icon: 'iconfont icon-xiazai', click: 'handleExport' },
    { id: '5', title: '显示', icon: 'iconfont icon-shuaxin', click: 'handleShowColumns' },
  ]);
  // 功能按钮
  const actions = ref(
    workFlowStore.design.listSettings.actions &&
      workFlowStore.design.listSettings.actions.length > 0
      ? workFlowStore.design.listSettings.actions
      : JSON.parse(JSON.stringify(functionButtons.value)),
  );
  // 功能按钮全选
  const functionCheckAll = ref(false);
  // 功能按钮全选状态
  const functionIndeterminate = ref(false);
  // 已选中功能按钮的title
  const functionCheckedIds = ref<string[]>([]);

  /**
   * @description: 查询字段全选
   * @return {*}
   */
  const handleFunctionCheckAll = (val: boolean) => {
    if (val) {
      // 避免queryItems的变动影响_formItem
      actions.value = JSON.parse(JSON.stringify(functionButtons.value));
      functionCheckedIds.value = actions.value.map((item) => item.id);
    } else {
      actions.value = [];
      functionCheckedIds.value = [];
    }
  };

  /**
   * @description: 查询字段选中操作
   * @param {*} value 已选中的表单项id
   * @return {*}
   */
  const handleFunctionCheckChange = (value: string[]) => {
    const checkedCount = value.length;
    functionCheckAll.value = checkedCount === functionButtons.value.length;
    functionIndeterminate.value = checkedCount > 0 && checkedCount < functionButtons.value.length;

    actions.value = [];
    // 双重循环是为了保护已经排序的字段不受影响
    functionCheckedIds.value.forEach((id) => {
      functionButtons.value.forEach((item) => {
        if (item.id == id) {
          actions.value.push(item);
        }
      });
    });
  };

  /**
   * @description: 查询字段移除操作
   * @param {*} id
   * @return {*}
   */
  const handleQueryRemove = (id: string) => {
    actions.value = actions.value.filter((item) => item.id != id);
  };

  // 表单项扁平化，排除不需要的控件
  const _formItem = computed(() => {
    let items = flatFormItemsExclude(workFlowStore.design.formItems);
    items = [...defaultComponentConfig, ...items];
    return items;
  });

  // 监听数据
  watchEffect(() => {
    // 将排序好的查询字段同步给选中的id
    functionCheckedIds.value = actions.value.map((item) => item.id);
    // 查询选中状态
    const checkedCount = actions.value.length;
    functionCheckAll.value = checkedCount === functionButtons.value.length;
    functionIndeterminate.value = checkedCount > 0 && checkedCount < functionButtons.value.length;
    // 将排序字段、排序方式同步给store
    workFlowStore.design.listSettings.sortBy = sortBy.value;
    workFlowStore.design.listSettings.sortDirection = sortDirection.value;
  });

  // 监听数据
  watch(
    () => actions.value,
    (val) => {
      // 将功能按钮同步给store
      if (workFlowStore.design.listSettings.actions != undefined) {
        workFlowStore.design.listSettings.actions = val;
      }
      console.log(workFlowStore.design.listSettings.actions);
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss">
  .list-container {
    padding: 5px 15px;

    ::v-deep(.el-form-item__label) {
      font-weight: 600;
    }
  }

  .function-popover-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  .function-popover-content {
    .function-popover-checkbox {
      height: 30px;
      line-height: 30px;
      display: flex;
      cursor: pointer;
      padding-left: 10px;
      box-sizing: border-box;
      border-radius: 2px;
    }

    .function-popover-checkbox-title {
      flex: 1;
      color: #303133;
      text-align: left;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: break-word;
    }

    .function-popover-checkbox-o {
      width: 30px;
      text-align: center;
    }

    .function-popover-checkbox:hover {
      background-color: var(--el-color-primary);
    }

    .function-popover-checkbox:hover .function-popover-checkbox-title {
      color: #ffffff;
    }

    ::v-deep(.el-checkbox__label) {
      display: none;
    }
  }

  .function-button {
    width: 100%;

    .function-button-item {
      padding-bottom: 3px;
      color: var(--el-text-color-primary);
    }
    .function-button-item:hover {
      background-color: #f4f7ff;
      border-left: 5px solid var(--el-color-primary);
    }
    .function-button-icon {
      color: var(--el-color-primary);
    }
    .function-button-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #303133;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: break-word;
    }
  }
</style>
