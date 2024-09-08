<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-13 10:19:19
 * @FilePath: \aster-flowable-vue\src\views\workflow\settings\form-settings.vue
 * @Description: 表单设置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container>
    <el-aside class="settings-left">
      <div class="left-container">
        <el-scrollbar style="height: 100%">
          <el-menu :default-active="activeMenu" @select="handleSelect">
            <el-menu-item index="submitValidate">
              <i class="iconfont icon-feedback pr-5px"></i>提交校验
            </el-menu-item>
            <el-menu-item index="businessRule">
              <i class="iconfont icon-shujuguanli pr-5px"></i>业务规则
            </el-menu-item>
            <el-menu-item index="messageReminder">
              <i class="iconfont icon-xiaoxizhongxin pr-5px"></i>消息提醒
            </el-menu-item>
            <el-menu-item index="associationList">
              <i class="iconfont icon-guanlianliucheng pr-5px"></i>关联列表
            </el-menu-item>
            <el-menu-item index="printTemplate">
              <i class="iconfont icon-dayinji pr-5px"></i>打印模板
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>

    <el-main class="settings-main">
      <div class="main-container">
        <submit-validate ref="submitValidateRef" v-if="activeMenu == 'submitValidate'" />
        <business-rule ref="businessRuleRef" v-if="activeMenu == 'businessRule'" />
        <message-reminder ref="messageReminderRef" v-if="activeMenu == 'messageReminder'" />
        <association-list ref="associationListRef" v-if="activeMenu == 'associationList'" />
        <print-template ref="printTemplateRef" v-if="activeMenu == 'printTemplate'" />
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
  import SubmitValidate from './submit-validate.vue';
  import BusinessRule from './business-rule.vue';
  import MessageReminder from './message-reminder.vue';
  import AssociationList from './association-list.vue';
  import PrintTemplate from './print-template.vue';
  import { ref } from 'vue';

  // 活动菜单
  const activeMenu = ref('submitValidate');

  // 选中菜单
  const handleSelect = (key: string) => {
    activeMenu.value = key;
  };
</script>
<style scoped lang="scss">
  .el-container {
    height: 100%;
    padding: 0px 50px;
  }

  .el-container .el-aside {
    width: 200px;
    overflow: hidden;
    background-color: var(--el-bg-color);

    .el-menu {
      background-color: var(--el-menu-bg-color);
      border-right: 0px;
      box-sizing: border-box;
      list-style: none;
      margin: 0;
      padding-left: 0;
      position: relative;
    }

    .el-menu-item {
      margin: 1px 0;
      i {
        margin: 0;
        width: var(--el-menu-icon-width);
        text-align: center;
        font-size: 14px;
        vertical-align: middle;
      }
    }
    .el-menu .el-menu-item:hover {
      outline: 0 !important;
      color: var(--el-color-primary) !important;
      background: var(--el-menu-active-bg-color) !important;
    }

    .el-menu .el-menu-item.is-active {
      outline: 0 !important;
      color: var(--el-color-primary) !important;
      background: var(--el-menu-active-bg-color) !important;
    }

    .el-menu-item.is-active::before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      content: '';
      background-color: var(--el-color-primary);
    }
  }

  .el-container .el-main {
    overflow: hidden;
    padding: 0;
  }

  .settings-left {
    margin: 0 5px;
    border-radius: 6px;
    border: 1px solid var(--el-aside-border-color);

    .left-container {
      background-color: var(--el-bg-color);
      padding: 10px;
      height: 100%;
    }
  }

  .settings-main {
    margin: 0 5px;
    border-radius: 6px;
    border: 1px solid var(--el-aside-border-color);

    .main-container {
      background-color: var(--el-bg-color);
      margin-bottom: 5px;
      height: 100%;
      padding: 0px 10px;
    }
  }
</style>
