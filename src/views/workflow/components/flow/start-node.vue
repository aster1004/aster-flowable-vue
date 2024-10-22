<template>
  <el-tooltip class="box-item" effect="dark" content="发起人" placement="top">
    <div class="flow-node" @click="handleClickNode">
      <div class="node-header">
        <div class="node-icon">
          <el-icon :size="15" color="#ffffff">
            <User />
          </el-icon>
        </div>
        <div class="node-name">发起人</div>
      </div>
      <div class="start-node-body">
        <!-- {{ props.data.data.nodeUser }} -->
      </div>
    </div>
  </el-tooltip>
  <Handle id="a" class="node" type="source" :position="Position.Bottom" />
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { Handle, Position, useVueFlow } from '@vue-flow/core';
  import { User } from '@element-plus/icons-vue';

  const emits = defineEmits(['click']);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  onMounted(() => {
    // console.log("start：", props.data);
  });

  const { updateNodeData, getConnectedEdges } = useVueFlow();

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
  .flow-node {
    width: 200px;
    height: 90px;
    background-color: #ffffff;
    border: 2px solid #fb5923;
    border-radius: 10px;
  }

  .flow-node:hover {
    border-color: red;
  }

  .node-header {
    height: 30px;
    /* background-color: red; */
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .node-icon {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background-color: #f56c6c;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .node-name {
    font-size: 10px;
    font-weight: 500;
    padding-left: 5px;
  }

  .node {
    background-color: #f56c6c;
  }

  .start-node-body {
    padding: 0px 8px 8px 8px;
    font-size: 14px;
    font-weight: bold;
  }
</style>
