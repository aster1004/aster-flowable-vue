<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 15:19:57
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\association-list.vue
 * @Description: 关联列表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="association-container">
    <div class="association-title"> 关联列表 </div>
    <div class="association-main">
      <div style="height: 100%" v-if="associations.length > 0">
        <div class="association-tip">
          说明：当前表单有被其他表单中关联控件关联时，可在此处配置关联列表，实现对其他表单数据的快捷查看与新增
        </div>
        <div class="association-content">
          <el-card class="association-card mr-120px">
            <template #header>
              <div class="font-600 text-sm">
                <span>可选表单</span>
              </div>
            </template>
            <el-scrollbar style="height: 100%">
              <div class="p-10px">
                <el-table
                  ref="tableRef"
                  :data="associations"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" header-align="center" align="center" />
                  <el-table-column prop="label" label="全选" />
                </el-table>
              </div>
            </el-scrollbar>
          </el-card>
          <el-card class="association-card">
            <template #header>
              <div class="font-600 text-sm">
                <span>展示表单</span>
              </div>
            </template>
            <el-scrollbar style="height: 100%">
              <div class="p-10px">
                <draggable
                  :list="_associationList"
                  item-key="value"
                  group="associationList"
                  class="association-list"
                  handler=".association-list-item"
                  :options="{ animation: 300, sort: true }"
                >
                  <template #item="{ element }">
                    <div class="association-list-item">
                      <el-row>
                        <el-col :span="3" class="!flex justify-center items-center">
                          <i class="iconfont icon-tuozhuai !text-lg association-list-icon"></i>
                        </el-col>
                        <el-col :span="18" class="association-list-title">
                          <span>{{ element.label }}</span>
                        </el-col>
                        <el-col :span="3">
                          <i
                            class="iconfont icon-shanchu !text-base association-list-icon"
                            @click="toggleSelection(element)"
                          ></i>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </draggable>
              </div>
            </el-scrollbar>
          </el-card>
        </div>
      </div>
      <div class="association-empty" v-else>
        <el-empty :image-size="80">
          <template #description>
            <div class="association-empty-text">
              <span class="text-sm pb-5px">当前表单暂未被其他表单所关联</span>
              <span class="text-xs pb-5px">请在其他表单的关联控件关联该表单时，再进行设置</span>
            </div>
          </template>
        </el-empty>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { computed, onBeforeMount, ref, watch } from 'vue';
  import draggable from 'vuedraggable';
  import { assocaitionListApi } from '@/api/workflow/assocaition';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const tableRef = ref();
  // 加载进度
  const loading = ref(false);
  // 关联列表
  const associations = ref<WorkComponent.TreeNode[]>([]);

  // 已选中的关联列表
  const _associationList = computed({
    get() {
      if (!workFlowStore.design.settings) {
        workFlowStore.design.settings = {
          associationList: [],
        };
      }
      if (!workFlowStore.design.settings.associationList) {
        workFlowStore.design.settings.associationList = [];
      }
      return workFlowStore.design.settings.associationList;
    },
    set(val) {
      if (workFlowStore.design.settings && val) {
        workFlowStore.design.settings.associationList = val;
      }
    },
  });

  // 处理选中事件
  const handleSelectionChange = (val: WorkComponent.TreeNode[]) => {
    _associationList.value = val;
  };

  // 手动选中/取消
  const toggleSelection = (item: WorkComponent.TreeNode) => {
    const formInfo = associations.value.find((associate) => associate.value === item.value);
    if (formInfo) {
      tableRef.value!.toggleRowSelection(formInfo, undefined);
    }
  };

  // 获取关联列表
  onBeforeMount(async () => {
    if (workFlowStore.design.code && isNotEmpty(workFlowStore.design.code)) {
      await assocaitionListApi(workFlowStore.design.code).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          associations.value = res.data.map((item) => {
            return {
              label: item.label,
              value: item.value,
            };
          });
          loading.value = true;
        }
      });
    } else {
      associations.value = [];
    }
  });

  watch(
    () => tableRef.value,
    (newValues) => {
      if (
        newValues &&
        loading.value &&
        workFlowStore.design.settings &&
        workFlowStore.design.settings.associationList &&
        workFlowStore.design.settings.associationList.length > 0
      ) {
        // 去除依赖性
        const list: WorkComponent.TreeNode[] = JSON.parse(
          JSON.stringify(workFlowStore.design.settings.associationList),
        );
        // 先置空
        _associationList.value = [];
        // 再选中
        list.forEach((item) => {
          toggleSelection(item);
        });
      }
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss">
  .association-container {
    width: 100%;
    height: 100%;

    .association-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      height: 55px;
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--el-border-color);
    }

    .association-main {
      width: 100%;
      height: calc(100% - 55px);
      padding: 10px;

      .association-empty {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &-text {
          display: flex;
          flex-direction: column;
          text-align: center;
          color: var(--el-text-color-secondary);
        }
      }

      .association-tip {
        background-color: var(--el-color-primary-light-9);
        padding: 10px 20px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        height: 38px;
      }

      .association-content {
        position: relative;
        padding-top: 20px;
        height: calc(100% - 40px);
        display: flex;

        .association-card {
          flex: 1;

          ::v-deep(.el-card__header) {
            padding: 10px 10px;
          }
          ::v-deep(.el-card__body) {
            padding: 5px;
            height: calc(100% - 42px);
            overflow: auto;
          }
        }
      }
    }
  }

  .association-list {
    width: 100%;

    .association-list-item {
      padding: 3px 0;
      color: var(--el-text-color-primary);
    }
    .association-list-item:hover {
      background-color: var(--el-fill-color-light);
      outline: 1px dashed var(--el-header-border-color);
    }
    .association-list-icon {
      color: var(--el-color-primary);
    }
    .association-list-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: var(--el-text-color-regular);
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: break-word;
    }
  }
</style>
