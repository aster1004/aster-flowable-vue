<template>
  <el-tooltip class="box-item" effect="dark" content="发起人" placement="top">
    <div
      class="flow-node"
      :class="props.data.data.current ? 'current-node' : ''"
      @click="handleClickNode"
    >
      <div class="node-header">
        <div class="node-header-icon" :class="props.data.data.current ? 'current-node-icon' : ''">
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
  @import '@/assets/styles/flow.css';
</style>
