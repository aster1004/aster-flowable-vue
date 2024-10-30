<template>
  <el-tooltip class="box-item" effect="dark" :content="props.data.data.label" placement="top">
    <div class="condition-node" @click="handleClickNode">
      <div class="node-header">
        <div class="node-header-icon">
          <el-icon :size="15" color="#ffffff">
            <Operation />
          </el-icon>
        </div>
        <div class="node-name">{{ props.data.data.label }}</div>
      </div>
      <div class="condition-node-body">
        {{ props.data.data.conditionStr }}
      </div>
    </div>
  </el-tooltip>
  <Handle id="b" class="node" type="source" :position="Position.Top" />
  <Handle id="c" class="node" type="source" :position="Position.Bottom" />
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { Handle, Position, useVueFlow } from '@vue-flow/core';
  import { Operation } from '@element-plus/icons-vue';
  const { updateNodeData, getConnectedEdges } = useVueFlow();

  const emits = defineEmits(['click']);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  onMounted(() => {
    // console.log("conditionNode：", props.data);
  });

  const onSelect = (color) => {
    updateNodeData(props.id, { color, isGradient: false });
    const connectedEdges = getConnectedEdges(props.id);
  };

  const onGradient = () => {
    updateNodeData(props.id, { isGradient: true });
  };

  const handleClickNode = () => {
    // console.log("click node");
    emits('click');
  };
</script>
<style scoped>
  .condition-node {
    width: 200px;
    height: 60px;
    background-color: #ffffff;
    border: 2px solid #32bbb0;
    border-radius: 10px;
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
    background-color: #32bbb0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .node-name {
    font-size: 14px;
    font-weight: 600;
    padding-left: 5px;
  }

  .node {
    background-color: #32bbb0;
  }

  .condition-node-body {
    padding: 0px 10px 10px 10px;
    font-size: 12px;
    height: 21px;
    display: -webkit-box; /* 必须配合此属性使用 */
    -webkit-box-orient: vertical; /* 设置为垂直方向 */
    -webkit-line-clamp: 1; /* 显示的行数 */
    overflow: hidden; /* 隐藏超出的内容 */
  }
</style>
