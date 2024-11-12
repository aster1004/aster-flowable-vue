<!--条件节点组件渲染-->

<template>
  <div v-if="type < 3 || type == ProcessNodeTypeEnum.SUBPROCESS" class="node-wrap">
    <div
      class="node-wrap-box"
      :class="
        (type == 0 ? 'start-node ' : '') + (isTried && currentNode.error ? 'active error' : '')
      "
    >
      <div class="title" :style="`background: ${nodeConfig[type].color};`">
        <span v-if="type == 0">
          <i :class="nodeConfig[type].icon"> </i>
          {{ currentNode.nodeName }}
        </span>
        <template v-else>
          <i :class="nodeConfig[type].icon"> </i>
          <input
            autofocus
            v-if="isEdit"
            ref="inputRef"
            type="text"
            class="ant-input editable-title-input"
            @blur="blurEvent()"
            v-model="currentNode.nodeName"
          />
          <span v-else class="editable-title" @click="clickEvent()">
            {{ currentNode.nodeName }}
          </span>
          <i class="iconfont icon-close node-close" @click="delTerm"></i>
        </template>
      </div>
      <div class="content" @click="setPerson">
        <el-tooltip effect="light" :content="content" placement="bottom">
          <span class="text">
            <span class="placeholder" v-if="!content">请选择{{ defaultText }} </span>
            {{ content }}
          </span>
        </el-tooltip>
        <i class="iconfont icon-xiangyou"></i>
      </div>
      <div class="error_tip" v-if="isTried && currentNode.error">
        <el-tooltip
          effect="dark"
          :content="currentNode.errorTip"
          placement="right-start"
          raw-content
        >
          <i class="iconfont icon-cuowutishi" style="color: #f25643; font-size: 24px"></i>
        </el-tooltip>
      </div>
    </div>
    <addNode v-model:childNodeP="currentNode.childNode" />
  </div>

  <div v-else class="condition-node">
    <div class="condition-node-box">
      <div class="auto-judge" :class="isTried && currentNode.error ? 'error active' : ''">
        <div
          class="sort-left"
          v-if="index != 0 && !currentNode.isDefault && typeName !== 'Parallel'"
          @click="arrTransfer(index, -1)"
          >&lt;</div
        >
        <div class="title-wrapper">
          <input
            autofocus
            v-if="isEdit"
            ref="inputRef"
            type="text"
            class="ant-input editable-title-input"
            @blur="blurEvent()"
            v-model="currentNode.nodeName"
          />

          <div v-else class="editable-title" @click="clickEvent()">
            <i :class="currentNode.icon"></i>{{ currentNode.nodeName }}</div
          >
          <span
            v-if="typeName !== 'Parallel'"
            class="priority-title"
            @click="setPerson(currentNode.priorityLevel)"
            >优先级{{ currentNode.priorityLevel }}</span
          >
          <span v-else class="priority-title">并行执行</span>
          <i
            class="iconfont icon-close condition-node-close"
            v-if="!currentNode.isDefault"
            @click="delTerm(index)"
          ></i>
        </div>
        <div
          class="sort-right"
          v-if="index < nodeCount - (typeName !== 'Parallel' ? 2 : 1) && typeName !== 'Parallel'"
          @click="arrTransfer(index)"
          >&gt;</div
        >
        <el-tooltip effect="light" :content="content" placement="bottom">
          <div
            class="content"
            @click="setPerson(currentNode.priorityLevel, currentNode.isDefault)"
            >{{ content }}</div
          >
        </el-tooltip>
        <div class="error_tip" v-if="isTried && currentNode.error">
          <el-tooltip
            effect="dark"
            :content="currentNode.errorTip"
            placement="right-start"
            raw-content
          >
            <i class="iconfont icon-cuowutishi" style="color: #f25643; font-size: 24px"></i>
          </el-tooltip>
        </div>
      </div>
      <addNode v-model:childNodeP="currentNode.childNode" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick, computed } from 'vue';
  import { nodeConfig, placeholderList } from '@/utils/const';
  import { ProcessNodeTypeEnum } from '@/enums/workFlowEnum';
  const emits = defineEmits(['delTerm', 'arrTransfer', 'setPerson']);
  const props = defineProps({
    currentNode: {
      type: Object,
      default: () => ({}),
    },
    //0 发起人 1审批 2抄送 3条件 4路由 5并行分支 6包容网关
    type: {
      type: Number,
      default: 0,
    },
    typeName: {
      type: String,
      default: () => '',
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
      default: 0,
    },
    // 条件表达式解析后的内容
    content: {
      type: String,
      default: () => '',
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
  const defaultText = computed(() => {
    if (props.type === ProcessNodeTypeEnum.SUBPROCESS) {
      return '子流程';
    }
    return placeholderList[props.type];
  });
  /**
   * @description: 失去焦点事件
   */
  const blurEvent = () => {
    isEdit.value = false;
    if (props.type < 3) {
      props.currentNode.nodeName = props.currentNode.nodeName || defaultText;
    } else if (props.type === 4) {
      props.currentNode.nodeName = props.currentNode.nodeName || '条件';
    }
  };
  const arrTransfer = (index: number, type: number = 1) => {
    emits('arrTransfer', index, type);
  };
  const clickEvent = () => {
    isEdit.value = true;
  };
  const setPerson = (priorityLevel?: number, isDefault: boolean = false) => {
    emits('setPerson', priorityLevel, isDefault);
  };
  const delTerm = (index: number) => {
    emits('delTerm', index);
  };
</script>

<style scoped lang="scss"></style>
