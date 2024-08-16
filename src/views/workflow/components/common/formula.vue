<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-28 15:55:37
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\formula.vue
 * @Description: 计算公式
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="60%"
    style="min-width: 720px"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <div class="formula">
      <div class="formula-aside">
        <el-collapse v-model="activeCollapse" accordion style="width: 100%">
          <el-collapse-item name="currentForm" title="当前表单">
            <el-tree
              ref="currentFormRef"
              node-key="fieldId"
              :data="treeData"
              :expand-on-click-node="false"
              :highlight-current="true"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="formula-main">
        <div class="formula-title" v-if="isNotEmpty(headerTitle)">
          {{ headerTitle }}
        </div>
        <code-mirror ref="codeMirrorRef" :placeholder="placeholder"></code-mirror>
        <div class="formula-btn">
          <el-button type="primary" size="small" plain @click="functionVisible = !functionVisible">
            插入函数
          </el-button>
        </div>
        <div class="formula-fun">
          <template v-if="currentFunction">
            <div class="fun-example">{{ currentFunction.example }}</div>
            <div class="fun-desc">{{ currentFunction.description }}</div>
          </template>
          <template v-else>
            <ul class="fun-tips">
              <li> 请从左侧面板选择字段或选项 </li>
              <li> 支持英文模式下运算符(+、-、*、/、&gt、&lt、==、!=、&lt=、&gt=)及函数 </li>
              <li>
                参考场景: <br />
                根据输入的数量和单价,自动计算出金额,则可将计算公式设置为:数量*单价
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <div class="el-dialog function-content" v-if="functionVisible">
      <el-input v-model="filterText" placeholder="输入关键字过滤" clearable class="p-10px" />
      <el-scrollbar class="pb-10px" style="height: calc(100% - 55px)">
        <el-tree
          ref="treeFunRef"
          node-key="name"
          style="min-height: 400px"
          :default-expanded-keys="['逻辑函数']"
          :data="functionList"
          :props="{ children: 'children', label: 'name' }"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="handleNodeClick($event, 'fun')"
        >
          <template #default="{ node, data }">
            <span style="width: 100%" @mouseover="mouseover(data)" @mouseleave="mouseleave">
              {{ node.label }}
            </span>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button type="primary" @click="onSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, PropType, ref, watchEffect } from 'vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { isDef, isNotEmpty } from '@/utils';
  import {
    analysisFormula,
    formulaValidate,
    restorationFormula,
    flatFormItemsExclude,
    isConvertItemValue,
    loopCallValidate,
    formulaItemTree,
  } from '@/utils/workflow';
  import { doc as functionList } from '@/utils/formula/doc';
  import CodeMirror from './code-mirror.vue';
  import { ElMessage } from 'element-plus';

  const emits = defineEmits<{
    'update:formula': [value: string];
  }>();

  const props = defineProps({
    title: {
      type: String,
      default: () => '计算公式',
    },
    type: {
      // 类型：赋值 | 条件
      type: String as PropType<'assignment' | 'condition'>,
      default: () => 'condition',
    },
    formula: {
      type: String,
      default: () => '',
    },
    headerTitle: {
      type: String,
      default: () => '',
    },
    placeholder: {
      type: String,
      required: false,
      default: () => '例：数量 * 单价',
    },
  });

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const codeMirrorRef = ref();
  const treeFunRef = ref();
  // 是否显示
  const visible = ref(false);
  // 激活折叠
  const activeCollapse = ref('currentForm');
  // 当前函数
  const currentFunction: any = ref();
  // 过滤条件
  const filterText = ref('');
  // 扁平化表单组件
  const flatFormData = ref<WorkComponent.formulaNode[]>([]);
  // 显示函数
  const functionVisible = ref(false);

  /**
   * @description: 过滤函数
   * @param {string} value
   * @param {any} data
   * @return {*}
   */
  const filterNode = (value: string, data: any) => {
    if (!value) return true;
    return data.name.indexOf(value.toUpperCase()) !== -1;
  };

  /**
   * @description: 鼠标移入和移除树节点时触发
   * @param {any} data
   * @return {*}
   */
  const mouseover = (data) => {
    // 移入,排除第一级节点
    if (!data.disabled && data.disabled !== true) {
      currentFunction.value = data;
    }
  };

  /**
   * @description: 鼠标移出树节点时触发
   * @param {any} data
   * @return {*}
   */
  const mouseleave = () => {
    currentFunction.value = null;
  };

  /**
   * @description 插入内容
   * @param value 值
   * @param type 类型
   */
  const insertContent = (value, type) => {
    const from = codeMirrorRef.value.getCursor();
    if (type === 'variable') {
      codeMirrorRef.value.replaceSelection(value);
      const to = codeMirrorRef.value.getCursor();
      codeMirrorRef.value.markText(from, to, value, type);
    } else if (type === 'func') {
      codeMirrorRef.value.replaceSelection(`${value}()`);
      const to = codeMirrorRef.value.getCursor();
      codeMirrorRef.value.markText(from, to, value, type);
    } else if (typeof value === 'string') {
      codeMirrorRef.value.replaceSelection(value);
      const to = codeMirrorRef.value.getCursor();
      codeMirrorRef.value.setCursor(to); //光标位置
    }
    codeMirrorRef.value.focus();
  };

  /**
   * @description: 节点点击
   */
  const handleNodeClick = (data, type) => {
    console.log('---节点点击：', data, type);
    if (type === 'fun') {
      // 如果是函数树，则判断一下第一级节点不可点击
      if (!data.disabled && data.disabled !== true) {
        insertContent(data.name, 'func');
      }
    } else {
      // 设置【明细表.明细表】的节点不可点击
      if (!data.disabled) {
        insertContent(data.label, 'variable');
      }
    }
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = () => {
    visible.value = true;
  };

  /**
   * @description: 确定
   * @return {*}
   */
  const onSubmit = () => {
    const editorValue = codeMirrorRef.value.getValue();
    const value = analysisFormula(editorValue, flatFormData.value);
    console.log('---公式为：', value);
    // 公式校验,校验通过返回true，校验失败返回错误信息
    const analysisResult = formulaValidate(value);
    console.log('---公式解析结果：', analysisResult);
    if (analysisResult === true) {
      // 校验控件是否循环调用
      const validate =
        selectFormItem.value &&
        loopCallValidate(value, selectFormItem.value.id, workFlowStore.design.formItems);
      if (!validate) {
        return;
      }
      visible.value = false;
      emits('update:formula', value);
    } else {
      ElMessage.warning('公式校验失败：' + analysisResult);
    }
  };

  /**
   * @description: 表单组件
   * @return {*}
   */
  const _formItems = computed(() => {
    return workFlowStore.design.formItems;
  });

  /**
   * @description: 选中的组件
   * @return {*}
   */
  const selectFormItem = computed(() => {
    return workFlowStore.selectFormItem;
  });

  /**
   * @description: 明细表内的组件id
   * @return {*}
   */
  const tableColumnIds = computed(() => {
    let columnIds: string[] = [];
    _formItems.value.forEach((item) => {
      if (item.name === 'TableList') {
        item.props.columns.forEach((col) => {
          columnIds.push(col.id);
        });
      }
    });
    return columnIds;
  });

  /**
   * @description: 扁平化节点
   * @param {WorkComponent.formulaNode[]} nodes
   * @return {*}
   */
  const flatNodes = (nodes: WorkComponent.formulaNode[]) => {
    let result: WorkComponent.formulaNode[] = [];
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        result = result.concat(flatNodes(node.children));
      } else {
        result.push(node);
      }
    });
    return result;
  };

  /**
   * @description: 组件树的数据
   * @return {*}
   */
  const treeData = computed(() => {
    let nodes: WorkComponent.formulaNode[] = [];
    if (props.type === 'assignment') {
      // 表单项扁平化
      const flatItems = flatFormItemsExclude(_formItems.value);
      flatItems
        .filter((item) => {
          // 先排除自身组件
          return selectFormItem.value && item.id != selectFormItem.value.id;
        })
        .filter((item) => {
          // 排除值类型无法转换的组件
          return selectFormItem.value && isConvertItemValue(item, selectFormItem.value);
        })
        .forEach((item) => {
          nodes.push({
            fieldId: item.id,
            label: item.title,
            value: item.id,
          });
        });
      flatFormData.value = nodes;
    } else {
      let isTableList = false;
      if (selectFormItem.value) {
        // 如果是汇总计算，则显示明细表变量
        if (selectFormItem.value.name && selectFormItem.value.name === 'SummaryFormula') {
          isTableList = true;
        } else {
          isTableList =
            isDef(selectFormItem.value.id) &&
            tableColumnIds.value.indexOf(selectFormItem.value.id) != -1;
        }
      }
      // 获取表单组件的公式树
      formulaItemTree(_formItems.value, nodes, isTableList);
      flatFormData.value = isTableList ? flatNodes(nodes) : nodes;
      // 排除自身组件，防止循环引用
      nodes = nodes.filter((node) => {
        return selectFormItem.value && node.fieldId !== selectFormItem.value.id;
      });
    }
    return nodes;
  });

  watchEffect(() => {
    if (treeFunRef.value) {
      treeFunRef.value.filter(filterText.value);
    }
  });

  watchEffect(() => {
    if (codeMirrorRef.value && isNotEmpty(props.formula)) {
      const label = restorationFormula(props.formula, flatFormData.value);
      codeMirrorRef.value.setValue(label);
    }
  });

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .formula {
    display: flex;
    flex-direction: row;
    height: 360px;
    border: 1px solid var(--el-border-color-lighter);

    .formula-aside {
      width: 200px;
    }

    .formula-main {
      display: flex;
      flex-direction: column;
      width: calc(100% - 200px);
      border-left: 1px solid var(--el-border-color-lighter);
    }
  }

  .formula-title {
    padding: 5px;
    color: var(--el-text-color-regular);
    background: var(--el-color-primary-light-9);
  }

  .formula-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .formula-fun {
    border-top: 1px solid var(--el-border-color-lighter);
    height: 120px;

    ul.fun-tips {
      list-style-type: disc;
      padding: 20px 25px;
      height: 120px;
      font-size: 13px;
    }

    .fun-example {
      height: 30px;
      padding: 5px 15px;
      background-color: var(--el-fill-color-light);
      word-break: break-word;
      color: var(--el-color-primary);
    }

    .fun-desc {
      height: 90px;
      padding: 5px 15px;
      line-height: 1.5;
      font-size: 13px;
      overflow: auto;
    }
  }

  .function-content {
    width: 170px;
    position: absolute;
    bottom: -50px;
    right: -172px;
    height: 100%;
  }

  ::v-deep(.el-collapse) {
    width: 100%;
    max-height: 360px;
    border-bottom: none;
    border-top: none;
  }

  ::v-deep(.el-collapse-item__header) {
    padding-left: 15px;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  ::v-deep(.el-collapse-item__content) {
    overflow-y: auto;
    // height: 215px;
    height: 310px;
  }

  /* 定义滚动条宽度和背景颜色 */
  ::v-deep(.el-collapse-item__content::-webkit-scrollbar) {
    width: 6px; /* 对于水平滚动条的高度 */
    height: 6px; /* 对于垂直滚动条的宽度 */
    background-color: #f9f9f9;
  }
  /* 定义滚动条滑块的样式 */
  ::v-deep(.el-collapse-item__content::-webkit-scrollbar-thumb) {
    border-radius: 4px;
    background-color: #dddee0;
  }

  /* 定义滚动条滑块hover样式 */
  ::v-deep(.el-collapse-item__content::-webkit-scrollbar-thumb:hover) {
    background-color: #c7c9cc;
  }

  /* 定义滚动条轨道的样式 */
  ::v-deep(.el-collapse-item__content::-webkit-scrollbar-track) {
    background-color: #ffffff;
  }

  ::v-deep(.el-collapse-item__content::-webkit-scrollbar-button) {
    display: none; /* 通常情况下不显示滚动条按钮 */
  }
</style>
