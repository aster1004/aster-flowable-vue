<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-27 17:15:13
 * @FilePath: \aster-flowable-vue\src\components\tree\tree-filter.vue
 * @Description: 树形选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card filter">
    <h4 v-if="title" class="title sle">
      {{ title }}
    </h4>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeRef"
        default-expand-all
        :node-key="id"
        :data="multiple ? treeData : treeAllData"
        :show-checkbox="multiple"
        :check-strictly="false"
        :current-node-key="!multiple ? selected : ''"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="multiple ? selected : []"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
      >
        <template #default="scope">
          <span class="el-tree-node__label">
            <slot :row="scope">
              {{ scope.node.label }}
            </slot>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
  import { ref, watch, onBeforeMount, nextTick } from 'vue';
  import { ElTree } from 'element-plus';

  // 接收父组件参数并设置默认值
  interface TreeFilterProps {
    requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
    data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
    title?: string; // treeFilter 标题 ==> 非必传
    id?: string; // 选择的id ==> 非必传，默认为 “id”
    label?: string; // 显示的label ==> 非必传，默认为 “label”
    multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
    defaultValue?: any; // 默认选中的值 ==> 非必传
    showAll?: boolean; // 是否显示全部 ==> 非必传，默认为 true
  }
  const props = withDefaults(defineProps<TreeFilterProps>(), {
    id: 'id',
    label: 'label',
    multiple: false,
    showAll: true,
  });

  const defaultProps = {
    children: 'children',
    label: props.label,
  };

  const treeRef = ref<InstanceType<typeof ElTree>>();
  const treeData = ref<{ [key: string]: any }[]>([]);
  const treeAllData = ref<{ [key: string]: any }[]>([]);

  const selected = ref();
  const setSelected = () => {
    if (props.multiple)
      selected.value = Array.isArray(props.defaultValue)
        ? props.defaultValue
        : [props.defaultValue];
    else selected.value = typeof props.defaultValue === 'string' ? props.defaultValue : '';
  };

  onBeforeMount(async () => {
    setSelected();
    if (props.requestApi) {
      const { data } = await props.requestApi!();
      treeData.value = data;
      treeAllData.value = props.showAll ? [{ id: '', [props.label]: '全部' }, ...data] : [...data];
    }
  });

  // 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
  watch(
    () => props.defaultValue,
    () => nextTick(() => setSelected()),
    { deep: true, immediate: true },
  );

  watch(
    () => props.data,
    () => {
      if (props.data?.length) {
        treeData.value = props.data;
        treeAllData.value = props.showAll
          ? [{ id: '', [props.label]: '全部' }, ...props.data]
          : [...props.data];
      } else {
        treeData.value = [];
        treeAllData.value = [];
      }
    },
    { deep: true, immediate: true },
  );

  const filterText = ref('');
  watch(filterText, (val) => {
    treeRef.value!.filter(val);
  });

  // 过滤
  const filterNode = (value: string, _data: { [key: string]: any }, node: any) => {
    if (!value) return true;
    let parentNode = node.parent,
      labels = [node.label],
      level = 1;
    while (level < node.level) {
      labels = [...labels, parentNode.label];
      parentNode = parentNode.parent;
      level++;
    }
    return labels.some((label) => label.indexOf(value) !== -1);
  };

  // emit
  const emits = defineEmits(['change']);

  // 单选
  const handleNodeClick = (data: { [key: string]: any }) => {
    if (props.multiple) return;
    emits('change', data[props.id]);
  };

  // 多选
  const handleCheckChange = () => {
    if (props.multiple) emits('change', treeRef.value?.getCheckedKeys());
  };

  // 重新加载数据
  const reload = async () => {
    setSelected();
    if (props.requestApi) {
      const { data } = await props.requestApi!();
      treeData.value = data;
      treeAllData.value = props.showAll ? [{ id: '', [props.label]: '全部' }, ...data] : [...data];
    }
  };

  // 暴露给父组件使用
  defineExpose({ treeData, treeAllData, treeRef, reload });
</script>

<style scoped lang="scss">
  .filter {
    box-sizing: border-box;
    width: 220px;
    height: 100%;
    padding: 18px;
    margin-right: 10px;
    .title {
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-info-dark-2);
      letter-spacing: 0.5px;
    }
    .el-input {
      margin: 0 0 15px;
    }
    .el-scrollbar {
      :deep(.el-tree) {
        height: 80%;
        overflow: auto;
        .el-tree-node__content {
          height: 33px;
        }
      }
      :deep(.el-tree--highlight-current) {
        .el-tree-node.is-current > .el-tree-node__content {
          background-color: var(--el-color-primary);
          .el-tree-node__label,
          .el-tree-node__expand-icon {
            color: white;
          }
          .is-leaf {
            color: transparent;
          }
        }
      }
    }
  }
</style>
