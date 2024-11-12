<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-10-12 14:59:55
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\flow\render-flow.vue
 * @Description: 流程图渲染
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="flow-container" @drop="onDrop">
    <VueFlow
      :nodes-draggable="false"
      :delete-key-code="false"
      :nodes="nodes"
      :edges="edges"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      :style="{
        width: '100%',
        height: '100%',
        backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
        transition: 'background-color 0.2s ease',
      }"
    >
      <template #node-start-node="props">
        <StartNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-approve-node="props">
        <ApproveNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-cc-node="props">
        <CCNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-sub-node="props">
        <SubNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-gateway-node="props">
        <GatewayNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-gateway-end-node="props">
        <GatewayEndNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-condition-node="props">
        <ConditionNode @click="handleClickNode" :data="props" />
      </template>
      <template #node-end-node>
        <EndNode @click="handleClickNode" />
      </template>

      <Background />
      <!-- <Controls /> -->
      <MiniMap />
    </VueFlow>

    <!-- <el-drawer v-model="drawer" title="节点信息">
      <span>Hi, there!</span>
    </el-drawer> -->
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { VueFlow, useVueFlow } from '@vue-flow/core';
  import { Background } from '@vue-flow/background';
  import { Controls } from '@vue-flow/controls';
  import { MiniMap } from '@vue-flow/minimap';
  import StartNode from './start-node.vue';
  import ApproveNode from './approve-node.vue';
  import CCNode from './cc-node.vue';
  import SubNode from './sub-node.vue';
  import EndNode from './end-node.vue';
  import GatewayNode from './gateway-node.vue';
  import GatewayEndNode from './gateway-end-node.vue';
  import ConditionNode from './condition-node.vue';
  import { MarkerType } from '@vue-flow/core';
  import useDragAndDrop from '@/utils/useDnD.js';
  import { conditionStr } from '@/utils/ConditionCompare';
  import { isNotEmpty } from '@/utils';
  import { DEFAULT_PRIMARY } from '@/config';
  import { ProcessNodeTypeEnum } from '@/enums/workFlowEnum';

  const { onConnect, addEdges } = useVueFlow();
  const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();
  onConnect(addEdges);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
    activeNodeId: {
      type: Array,
      default: () => [],
    },
  });

  const drawer = ref(false);
  const nodes = ref([]);
  const edges = ref([]);

  onMounted(() => {
    // console.log('props.data', props.data);
    if (isNotEmpty(props.data)) {
      renderFlow();
    }
  });

  /**
   * 点击节点
   */
  const handleClickNode = () => {
    // drawer.value = true;
  };

  // 渲染流程图
  const renderFlow = () => {
    // 递归渲染流程图
    rv(props.data);
    // 获取第一个节点用于获取x轴坐标
    let firstNode = nodes.value[0];
    // 获取最后一个节点用于获取y轴坐标
    let lastNode = nodes.value[nodes.value.length - 1];
    // 放入结束节点
    nodes.value.push({
      id: 'end',
      parentId: lastNode.id,
      type: 'end-node',
      position: { x: firstNode.position.x + 75, y: lastNode.position.y + 150 },
      data: { label: '结束' },
    });
    // 放入连线
    edges.value.push({
      id: lastNode.id + '-' + 'end',
      source: lastNode.id,
      target: 'end',
      label: '',
      type: 'step',
      style: { stroke: getColor(false) },
      animated: false,
      labelBgStyle: { fill: 'orange' },
      markerEnd: MarkerType.ArrowClosed,
      sourceHandle: 'c',
    });
  };

  /**
   * 递归渲染流程图
   * @param {*} node
   * @param {*} xlen
   * @param {*} xindex
   */
  const rv = (node, xlen, xindex) => {
    let currentFlag = props.activeNodeId.indexOf(node.id) != -1;
    // console.info('当前节点：' + node.nodeName, currentFlag);
    // 发起人
    if (node.type == ProcessNodeTypeEnum.ROOT) {
      nodes.value.push({
        id: node.id,
        parentId: 'root',
        type: 'start-node',
        position: { x: 250, y: 5 },
        data: { label: node.nodeName, nodeUser: node.nodeUser, current: currentFlag },
      });
      // console.log(node.nodeName);
      rv(node.childNode);
    } else if (
      node.type == ProcessNodeTypeEnum.APPROVE ||
      node.type == ProcessNodeTypeEnum.SEND ||
      node.type == ProcessNodeTypeEnum.SUBPROCESS
    ) {
      // 审核人
      edges.value.push({
        id: node.parentId + '-' + node.id,
        source: node.parentId,
        target: node.id,
        label: '',
        type: 'step',
        style: { stroke: getColor(currentFlag) },
        animated: currentFlag,
        labelBgStyle: { fill: 'orange' },
        markerEnd: MarkerType.ArrowClosed,
        sourceHandle: 'c',
      });
      // 审核人
      let position = getParentNodeCoordinate(node);
      nodes.value.push({
        id: node.id,
        parentId: node.parentId,
        type: getNodeType(node.type),
        position: { x: position.x, y: position.y + 150 },
        data: { label: node.nodeName, nodeUserList: node.nodeUserList, current: currentFlag },
      });
      // console.log(node.nodeName);
      // 判断子节点不为空
      if (node.childNode && node.childNode != null) {
        rv(node.childNode);
      }
    } else if (node.type == ProcessNodeTypeEnum.CONDITION) {
      // 条件
      // console.log("条件：" + xindex, JSON.stringify(node));
      let position = getParentNodeCoordinate(node);
      // console.log("条件--->", position);
      // 你得先确定最长的一行有几个节点
      // 如果是单数
      // 中间值
      if (xlen % 2 == 1) {
        let median = Math.floor((xlen - 1) / 2);
        if (xindex < median) {
          xlen = 250 - 250 * (median - xindex);
        } else if (xindex == median) {
          xlen = 250;
        } else {
          xlen = 250 + 250 * (xindex - median);
        }
      } else {
        // 如果是双数
        let median = Math.floor(xlen / 2);
        if (xindex < median) {
          xlen = 250 - 200 * (median - xindex);
        } else {
          xlen = 250 + 200 * (xindex - median + 1);
        }
      }

      nodes.value.push({
        id: node.id,
        parentId: node.parentId,
        type: 'condition-node',
        position: { x: xlen, y: position.y + 150 },
        data: { label: node.nodeName, conditionStr: node.conditionStr, current: currentFlag },
      });

      edges.value.push({
        id: node.parentId + '-' + node.id,
        source: node.parentId,
        target: node.id,
        label: '',
        type: 'step',
        style: { stroke: getColor(currentFlag) },
        animated: currentFlag,
        labelBgStyle: { fill: 'orange' },
        markerEnd: MarkerType.ArrowClosed,
        sourceHandle: 'c',
      });
      // 如果子节点不为空就继续渲染
      if (node.childNode && node.childNode != null) {
        rv(node.childNode);
      }
    } else if (node.type == ProcessNodeTypeEnum.GATEWAY) {
      // 网关
      // 如果是网关
      let position = getParentNodeCoordinate(node);
      nodes.value.push({
        id: node.id,
        parentId: node.parentId,
        type: 'gateway-node',
        conditionNodes: node.conditionNodes,
        position: { x: position.x + 50, y: position.y + 150 },
        data: { label: node.nodeName, current: currentFlag },
      });

      edges.value.push({
        id: node.parentId + '-' + node.id,
        source: node.parentId,
        target: node.id,
        label: '',
        type: 'step',
        style: { stroke: getColor(currentFlag) },
        animated: currentFlag,
        labelBgStyle: { fill: 'orange' },
        markerEnd: MarkerType.ArrowClosed,
        sourceHandle: 'c',
      });

      // 如果条件节点不为空就循环渲染
      if (node.conditionNodes && node.conditionNodes != null && node.conditionNodes.length > 0) {
        node.conditionNodes.forEach((conditionNode, index) => {
          // 获取条件表达式名称
          let str = conditionStr(node, index);
          conditionNode['conditionStr'] = str;
          rv(conditionNode, node.conditionNodes.length, index);
        });
      }
      // 渲染子节点
      rv(node.childNode);
    } else if (node.type == ProcessNodeTypeEnum.EMPTY) {
      // 排他网关聚合
      let parentNode = getParentNode(node);
      // 原始条件节点
      let originalConditionNodes = parentNode.conditionNodes;
      // 获取父节点的条件子节点
      let conditionNodes = getNodeConditionNode(parentNode);
      let x = parentNode.position.x;
      let y = 0;
      for (let i = 0; i < originalConditionNodes.length; i++) {
        let conditionNode = originalConditionNodes[i];
        // 获取最后一个原始节点
        let lastOriginalNode = getLastNode(conditionNode);
        // 通过原始节点ID获取节点坐标
        let lastNode = getNodeById(lastOriginalNode.id);
        // console.info("lastNode：", JSON.stringify(lastNode));
        // 获取最后一个节点的坐标
        let lastNodePosition = lastNode.position;
        if (lastNodePosition.y > y) {
          y = lastNodePosition.y;
        }
        // 添加连线上下左右节点(第一个条件连左, 最后一个连右, 其他连接中间节点)
        let handleId = 'b';
        if (i == 0) {
          handleId = 'a';
        }
        if (i == originalConditionNodes.length - 1) {
          handleId = 'd';
        }
        edges.value.push({
          id: lastNode.id + '-' + node.id,
          source: lastNode.id,
          target: node.id,
          label: '',
          type: 'step',
          style: { stroke: getColor(currentFlag) },
          animated: currentFlag,
          labelBgStyle: { fill: 'orange' },
          markerEnd: MarkerType.ArrowClosed,
          sourceHandle: 'c',
          targetHandle: handleId,
        });
      }
      // 放入网关聚合节点
      nodes.value.push({
        id: node.id,
        parentId: node.parentId,
        type: 'gateway-end-node',
        position: { x: x, y: y + 180 },
        data: { label: node.nodeName, current: currentFlag },
      });
    }
  };

  const getColor = (flag) => {
    return flag ? DEFAULT_PRIMARY : '#213547';
  };

  /**
   * 获取节点类型
   * @param {*} type
   */
  const getNodeType = (type) => {
    if (ProcessNodeTypeEnum.APPROVE == type) {
      return 'approve-node';
    } else if (ProcessNodeTypeEnum.SEND == type) {
      return 'cc-node';
    } else if (ProcessNodeTypeEnum.SUBPROCESS == type) {
      return 'sub-node';
    }
    return 'approve-node';
  };

  /**
   * 通过节点ID获取节点信息
   * @param {*} id
   */
  const getNodeById = (id) => {
    let nodeList = nodes.value;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id == id) {
        return nodeList[i];
      }
    }
    return null;
  };

  /**
   * 通过节点获取条件子节点
   * @param {*} node
   */
  const getNodeConditionNode = (node) => {
    let conditionNodes = [];
    let nodeList = nodes.value;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].parentId == node.id) {
        conditionNodes.push(nodeList[i]);
      }
    }
    return conditionNodes;
  };

  /**
   * 获取当前节点的最后一个子节点(在条件分支中使用)
   * @param {*} node
   */
  const getLastNode = (node) => {
    // 获取最后一个节点
    if (node != null && node.childNode != null && node.childNode.id != '') {
      return getLastNode(node.childNode);
    }
    return node;
  };

  /**
   * 获取父节点
   * @param {*} node
   */
  const getParentNode = (node) => {
    // 获取父节点
    for (let i = 0; i < nodes.value.length; i++) {
      if (nodes.value[i].id == node.parentId) {
        return nodes.value[i];
      }
    }
    return null;
  };

  /**
   * 获取父节点坐标
   * @param {*} node
   */
  const getParentNodeCoordinate = (node) => {
    let coordinate = { x: 250, y: 5 };
    if (node != undefined && node != null) {
      let parentNode = getParentNode(node);
      if (parentNode == null) {
        return coordinate;
      } else {
        return parentNode.position;
      }
    }
    return coordinate;
  };
</script>
<style>
  @import '@vue-flow/core/dist/style.css';
  @import '@vue-flow/core/dist/theme-default.css';
  @import '@vue-flow/controls/dist/style.css';
  @import '@vue-flow/minimap/dist/style.css';
</style>
<style scoped type="scss">
  body {
    margin: 0px;
  }

  .flow-container {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>
