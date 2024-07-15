<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-28 15:55:37
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\data-scope.vue
 * @Description: 数据范围限定
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="60%"
    title="数据范围限定"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <div class="formula">
      <div class="formula-aside">
        <el-collapse v-model="activeCollapse" accordion style="width: 100%">
          <el-collapse-item name="currentForm" :title="title">
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
          <el-collapse-item name="function" title="函数列表">
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
              suffix-icon="el-icon-search"
              clearable
              size="small"
            />
            <el-scrollbar>
              <el-tree
                ref="treeFunRef"
                node-key="name"
                style="height: 150px"
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
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="formula-main">
        <code-mirror ref="codeMirrorRef" :placeholder="placeholder"></code-mirror>
        <div class="formula-fun" v-if="currentFunction">
          <div class="fun-title">{{ currentFunction.name }}</div>
          <div class="fun-content">
            <div class="fun-example">{{ currentFunction.example }}</div>
            <div class="fun-desc">{{ currentFunction.description }}</div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="onSubmit">{{ $t('button.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue';
  import { isNotEmpty } from '@/utils';
  import {
    analysisFormula,
    formulaValidate,
    formulaItemTree,
    restorationFormula,
  } from '@/utils/workflow';
  import { doc as functionList } from '@/utils/formula/doc';
  import CodeMirror from './code-mirror.vue';
  import { ElMessage } from 'element-plus';

  const emits = defineEmits(['update:label', 'update:formula']);

  const props = defineProps({
    title: {
      type: String,
      default: '数据范围限定',
    },
    formula: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: () => '只显示表达式为true的数据',
    },
  });

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
  // 表单组件
  const formItems = ref<WorkComponent.ComponentConfig[]>([]);
  // 扁平化表单组件
  const flatFormData = ref<WorkComponent.formulaNode[]>([]);

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
  const init = (items: WorkComponent.ComponentConfig[]) => {
    visible.value = true;
    formItems.value = items;
  };

  /**
   * @description: 确定
   * @return {*}
   */
  const onSubmit = () => {
    const editorValue = codeMirrorRef.value.getValue();
    const value = analysisFormula(editorValue, flatFormData.value);
    console.log(editorValue);
    console.log('---公式为：', value);
    // 公式校验,校验通过返回true，校验失败返回错误信息
    const analysisResult = formulaValidate(value);
    console.log('---公式解析结果：', analysisResult);
    if (analysisResult === true) {
      visible.value = false;
      emits('update:label', editorValue);
      emits('update:formula', value);
    } else {
      ElMessage.warning('公式校验失败：' + analysisResult);
    }
  };

  /**
   * @description: 组件树的数据
   * @return {*}
   */
  const treeData = computed(() => {
    let nodes: WorkComponent.formulaNode[] = [];
    formulaItemTree(formItems.value, nodes, false);
    flatFormData.value = nodes;
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
    border-bottom: 1px solid var(--el-border-color-lighter);

    .formula-aside {
      width: 200px;
      overflow: auto;
    }

    .formula-main {
      display: flex;
      flex-direction: column;
      width: calc(100% - 200px);
      border-left: 1px solid var(--el-border-color-lighter);
    }
  }

  .formula-fun {
    border-radius: 6px;
    border: 1px solid #e8e9eb;
    z-index: 9999;
    bottom: 100px;
    left: 250px;
    position: absolute;

    .fun-title {
      background-color: #fafafa;
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      border-radius: 4px 4px 0 0;
      border-bottom: none;
    }
    .fun-content {
      max-width: 500px;
      max-height: 120px;
      overflow: auto;
      font-size: 13px;

      .fun-example {
        margin-top: 5px;
        padding: 5px 15px;
        background-color: #f7f8fa;
        word-break: break-word;
        color: var(--el-color-primary);
      }
      .fun-desc {
        padding: 5px 15px;
        line-height: 1.5;
      }
    }
  }

  ::v-deep(.el-collapse) {
    width: 100%;
    max-height: 360px;
  }
</style>
