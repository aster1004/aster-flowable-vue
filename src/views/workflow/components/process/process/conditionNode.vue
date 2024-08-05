<!--条件节点组件渲染-->

<template>
  <div class="condition-node">
    <div class="condition-node-box">
      <div class="auto-judge" :class="isTried && conditionNode.error ? 'error active' : ''">
        <div
          class="sort-left"
          v-if="index != 0 && !conditionNode.isDefault && typeName !== 'Parallel'"
          @click="arrTransfer(index, -1)"
          >&lt;</div
        >
        <div class="title-wrapper">
          <!-- @focus="$event.currentTarget.select()"
            v-focus -->
          <input
            autofocus
            v-if="isEdit"
            ref="inputRef"
            type="text"
            class="ant-input editable-title-input"
            @blur="blurEvent()"
            v-model="conditionNode.nodeName"
          />

          <div v-else class="editable-title" @click="clickEvent()">
            <span :class="conditionNode.icon"></span>{{ conditionNode.nodeName }}</div
          >
          <span
            v-if="typeName !== 'Parallel'"
            class="priority-title"
            @click="setPerson(conditionNode.priorityLevel)"
            >优先级{{ conditionNode.priorityLevel }}</span
          >
          <span v-else class="priority-title">并行执行</span>
          <i
            class="iconfont icon-close condition-node-close"
            v-if="!conditionNode.isDefault"
            @click="delTerm(index)"
          ></i>
          <!-- <i class="anticon anticon-close close" @click="delTerm(index)"></i> -->
        </div>
        <div
          class="sort-right"
          v-if="index < nodeCount - (typeName !== 'Parallel' ? 2 : 1) && typeName !== 'Parallel'"
          @click="arrTransfer(index)"
          >&gt;</div
        >
        <div
          class="content"
          @click="setPerson(conditionNode.priorityLevel, conditionNode.isDefault)"
          >{{ content }}</div
        >
        <div class="error_tip" v-if="isTried && conditionNode.error">
          <i class="iconfont icon-cuowutishi" style="color: #f25643; font-size: 24px"></i>
        </div>
      </div>
      <addNode v-model:childNodeP="conditionNode.childNode" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';
  const emits = defineEmits(['delTerm', 'arrTransfer', 'setPerson']);
  const props = defineProps({
    conditionNode: {
      type: Object,
      default: () => ({}),
    },
    typeName: {
      type: String,
      default: 0,
    },
    // 条件所在下标
    index: {
      type: Number,
      default: 0,
    },
    // 是否开启校验
    isTried: {
      type: Boolean,
      default: false,
    },
    // 节点数量
    nodeCount: {
      type: Number,
      default: false,
    },
    // 条件表达式解析后的内容
    content: {
      type: String,
      default: '',
    },
  });
  // 是否编辑
  const isEdit = ref(false);
  const inputRef = ref();
  // 监听是否编辑，编辑时自动聚焦
  watch(isEdit, () => {
    if (isEdit.value) {
      nextTick(() => {
        inputRef.value.focus();
      });
    }
  });

  /**
   * @description: 失去焦点事件
   */
  const blurEvent = () => {
    isEdit.value = false;
    props.conditionNode.nodeName = props.conditionNode.nodeName || '条件';
  };
  const arrTransfer = (index: number, type: number = 1) => {
    emits('arrTransfer', index, type);
  };
  const clickEvent = () => {
    isEdit.value = true;
  };
  const setPerson = (priorityLevel: number, isDefault: boolean = false) => {
    emits('setPerson', priorityLevel, isDefault);
  };
  const delTerm = (index: number) => {
    emits('delTerm', index);
  };
</script>

<style scoped lang="scss"></style>
