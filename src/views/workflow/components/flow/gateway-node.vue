<template>
  <el-tooltip class="box-item" effect="dark" :content="props.data.data.label" placement="top">
    <div class="flow-node-gateway" @click="handleClickNode">
      <div class="node-header">
        <div class="node-header-icon">
          <el-icon :size="15" color="#ffffff">
            <Connection />
          </el-icon>
        </div>
        <div class="node-name">{{ props.data.data.label }}</div>
      </div>
      <!-- <div class="node-body"></div> -->
      <!-- <div class="gateway-node-name">
      {{ props.data.data.label }}
    </div> -->
    </div>
  </el-tooltip>
  <Handle id="b" class="node" type="source" :position="Position.Top" />
  <Handle id="c" class="node" type="source" :position="Position.Bottom" />
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { Handle, Position, useVueFlow } from '@vue-flow/core';
  import { Connection } from '@element-plus/icons-vue';

  const emits = defineEmits(['click']);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const { updateNodeData, getConnectedEdges } = useVueFlow();

  onMounted(() => {
    // console.log("gateway：", props.data);
  });

  const onSelect = (color) => {
    updateNodeData(props.id, { color, isGradient: false });

    const connectedEdges = getConnectedEdges(props.id);
  };

  const onGradient = () => {
    updateNodeData(props.id, { isGradient: true });
  };

  const handleClickNode = () => {
    console.log('click node');
    emits('click');
  };
</script>
<style scoped>
  .flow-node-gateway {
    width: 100px;
    height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    border: 2px solid #213547;
    border-radius: 10px;
  }

  .node-header {
    /* height: 30px; */
    /* background-color: red; */
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .node-icon {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background-color: #213547;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .node-name {
    font-size: 14px;
    font-weight: 600;
    padding-left: 5px;
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 隐藏超出的内容 */
    text-overflow: ellipsis; /* 用省略号表示被隐藏的部分 */
  }

  .node {
    background-color: #213547;
  }
</style>
