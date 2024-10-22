<template>
  <el-tooltip class="box-item" effect="dark" content="结束" placement="top">
    <div class="flow-end-node" @click="handleClickNode">结束</div>
  </el-tooltip>
  <Handle id="d" class="node" type="source" :position="Position.Top" />
</template>
<script setup>
  import { ref } from 'vue';
  import { Handle, Position, useVueFlow } from '@vue-flow/core';
  import { Connection } from '@element-plus/icons-vue';
  const { updateNodeData, getConnectedEdges } = useVueFlow();

  const emits = defineEmits(['click']);

  const onSelect = (color) => {
    updateNodeData(props.id, { color, isGradient: false });
    const connectedEdges = getConnectedEdges(props.id);
  };

  const onGradient = () => {
    updateNodeData(props.id, { isGradient: true });
  };

  const handleClickNode = () => {
    emits('click');
  };
</script>
<style scoped>
  .flow-end-node {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    border: 2px solid #000000;
  }
</style>
