<template>
  <div>
    <div class="nodes">
      <div
        class="sidebar-node node-approve"
        :draggable="true"
        @dragstart="onDragStart($event, 'approve-node')"
      >
        审核人
      </div>

      <div
        class="sidebar-node node-cc"
        :draggable="true"
        @dragstart="onDragStart($event, 'cc-node')"
      >
        抄送
      </div>

      <div
        class="sidebar-node node-gateway"
        :draggable="true"
        @dragstart="onDragStart($event, 'gateway-node')"
      >
        <div class="gateway-name">网关</div>
      </div>

      <div
        class="sidebar-node node-end"
        :draggable="true"
        @dragstart="onDragStart($event, 'end-node')"
      >
        结束
      </div>
    </div>
  </div>
</template>
<script setup>
  import useDragAndDrop from '../js/useDnD.js';
  const { onDragStart } = useDragAndDrop();
</script>
<style scoped>
  .nodes {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sidebar-node {
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 5px;
    font-size: 15px;
    margin-top: 10px;
  }

  .node-approve {
    border: 2px solid #213547;
  }

  .node-cc {
    border: 2px solid #2a9838;
  }

  .node-end {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 50%;
    border: 2px solid #000000;
  }

  .node-gateway {
    width: 50px;
    height: 50px;
    line-height: 50px;
    border: 2px solid #000000;
    transform: rotate(45deg);
  }

  .gateway-name {
    transform: rotate(-45deg);
  }
</style>
