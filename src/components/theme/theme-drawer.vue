<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-04 17:41:55
 * @FilePath: \aster-admin\src\components\theme\theme-drawer.vue
 * @Description: 布局设置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-drawer
    v-model="drawerVisible"
    :title="t('header.layoutConfig')"
    size="290px"
    :lock-scroll="false"
  >
    <!-- 布局样式 -->
    <el-divider class="divider" content-position="center">
      <i class="iconfont icon-buju"></i>
      {{ t('header.layoutStyle') }}
    </el-divider>
    <div class="layout-box">
      <el-tooltip
        effect="dark"
        :content="t('header.layoutVertical')"
        placement="top"
        :show-after="200"
      >
        <div
          :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]"
          @click="setLayout('vertical')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <i class="iconfont icon-completed" v-if="layout == 'vertical'"></i>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="t('header.layoutClassic')"
        placement="top"
        :show-after="200"
      >
        <div
          :class="['layout-item layout-classic', { 'is-active': layout == 'classic' }]"
          @click="setLayout('classic')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <i class="iconfont icon-completed" v-if="layout == 'classic'"></i>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="t('header.layoutTransverse')"
        placement="top"
        :show-after="200"
      >
        <div
          :class="['layout-item layout-transverse', { 'is-active': layout == 'transverse' }]"
          @click="setLayout('transverse')"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <i class="iconfont icon-completed" v-if="layout == 'transverse'"></i>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        :content="t('header.layoutColumns')"
        placement="top"
        :show-after="200"
      >
        <div
          :class="['layout-item layout-columns', { 'is-active': layout == 'columns' }]"
          @click="setLayout('columns')"
        >
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <i class="iconfont icon-completed" v-if="layout == 'columns'"></i>
        </div>
      </el-tooltip>
    </div>
    <div class="theme-item">
      <span>
        {{ t('header.sidebarInvertColor') }}
        <el-tooltip effect="dark" :content="t('header.sidebarInvertColorTip')" placement="top">
          <i class="iconfont icon-tishi text-gray-500 pl-3px"></i>
        </el-tooltip>
      </span>
      <el-switch v-model="asideInverted" @change="setAsideTheme" />
    </div>
    <div class="theme-item mb50">
      <span>
        {{ t('header.headerInvertColor') }}
        <el-tooltip effect="dark" :content="t('header.headerInvertColorTip')" placement="top">
          <i class="iconfont icon-tishi text-gray-500 pl-3px"></i>
        </el-tooltip>
      </span>
      <el-switch v-model="headerInverted" @change="setHeaderTheme" />
    </div>

    <!-- 全局主题 -->
    <el-divider class="divider" content-position="center">
      <i class="iconfont icon-zhutise"></i>
      {{ t('header.theme') }}
    </el-divider>
    <div class="theme-item">
      <span>{{ t('header.primary') }}</span>
      <el-color-picker v-model="primary" :predefine="colorList" @change="changePrimary" />
    </div>
    <div class="theme-item">
      <span>{{ t('header.darkMode') }}</span>
      <el-switch
        v-model="globalStore.isDark"
        inline-prompt
        :active-icon="Sunny"
        :inactive-icon="Moon"
        @change="switchDark"
      />
    </div>
    <div class="theme-item">
      <span>{{ t('header.greyMode') }}</span>
      <el-switch v-model="isGrey" @change="changeGreyOrWeak('grey', !!$event)" />
    </div>
    <div class="theme-item mb40">
      <span>{{ t('header.weakMode') }}</span>
      <el-switch v-model="isWeak" @change="changeGreyOrWeak('weak', !!$event)" />
    </div>

    <!-- 界面设置 -->
    <el-divider class="divider flex" content-position="center">
      <i class="iconfont icon-jiemianguanli"></i>
      {{ t('header.pageSettings') }}
    </el-divider>
    <div class="theme-item">
      <span>{{ t('header.collapseMenu') }}</span>
      <el-switch v-model="isCollapse" />
    </div>
    <div class="theme-item">
      <span>{{ t('header.breadcrumb') }}</span>
      <el-switch v-model="breadcrumb" />
    </div>
    <div class="theme-item">
      <span>{{ t('header.breadcrumbIcon') }}</span>
      <el-switch v-model="breadcrumbIcon" />
    </div>
    <div class="theme-item">
      <span>{{ t('header.tabs') }}</span>
      <el-switch v-model="tabs" />
    </div>
    <div class="theme-item">
      <span>{{ t('header.tabsIcon') }}</span>
      <el-switch v-model="tabsIcon" />
    </div>
    <div class="theme-item">
      <span>{{ t('header.footer') }}</span>
      <el-switch v-model="footer" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useTheme } from '@/utils/styles/useTheme';
  import { useGlobalStore } from '@/stores/modules/global';
  import { DEFAULT_PRIMARY } from '@/config';
  import mittBus from '@/utils/mittBus';
  import { Sunny, Moon } from '@element-plus/icons-vue';
  import { useI18n } from 'vue-i18n';
  import { LayoutType } from '@/stores/interface';

  const { t } = useI18n();

  const { changePrimary, changeGreyOrWeak, switchDark, setAsideTheme, setHeaderTheme } = useTheme();

  const globalStore = useGlobalStore();
  const {
    layout,
    primary,
    isGrey,
    isWeak,
    asideInverted,
    headerInverted,
    isCollapse,
    breadcrumb,
    breadcrumbIcon,
    tabs,
    tabsIcon,
    footer,
  } = storeToRefs(globalStore);

  // 预定义主题颜色
  const colorList = [
    DEFAULT_PRIMARY,
    '#009688',
    '#daa96e',
    '#0c819f',
    '#409eff',
    '#27ae60',
    '#ff5c93',
    '#f39c12',
    '#9b59b6',
    '#e74c3c',
  ];

  // 设置布局方式
  const setLayout = (val: LayoutType) => {
    globalStore.setGlobalState('layout', val);
    setAsideTheme();
  };

  // 打开主题设置
  const drawerVisible = ref(false);

  mittBus.on('openThemeDrawer', () => {
    drawerVisible.value = true;
  });
</script>

<style scoped lang="scss">
  .divider {
    margin-top: 15px;
    .el-icon {
      position: relative;
      top: 2px;
      right: 5px;
      font-size: 15px;
    }
  }
  .theme-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    margin: 14px 0;
    span {
      display: flex;
      align-items: center;
      font-size: 14px;
      .el-icon {
        margin-left: 3px;
        font-size: 15px;
        color: var(--el-text-color-regular);
        cursor: pointer;
      }
    }
  }

  .layout-box {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 15px 7px 0;
    .layout-item {
      position: relative;
      box-sizing: border-box;
      width: 100px;
      height: 70px;
      padding: 6px;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 0 0 5px 1px var(--el-border-color-dark);
      transition: all 0.2s;
      .layout-dark {
        background-color: var(--el-color-primary);
        border-radius: 3px;
      }
      .layout-light {
        background-color: var(--el-color-primary-light-5);
        border-radius: 3px;
      }
      .layout-content {
        background-color: var(--el-color-primary-light-8);
        border: 1px dashed var(--el-color-primary);
        border-radius: 3px;
      }
      i {
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: var(--el-color-primary);
        transition: all 0.2s;
      }
      &:hover {
        box-shadow: 0 0 5px 1px var(--el-text-color-secondary);
      }
    }
    .is-active {
      box-shadow: 0 0 0 2px var(--el-color-primary) !important;
    }
    .layout-vertical {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .layout-dark {
        width: 20%;
      }
      .layout-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 72%;
        .layout-light {
          height: 20%;
        }
        .layout-content {
          height: 67%;
        }
      }
    }
    .layout-classic {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 20px;
      .layout-dark {
        height: 22%;
      }
      .layout-container {
        display: flex;
        justify-content: space-between;
        height: 70%;
        .layout-light {
          width: 20%;
        }
        .layout-content {
          width: 70%;
        }
      }
    }
    .layout-transverse {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 15px;
      .layout-dark {
        height: 20%;
      }
      .layout-content {
        height: 67%;
      }
    }
    .layout-columns {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      .layout-dark {
        width: 14%;
      }
      .layout-light {
        width: 17%;
      }
      .layout-content {
        width: 55%;
      }
    }
  }
</style>
