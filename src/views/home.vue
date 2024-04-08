<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-admin\src\views\home.vue
 * @Description: 首页
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="home">
    <el-row :gutter="20" class="flex justify-between w-full h-full mt-4">
      <el-col :span="weatherVisible ? 16 : 24">
        <el-card class="home-card" style="height: 345px">
          <h2>介绍</h2>
          <p>
            基于SpringBoot3、Mybatis-Plus、SpringSecurity、Vue3、TypeScript、Vite、
            <br />
            Element-Plus、Pinia等开发的一套前后端分离的权限管理系统，可生成前后端代码，
            <br />
            支持乐观锁、数据权限、多租户、任务调度、WebSocket等。
          </p>
          <p class="pt-10px font-bold">码云地址：</p>
          <p>
            后端地址：
            <a
              href="https://gitee.com/lp1791803611/aster-boot"
              target="_blank"
              class="text-blue-500"
            >
              https://gitee.com/lp1791803611/aster-boot
            </a>
          </p>
          <p>
            前端地址：
            <a
              href="https://gitee.com/lp1791803611/aster-admin"
              target="_blank"
              class="text-blue-500"
            >
              https://gitee.com/lp1791803611/aster-admin
            </a>
          </p>
          <p class="pt-10px">
            <span class="font-bold">演示地址：</span>
            <a href="http://admin.aster.vip/#/" target="_blank" class="text-blue-500">
              http://admin.aster.vip/#/
            </a>
          </p>
          <p> 超级管理员: admin/123456 </p>
          <p> 租户管理员: long/123456 </p>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="weatherVisible">
        <el-card class="home-card" style="height: 345px">
          <weather-forecast ref="weatherRef" :forecast="forecastInfo" />
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="home-card">
          <h2>后端工程</h2>
          <p>基于SpringBoot3.x、SpringSecurity、Mybatis-Plus开发</p>
          <p>系统管理：菜单管理、数据字典、参数配置、通知公告</p>
          <p>权限管理：用户管理、角色管理、机构管理、岗位管理</p>
          <p>日志管理：访问日志、操作日志</p>
          <p>系统监控：在线用户、任务调度、服务监控、缓存监控</p>
          <p>支持generator生成前后端代码</p>
          <p>支持多租户管理，可自定义租户套餐、租户用户数限制等</p>
          <p>支持数据权限配置，包括全部数据、机构及子机构数据、本机构数据、本人数据和自定义数据</p>
          <p>支持多数据源、乐观锁</p>
          <p>支持缓存切换Redis和Ehcache, 默认Redis</p>
          <p>支持i18n国际化</p>
          <p>支持websocket实时通信</p>
          <p>基于quartz的任务调度</p>
          <p>API接口文档</p>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="home-card">
          <h2>前端工程</h2>
          <p>使用 Vue3 + TypeScript + Vite 开发</p>
          <p>使用 Pinia 替代 Vuex，轻量、简单、易用，集成 Pinia 持久化插件</p>
          <p>使用 TypeScript 对 Axios 整个二次封装（请求拦截、取消、常用请求封装…）</p>
          <p>支持 Element 组件大小切换、多主题布局、暗黑模式、i18n 国际化</p>
          <p>使用 VueRouter 配置动态路由权限拦截、路由懒加载，支持页面按钮权限控制</p>
          <p>使用 KeepAlive 对页面进行缓存，支持多级嵌套路由缓存</p>
          <p>常用自定义指令开发（权限、复制、水印、拖拽、节流、防抖、长按…）</p>
          <p>使用 Prettier 统一格式化代码，集成 ESLint、Stylelint 代码校验规范</p>
          <p>使用 husky、lint-staged、commitlint及vscode插件git-commit-plugin 规范提交信息</p>
          <p>使用 lunar-typescrip配置日历、农历、老黄历等</p>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="home-card">
          <h2>支持</h2>
          <p>
            如果觉得还不错，希望您可以去
            <a href="https://gitee.com/lp1791803611" target="_blank" class="text-blue-500">
              码云
            </a>
            帮作者点个 ⭐ Star，这将是对作者极大的鼓励与支持。
          </p>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="visible"
      :title="title"
      width="40%"
      :lock-scroll="false"
      center
      @close="handleClick"
    >
      <template #header>
        <div class="text-xl font-medium">
          {{ title }}
        </div>
      </template>

      <div v-html="noticeInfo?.content"></div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleClick">
            {{ $t('button.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { announcementApi } from '@/api/sys/notice';
  import { ResultEnum } from '@/enums/httpEnum';
  import useNoticeStore from '@/stores/modules/notice';
  import { isNotEmpty } from '@/utils';
  import { weatherApi } from '@/api/index';
  import WeatherForecast from '@/components/weather/weather-forecast.vue';

  const noticeStore = useNoticeStore();
  /** 是否显示公告 */
  const visible = ref(false);
  /** 公告标题 */
  const title = ref('');
  /** 公告信息 */
  const noticeInfo = ref<Notice.NoticeInfo>();
  /** 是否显示天气 */
  const weatherVisible = ref(false);
  /** 天气信息 */
  const forecastInfo = ref<Weather.WeatherForecast>();

  /**
   * @description: 获取公告
   * @return {*}
   */
  const handleAnnouncement = async () => {
    await announcementApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        noticeInfo.value = res.data;
        if (isNotEmpty(noticeInfo.value)) {
          visible.value = true && noticeStore.state.showAnnouncement;
          title.value = '公告: ' + noticeInfo.value.title;
        }
      }
    });
  };

  /**
   * @description: 关闭公告
   * @return {*}
   */
  const handleClick = () => {
    visible.value = false;
    noticeStore.state.showAnnouncement = false;
  };

  /**
   * @description: 天气预报
   * @return {*}
   */
  const handleWeather = () => {
    weatherApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        weatherVisible.value = true;
        forecastInfo.value = res.data;
      } else {
        weatherVisible.value = false;
      }
    });
  };

  onMounted(async () => {
    await handleAnnouncement();
    await handleWeather();
  });
</script>
<style lang="scss" scoped>
  .home {
    // background-image: url('../assets/images/welcome.png');
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .home-card {
    background-color: rgb(255, 255, 255, 0.85);
    margin: 10px;
    h2 {
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 10px;
    }
    p {
      padding: 3px;
    }
  }
</style>
