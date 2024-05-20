<template>
  <div class="home-container">
    <el-card class="home-card" shadow="never">
      <template #header>
        <span class="card-header-title">应用信息</span>
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
  import { onMounted, reactive, ref } from 'vue';
  import { appListApi } from '@/api/workflow/app';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useRouter } from 'vue-router';
  // 路由
  const router = useRouter();
  // 应用集合
  const appList = ref<WorkApp.AppInfo[]>();

  /**
   * 初始化加载
   */
  onMounted(() => {
    handleQueryApp();
  });

  /**
   * 查询应用信息
   */
  const handleQueryApp = () => {
    appListApi({}).then((res) => {
      console.log(res);
      if (res.code == ResultEnum.SUCCESS) {
        appList.value = res.data;
      }
    });
  };

  const handleApp = (id: string) => {
    console.info(id);
    router.push({
      path: '/workflow/form/list',
      query: {
        appId: id,
      },
    });
  };
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
