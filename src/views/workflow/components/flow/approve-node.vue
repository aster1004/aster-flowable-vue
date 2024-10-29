<template>
  <el-tooltip class="box-item" effect="dark" :content="props.data.data.label" placement="top">
    <div
      class="flow-node"
      :class="props.data.data.current ? 'current-node' : ''"
      @click="handleClickNode"
    >
      <div class="node-header">
        <div class="node-icon" :class="props.data.data.current ? 'current-node-icon' : ''">
          <el-icon :size="15" color="#ffffff">
            <Edit />
          </el-icon>
        </div>
        <div class="node-name">{{ props.data.data.label }}</div>
      </div>
      <div class="node-body">
        <template v-for="(item, index) in props.data.data.nodeUserList">
          <span v-if="index != 0">,</span>
          <span :index="index" v-if="item.type == 'user'">用户：</span>
          <span :index="index" v-if="item.type == 'dept'">部门：</span>
          <span :index="index" v-if="item.type == 'role'">角色：</span>
          <span>{{ item.name }}</span>
        </template>
      </div>
    </div>
  </el-tooltip>
  <Handle id="b" class="node" type="source" :position="Position.Top" />
  <Handle id="c" class="node" type="source" :position="Position.Bottom" />
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { Handle, Position, useVueFlow } from '@vue-flow/core';
  import { Edit } from '@element-plus/icons-vue';
  const { updateNodeData, getConnectedEdges } = useVueFlow();

  const emits = defineEmits(['click']);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  onMounted(() => {
    // console.log('mounted：', props.data.data);
  });

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
<style>
  @import '@/assets/styles/flow.css';
</style>
