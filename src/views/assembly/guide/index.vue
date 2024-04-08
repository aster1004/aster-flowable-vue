<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-06 17:40:09
 * @FilePath: \aster-admin\src\views\assembly\guide\index.vue
 * @Description: 引导页
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card content-box">
    <span class="text"> 引导页 </span>
    <el-alert
      title="引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于 driver.js."
      type="warning"
      :closable="false"
    />
    <div id="Geeker">
      <el-button type="primary" @click.prevent.stop="driverObj.drive()"> 打开引导页 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="guide">
  import { driver } from 'driver.js';
  import 'driver.js/dist/driver.css';

  const driverObj = driver({
    allowClose: true,
    doneBtnText: '结束',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    steps: [
      {
        element: '#collapseIcon',
        popover: {
          title: '折叠',
          description: '打开或关闭侧边栏',
          side: 'right',
        },
      },
      {
        element: '#breadcrumb',
        popover: {
          title: '面包屑',
          description: '当前页面位置',
          side: 'right',
        },
      },

      {
        element: '#tenant',
        popover: {
          title: '租户',
          description: '切换租户',
          side: 'left',
        },
      },
      {
        element: '#searchMenu',
        popover: {
          title: '页面搜索',
          description: '页面搜索，快速导航',
          side: 'left',
        },
      },
      {
        element: '#assemblySize',
        popover: {
          title: '切换组件大小',
          description: '切换Element组件大小',
          side: 'left',
        },
      },
      {
        element: '#language',
        popover: {
          title: '切换语言',
          description: '切换系统语言',
          side: 'left',
        },
      },
      {
        element: '#themeSetting',
        popover: {
          title: '主题设置',
          description: '自定义设置主题',
          side: 'left',
        },
      },
      {
        element: '#message',
        popover: {
          title: '消息提醒',
          description: '接收系统通知、消息',
          side: 'left',
        },
      },
      {
        element: '#fullscreen',
        popover: {
          title: '全屏',
          description: '页面全屏',
          side: 'left',
        },
      },
      {
        element: '#userAvatar',
        popover: {
          title: '用户头像',
          description: '个人信息、修改密码及退出登录',
          side: 'left',
        },
      },
    ],
  });
</script>

<style scoped lang="scss">
  .el-button {
    margin-top: 20px;
  }
</style>
