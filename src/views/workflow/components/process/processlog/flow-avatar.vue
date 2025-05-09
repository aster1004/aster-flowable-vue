<!--
 * @Author: Lwj
 * @Date: 2024-09-27 11:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\processlog\flow-avatar.vue
 * @Description: 流程日志中的用户头像组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div>
    <div class="avatar-container">
      <el-avatar :size="size" :src="src ? src : avatar?.avatar" />
      <template v-if="showIcon && isNotEmpty(icon)">
        <i class="head-icon" :class="`iconfont ` + icon"></i>
      </template>
      <template v-if="showName">
        <div class="avatar-name">{{ _name }} </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { isNotEmpty } from '@/utils';
  import { computed } from 'vue';

  const props = defineProps({
    // 头像地址,如果传src了，则以src为主
    src: { type: String },
    avatar: { type: Object },
    // 图标，只需传入iconfont 类名的后半段
    size: { type: Number, default: 45 },
    icon: {
      type: String,
      default: 'icon-tongyi',
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
    showName: {
      type: Boolean,
      default: false,
    },
  });

  /**
   * @description: 获取用户名称
   */
  const _name = computed(() => {
    return isNotEmpty(props.avatar?.realName) ? props.avatar?.realName : props.avatar?.nickName;
  });
</script>

<style scoped lang="scss">
  .avatar-container {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 2px;
    width: 60px;
  }
  .avatar-name {
    width: 60px;
    text-align: center;
    font-size: small;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .head-icon {
    position: absolute;
    margin-bottom: -25px;
    top: 20px;
    right: 5px;
    height: 22px;
    width: 22px;
    display: flex;
    align-items: center;
    border-radius: 50%;
    font-size: 18px;
    color: #f78f5f;
    background: var(--el-color-white);
    border: 2px solid var(--el-color-white);
  }
  .el-image {
    background-color: #ffffff;
  }
</style>
