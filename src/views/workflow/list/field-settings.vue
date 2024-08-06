<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-03 15:16:58
 * @FilePath: \aster-flowable-vue\src\views\workflow\list\field-settings.vue
 * @Description: 字段设置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="field-container">
    <el-form label-position="top">
      <el-form-item>
        <template #label>
          <div class="flex justify-between items-center">
            <span>查询条件</span>
            <el-popover placement="left-start" trigger="click" :width="240" :show-arrow="false">
              <template #reference>
                <i class="iconfont icon-xinzeng"></i>
              </template>
              <div class="query-popover-title" style="width: 100%">
                <span>查询字段</span>
                <div class="flex justify-center items-center">
                  <span class="pr-10px">全选</span>
                  <el-checkbox
                    v-model="queryCheckAll"
                    :indeterminate="queryIndeterminate"
                    @change="handleQueryCheckAll"
                  ></el-checkbox>
                </div>
              </div>
              <div class="query-popover-content">
                <el-checkbox-group
                  v-model="queryCheckedIds"
                  :style="{
                    height: _formItem.length * 30 + 10 + 'px',
                    overflow: 'auto',
                  }"
                  style="max-height: 500px"
                  @change="handleQueryCheckChange"
                >
                  <div
                    class="query-popover-checkbox"
                    v-for="(item, index) in _formItem"
                    :key="index"
                  >
                    <div class="query-popover-checkbox-title">
                      {{ item.title }}
                    </div>
                    <div class="query-popover-checkbox-o">
                      <el-checkbox :value="item.id" :label="item.id" />
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </el-popover>
          </div>
        </template>
        <draggable
          :list="queryItems"
          item-key=""
          group="listQuery"
          class="field-query"
          handler=".field-query-item"
          :options="{ animation: 300, sort: true }"
        >
          <template #item="{ element }">
            <div class="field-query-item">
              <el-row>
                <el-col :span="3" class="flex justify-center items-center">
                  <i class="iconfont icon-tuozhuai !text-lg field-query-icon"></i>
                </el-col>
                <el-col :span="17">
                  <span>{{ element.title }}</span>
                </el-col>
                <el-col :span="4">
                  <i
                    class="iconfont icon-shanchu field-query-icon"
                    @click="handleQueryRemove(element.id)"
                  ></i>
                </el-col>
              </el-row>
            </div>
          </template>
        </draggable>
      </el-form-item>
      <el-form-item>
        <template #label>
          <div class="flex justify-between items-center">
            <span>列表字段</span>
            <div class="flex justify-center items-center font-normal">
              <span class="pr-10px">全选</span>
              <el-checkbox
                v-model="columnCheckAll"
                :indeterminate="columnIndeterminate"
                @change="handleColumnCheckAll"
              ></el-checkbox>
            </div>
          </div>
        </template>
        <el-checkbox-group v-model="columnCheckedIds" style="width: 100%">
          <draggable
            :list="columnsItems"
            item-key=""
            group="listField"
            class="field-list"
            handler=".field-list-item"
            :options="{ animation: 300, sort: true }"
          >
            <template #item="{ element }">
              <div class="field-list-item">
                <el-row>
                  <el-col :span="3" class="flex justify-center items-center">
                    <i class="iconfont icon-tuozhuai !text-lg field-list-icon"></i>
                  </el-col>
                  <el-col :span="17" class="field-list-title">
                    <span>{{ element.title }}</span>
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox :value="element.id" :label="element.id" />
                  </el-col>
                </el-row>
              </div>
            </template>
          </draggable>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { flatFormItemsExclude } from '@/utils/workflow';
  import draggable from 'vuedraggable';
  import { defaultComponentConfig } from '../components/component-config-export';
  import { isNotEmpty } from '@/utils';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 查询字段全选
  const queryCheckAll = ref(false);
  // 查询字段全选状态
  const queryIndeterminate = ref(false);
  // 已选中查询字段id
  const queryCheckedIds = ref<string[]>([]);
  // 已选中的查询表单项
  const queryItems = ref<WorkComponent.ComponentConfig[]>(
    workFlowStore.design.listSettings.queryItems,
  );

  // 列表字段全选
  const columnCheckAll = ref(false);
  // 列表字段全选状态
  const columnIndeterminate = ref(false);
  // 已选中的列表字段id
  const columnCheckedIds = ref<string[]>(
    workFlowStore.design.listSettings.columns.length > 0
      ? workFlowStore.design.listSettings.columns.map((item) => item.id)
      : [],
  );
  // 已选中的列表表单项
  const columns = ref<WorkComponent.ComponentConfig[]>(workFlowStore.design.listSettings.columns);
  // 全部列表字段
  const columnsItems = ref<WorkComponent.ComponentConfig[]>([]);

  /**
   * @description: 初始化列表字段,并根据已排序列字段进行排序
   * @param {*} items
   * @return {*}
   */
  const initColumnItemsSort = (items: WorkComponent.ComponentConfig[]) => {
    if (columnCheckedIds.value && columnCheckedIds.value.length > 0) {
      // 创建映射关系
      const orderMap: Map<string, number> = new Map(
        columnCheckedIds.value.map((val, idx) => [val, idx]),
      );
      // 根据子数组的顺序对父数组进行排序
      const sortedA2 = items.sort((a, b) => {
        let indexA = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
        let indexB = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
        indexA = indexA === undefined ? Infinity : indexA;
        indexB = indexB === undefined ? Infinity : indexB;
        return indexA - indexB;
      });
      columnsItems.value = sortedA2;
    } else {
      columnsItems.value = items;
    }
  };

  // 表单项扁平化，排除不需要的控件
  const _formItem = computed(() => {
    let items = flatFormItemsExclude(workFlowStore.design.formItems);
    items = [...defaultComponentConfig, ...items];
    // 初始化列表字段,并根据已排序列字段进行排序
    initColumnItemsSort(JSON.parse(JSON.stringify(items)));
    return items;
  });

  /**
   * @description: 查询字段全选
   * @return {*}
   */
  const handleQueryCheckAll = (val: boolean) => {
    if (val) {
      // 避免queryItems的变动影响_formItem
      queryItems.value = JSON.parse(JSON.stringify(_formItem.value));
      queryCheckedIds.value = queryItems.value.map((item) => item.id);
    } else {
      queryItems.value = [];
      queryCheckedIds.value = [];
    }
  };

  /**
   * @description: 查询字段选中操作
   * @param {*} value 已选中的表单项id
   * @return {*}
   */
  const handleQueryCheckChange = (value: string[]) => {
    const checkedCount = value.length;
    queryCheckAll.value = checkedCount === _formItem.value.length;
    queryIndeterminate.value = checkedCount > 0 && checkedCount < _formItem.value.length;

    queryItems.value = [];
    // 双重循环是为了保护已经排序的字段不受影响
    queryCheckedIds.value.forEach((id) => {
      _formItem.value.forEach((item) => {
        if (item.id == id) {
          queryItems.value.push(item);
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
    queryItems.value = queryItems.value.filter((item) => item.id != id);
  };

  /**
   * @description: 列表字段全选
   * @param {*} val 全选/反选
   * @return {*}
   */
  const handleColumnCheckAll = (val: boolean) => {
    if (val) {
      // 避免columns的变动影响_formItem
      columns.value = columnsItems.value;
      columnCheckedIds.value = columns.value.map((item) => item.id);
    } else {
      columns.value = [];
      columnCheckedIds.value = [];
    }
  };

  // 监听查询字段和列表字段
  watchEffect(() => {
    // 查询字段过滤
    if (isNotEmpty(queryItems.value)) {
      queryItems.value = queryItems.value.filter((query) => {
        return _formItem.value.some((item) => item.id == query.id);
      });
    }
    // 将排序好的查询字段同步给选中的id
    queryCheckedIds.value = queryItems.value.map((item) => item.id);
    // 查询选中状态
    const checkedCount = queryItems.value.length;
    queryCheckAll.value = checkedCount === _formItem.value.length;
    queryIndeterminate.value = checkedCount > 0 && checkedCount < _formItem.value.length;
    // 列表选中状态
    const columnCheckedCount = columns.value.length;
    columnCheckAll.value = columnCheckedCount === columnsItems.value.length;
    columnIndeterminate.value =
      columnCheckedCount > 0 && columnCheckedCount < columnsItems.value.length;

    // 双重循环是为了保护已经排序的字段不受影响
    columns.value = [];
    columnsItems.value.forEach((item) => {
      columnCheckedIds.value.forEach((id) => {
        if (item.id == id) {
          columns.value.push(item);
        }
      });
    });

    // 将查询字段和列表字段同步给store
    workFlowStore.design.listSettings.queryItems = queryItems.value;
    workFlowStore.design.listSettings.columns = columns.value;
  });
</script>
<style scoped lang="scss">
  .field-container {
    padding: 5px 15px;
  }

  .field-query {
    width: 100%;

    .field-query-item {
      padding-bottom: 3px;
      color: var(--el-text-color-primary);
    }
    .field-query-item:hover {
      background-color: #f4f7ff;
      border-left: 5px solid var(--el-color-primary);
    }
    .field-query-icon {
      color: var(--el-color-primary);
    }
  }

  ::v-deep(.el-form-item__label) {
    font-weight: 600;
  }

  .query-popover-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  .query-popover-content {
    .query-popover-checkbox {
      height: 30px;
      line-height: 30px;
      display: flex;
      cursor: pointer;
      padding-left: 10px;
      box-sizing: border-box;
      border-radius: 2px;
    }

    .query-popover-checkbox-title {
      flex: 1;
      color: #303133;
      text-align: left;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: break-word;
    }

    .query-popover-checkbox-o {
      width: 30px;
      text-align: center;
    }

    .query-popover-checkbox:hover {
      background-color: var(--el-color-primary);
    }

    .query-popover-checkbox:hover .query-popover-checkbox-title {
      color: #ffffff;
    }

    ::v-deep(.el-checkbox__label) {
      display: none;
    }
  }

  .field-list {
    width: 100%;

    .field-list-item {
      padding-bottom: 3px;
      color: var(--el-text-color-primary);
    }
    .field-list-item:hover {
      background-color: #f4f7ff;
      border-left: 5px solid var(--el-color-primary);
    }
    .field-list-icon {
      color: var(--el-color-primary);
    }
    .field-list-title {
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

    ::v-deep(.el-checkbox__label) {
      display: none;
    }
  }
</style>
