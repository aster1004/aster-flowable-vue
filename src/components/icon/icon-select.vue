<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-23 17:21:09
 * @FilePath: \aster-flowable-vue\src\components\icon\icon-select.vue
 * @Description: 图标下拉选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-popover
    ref="iconListPopover"
    placement="bottom-start"
    trigger="click"
    width="40%"
    popper-class="mod__menu-icon-popover"
  >
    <template #reference>
      <el-input
        v-if="type == 'input'"
        v-model="iconValue"
        :readonly="true"
        :placeholder="placeholder"
      >
        <template #append>
          <span :style="spanStyle">
            <i :class="iconValue" :style="iconStyle"></i>
          </span>
        </template>
      </el-input>
      <span v-else :style="spanStyle">
        <i :class="iconValue" :style="[iconStyle, fixedStyle]"></i>
      </span>
    </template>
    <div class="mod__menu-icon-inner">
      <div class="mod__menu-icon-list">
        <el-button
          v-for="(item, index) in iconList"
          :key="index"
          :class="{ 'is-active': iconValue === item }"
          @click="iconHandle(item)"
        >
          <div class="svg-icon">
            <svg :style="svgStyles" aria-hidden="true">
              <use :xlink:href="svgHref(item)" />
            </svg>
          </div>
        </el-button>
      </div>
    </div>
  </el-popover>
</template>
<script setup lang="ts">
  import { PropType, reactive, ref, watchEffect } from 'vue';

  const props = defineProps({
    icon: {
      type: String,
      default: '',
    },
    // svg颜色
    color: {
      type: String,
      default: '',
    },
    // svg大小
    size: {
      type: String,
      default: () => '30px',
    },
    // 展示类型
    type: {
      type: String as PropType<'input' | 'icon'>,
      default: () => 'input',
    },
    // input 提示语
    placeholder: {
      type: String,
      default: () => '请选择图标',
    },
    // 图标展示样式
    iconStyle: {
      type: Object as PropType<{ color: string; backgroundColor: string }>,
      default: () => {},
    },
  });

  const emits = defineEmits<{
    'update:icon': [value: string];
  }>();

  // 选中的图标
  const iconValue = ref('');
  const iconListPopover = ref();

  // 解析iconfont.js
  const iconList = ref<string[]>([]);

  const list = document.querySelectorAll('svg symbol[id^="icon-"]');
  for (let i = 0; i < list.length; i++) {
    iconList.value.push('iconfont ' + list[i].id);
  }

  // 图标svg样式
  const svgStyles = reactive({
    color: props.color,
    width: props.size,
    height: props.size,
  });

  // span样式
  const spanStyle = reactive({
    width: props.size,
    height: props.size,
  });

  // 图标样式
  const fixedStyle = reactive({
    padding: '6px',
    borderRadius: '5px',
  });

  // svg图标
  const svgHref = (icon: string) => {
    return '#icon-' + icon.replace('iconfont icon-', '');
  };

  // 图标点击事件
  const iconHandle = (iconName: string) => {
    iconValue.value = iconName;
    emits('update:icon', iconName);
  };

  /**
   * @description: 监听icon值变化
   */
  watchEffect(() => {
    iconValue.value = props.icon;
  });
</script>
<style lang="scss" scoped>
  .mod__menu {
    ::v-deep(.el-popover.el-popper) {
      overflow-x: hidden;
    }

    .popover-list {
      ::v-deep(.el-input__inner) {
        cursor: pointer;
      }
      ::v-deep(.el-input__suffix) {
        cursor: pointer;
      }
    }

    &-icon-inner {
      width: 100%;
      max-height: 260px;
      overflow-x: hidden;
      overflow-y: auto;
      // 滚动条的宽度
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background: transparent;
      }
      // 滚动条的设置
      &::-webkit-scrollbar-thumb {
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
      }
    }
    &-icon-list {
      width: 100% !important;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 18px 0 0 8px;
        height: 50px;
        width: 50px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
  }

  .svg-icon svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    flex-shrink: 0;
  }
</style>
