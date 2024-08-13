<template>
  <el-popover :visible="visible" placement="bottom" trigger="click">
    <template #reference>
      <el-input
        :model-value="controlTitle(rule.value)"
        placeholder="请选择"
        readonly
        @click="visible = true"
        class="custom-input"
      >
        <template #prepend>
          <span> {{ rule.name }} </span>
        </template>
        <template #append>
          <el-button plain @click="clear">
            <i class="iconfont icon-close" style="font-size: 12px"></i>
          </el-button>
        </template>
      </el-input>
    </template>
    <div
      class="control-option"
      v-for="(item, i) in options"
      :key="i"
      @click="chooseControl(item.value)"
    >
      <span class="control-option-title">{{ item.label }}</span>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
  import { isEmpty } from 'lodash-es';
  import { computed, ref } from 'vue';

  const emits = defineEmits(['update:rule']);

  const props = defineProps({
    rule: {
      type: Object,
      default: {},
    },
    options: {
      required: true,
      type: Array<WorkComponent.TreeNode>,
      default: [],
    },
  });

  // 控制弹窗显示
  const visible = ref(false);

  /**
   * @description: 获取表单控件标题
   * @param {*} id
   * @return {*}
   */
  const controlTitle = (val: string) => {
    if (isEmpty(val)) {
      return '';
    }
    const item = props.options.find((item) => item.value === val);
    return item ? item.label : '';
  };

  /**
   * @description: 选择表单控件
   * @param {*} rule 规则
   * @param {*} id 表单id
   * @return {*}
   */
  const chooseControl = (id: string) => {
    _rule.value.value = id;
    visible.value = false;
  };

  const clear = () => {
    _rule.value.value = '';
  };

  // 规则
  const _rule = computed({
    get() {
      return props.rule;
    },
    set(val) {
      emits('update:rule', val);
    },
  });
</script>
<style scoped lang="scss">
  .control-option {
    height: 30px;
    line-height: 30px;
    display: flex;
    cursor: pointer;
    padding-left: 10px;
    box-sizing: border-box;
    border-radius: 2px;
  }

  .control-option:hover {
    background-color: var(--el-color-primary);
  }

  .control-option:hover .control-option-title {
    color: #ffffff;
  }

  .custom-input {
    ::v-deep(.el-input-group__append, .el-input-group__prepend) {
      align-items: center;
      background-color: #fff;
      border-radius: 0;
      border-top-right-radius: var(--el-input-border-radius);
      border-bottom-right-radius: var(--el-input-border-radius);
      color: var(--el-color-info);
      display: inline-flex;
      justify-content: center;
      min-height: 100%;
      padding: 0 10px;
      position: relative;
      white-space: nowrap;
    }
  }
</style>
