<!--
 * @Author: Lwj
 * @Date: 2024-09-27 11:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\processlog\flow-avatar.vue
 * @Description: 流程日志中的用户头像组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-avatar :size="size">
    <template #default>
      <el-image class="avatar-info" :src="src" />
      <i v-if="showIcon" class="head-icon" :class="`iconfont ` + icon"></i>
    </template>
  </el-avatar>
</template>
<script setup lang="ts">
  const props = defineProps({
    // 头像地址
    src: { type: String, required: true },
    // 图标，只需传入iconfont 类名的后半段
    size: { type: Number, default: 45 },
    icon: {
      type: String,
      default: 'icon-tongyi',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  });
</script>

<style scoped lang="scss">
  .head-icon {
    position: absolute;
    bottom: -15px;
    right: -3px;
    border-radius: 50%;
    font-size: 18px;
    color: #f78f5f;
    background: #fff;
    border: 2px solid #fff;
  }
</style>
