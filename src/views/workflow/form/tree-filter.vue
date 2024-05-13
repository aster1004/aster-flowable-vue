<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-27 17:15:13
 * @FilePath: \aster-flowable-vue\src\components\tree\tree-filter.vue
 * @Description: 树形选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card filter">
    <h4 v-if="title" class="title sle">
      {{ title }}
    </h4>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <div class="app-container">
        <div
          :class="['app', appItem.id == activeId ? 'active' : '']"
          v-for="(appItem, index) in appData"
          :key="index"
          @click="handleClick(appItem)"
        >
          <div class="app-icon">
            <i
              :class="['iconfont', appItem.icon, 'iconStyle']"
              :style="{ backgroundColor: appItem.iconColor }"
            ></i>
          </div>
          <div class="app-name">{{ appItem.name }}</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
  import { ref, watch, onBeforeMount, nextTick } from 'vue';
  import { ElTree } from 'element-plus';
  import { appListApi } from '@/api/workflow/app';

  // 应用信息
  const appData = ref<WorkApp.AppInfo[]>();

  // 选中的应用ID
  const activeId = ref<string | undefined>('');

  onBeforeMount(async () => {
    listApp();
  });

  const listApp = () => {
    appListApi({}).then((res) => {
      appData.value = res.data;
    });
  };

  // emit
  const emits = defineEmits(['change']);

  /**
   * 点击应用
   */
  const handleClick = (appInfo: WorkApp.AppInfo) => {
    console.info(appInfo);
    activeId.value = appInfo.id;
    emits('change', appInfo);
  };
</script>

<style scoped lang="scss">
  .filter {
    box-sizing: border-box;
    width: 220px;
    height: 100%;
    padding: 18px;
    margin-right: 10px;
    .title {
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-info-dark-2);
      letter-spacing: 0.5px;
    }
    .el-input {
      margin: 0 0 15px;
    }
    .el-scrollbar {
      :deep(.el-tree) {
        height: 80%;
        overflow: auto;
        .el-tree-node__content {
          height: 33px;
        }
      }
      :deep(.el-tree--highlight-current) {
        .el-tree-node.is-current > .el-tree-node__content {
          background-color: var(--el-color-primary);
          .el-tree-node__label,
          .el-tree-node__expand-icon {
            color: white;
          }
          .is-leaf {
            color: transparent;
          }
        }
      }
    }
  }

  .app-container {
    display: flex;
    flex-direction: column;
    .app {
      display: flex;
      height: 45px;
      line-height: 45px;
      text-align: left;
      border-left: 5px solid #ffffff;
      cursor: pointer;
      .app-icon {
        width: 35px;
        text-align: center;
      }
      .app-name {
        flex: 1;
        font-size: 14px;
      }
    }
    .app:hover {
      border-left: 5px solid $primary-color;
      background-color: #fff1f0;
    }
    .active {
      border-left: 5px solid $primary-color;
      background-color: #fff1f0;
    }
  }

  .iconStyle {
    width: 20px;
    height: 20px;
    font-size: 15px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
  }
</style>
