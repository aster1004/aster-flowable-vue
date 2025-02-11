<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-20 11:56:43
 * @FilePath: \aster-flowable-vue\src\views\workflow\workbench\index.vue
 * @Description: 工作台主页
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="home-container">
    <el-card class="home-card" shadow="never">
      <template #header>
        <span class="card-header-title">{{ t('workflow.label.appInfo') }}</span>
      </template>
      <div class="app-container">
        <el-card
          class="app-card"
          shadow="hover"
          v-for="item in appList"
          :key="item"
          @click="handleApp(item.id)"
        >
          <div class="app">
            <div class="app-icon" :style="{ backgroundColor: item.iconColor }">
              <i :class="['iconfont', item.icon]"></i>
            </div>
            <div class="app-name">{{ item.name }}</div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { appActiveListApi } from '@/api/workflow/app';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // 路由
  const router = useRouter();
  // 应用集合
  const appList = ref<WorkApp.AppInfo[]>();

  /**
   * 查询应用信息
   */
  const handleQueryApp = () => {
    appActiveListApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        appList.value = res.data;
      }
    });
  };

  /**
   * @description: 跳转流程实例列表
   * @param {*} id
   * @return {*}
   */
  const handleApp = (id?: string) => {
    router.push({
      path: '/workflow/workbench/instance-list',
      query: {
        appId: id,
      },
    });
  };

  /**
   * 初始化加载
   */
  onMounted(() => {
    handleQueryApp();
  });
</script>
<style lang="scss" scoped>
  .home-container {
    width: 100%;
    height: 100%;
    .home-card {
      margin: 0 auto;
      border-radius: 10px;
    }
    .card-header-title {
      font-weight: bold;
      font-size: 18px;
    }
  }
  .app-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .app-card {
      border-radius: 15px;
      margin-right: 20px;
      margin-bottom: 20px;
    }
    .app {
      width: 180px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .app-icon {
        width: 50px;
        height: 50px;
        // background-color: red;
        text-align: center;
        border-radius: 10px;
        i {
          font-size: 35px;
          color: #ffffff;
        }
      }
      .app-name {
        flex: 1;
        margin-left: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>
