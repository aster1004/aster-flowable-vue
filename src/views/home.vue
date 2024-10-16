<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\views\home.vue
 * @Description: 首页
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="home">
    <el-row
      v-if="!userStore.isSuperAdmin"
      :gutter="20"
      class="!flex justify-between w-full h-full mt-4"
    >
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
              href="https://gitee.com/lp1791803611/aster-flowable"
              target="_blank"
              class="text-blue-500"
            >
              https://gitee.com/lp1791803611/aster-flowable
            </a>
          </p>
          <p>
            前端地址：
            <a
              href="https://gitee.com/lp1791803611/aster-flowable-vue"
              target="_blank"
              class="text-blue-500"
            >
              https://gitee.com/lp1791803611/aster-flowable-vue
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

    <div v-else class="w-full h-full">
      <el-row :gutter="10" class="w-full">
        <el-col :span="16">
          <el-row :gutter="10">
            <el-col :span="12">
              <!-- 我的应用 -->
              <el-card class="home-card-default">
                <div class="card-title">
                  <div class="card-title--content">
                    <i class="iconfont icon-caidan"></i>
                    <span>我的应用</span>
                  </div>
                  <el-button type="primary" link size="small" @click="handleMoreApp">
                    更多
                  </el-button>
                </div>
                <div class="card-content--app">
                  <div class="app-info" v-for="(item, index) in appList" :key="index">
                    <div
                      class="app-icon"
                      @click="handleAppClick(item.id)"
                      :style="{ backgroundColor: item.iconColor }"
                    >
                      <i :class="['iconfont', item.icon]"></i>
                    </div>
                    <div class="app-name">{{ item.name }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <!-- 我的待办 -->
              <el-card class="home-card-default">
                <div class="card-title">
                  <div class="card-title--content">
                    <i class="iconfont icon-liucheng"></i>
                    <span>我的待办</span>
                  </div>
                  <el-button type="primary" link size="small" @click="handleMoreTask">
                    更多
                  </el-button>
                </div>
                <div class="card-content">
                  <div class="list-info" v-for="(item, index) in todoList" :key="index">
                    <div class="list-info--title single-line-text" @click="handleTaskClick(item)">
                      {{ item.dataTitle }}
                    </div>
                    <div class="list-info--time">
                      {{ dateFormat(item.createTime || '', 'MM-DD HH:mm') }}
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <!-- 我的本年度办理情况 -->
              <el-card class="home-card-little">
                <div class="card-title">
                  <div class="card-title--content">
                    <i class="iconfont icon-niannianyouyu"></i>
                    <span>我的本年度办理情况</span>
                  </div>
                  <el-button type="primary" link size="small" @click="handleMoreTask">
                    更多
                  </el-button>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <!-- 我的日程 -->
          <el-card class="home-card-large">
            <div class="card-title">
              <div class="card-title--content">
                <i class="iconfont icon-rili"></i>
                <span>我的日程</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="w-full">
        <el-col :span="8">
          <!-- 我的应用 -->
          <el-card class="home-card-small">
            <div class="card-title">
              <div class="card-title--content">
                <i class="iconfont icon-xiaoxizhongxin"></i>
                <span>通知公告</span>
              </div>
              <el-button type="primary" link size="small" @click="handleMoreNotice">
                更多
              </el-button>
            </div>
            <div class="card-content">
              <div class="list-info" v-for="(item, index) in noticeList" :key="index">
                <div class="list-info--title single-line-text" @click="handleNoticeClick(item)">
                  <dict-tag dict-type="notice_type" :value="item.type" />{{ item.title }}
                </div>
                <div class="list-info--time">
                  {{ dateFormat(item.createTime || '', 'MM-DD HH:mm') }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">1</el-col>
        <el-col :span="8">2</el-col>
      </el-row>
    </div>

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

    <form-detail ref="formDetailRef" @resetQuery="handleQueryTodo" />
  </div>
</template>
<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { onMounted, reactive, ref } from 'vue';
  import { announcementApi, noticePageApi } from '@/api/sys/notice';
  import { ResultEnum } from '@/enums/httpEnum';
  import useNoticeStore from '@/stores/modules/notice';
  import { useUserStore } from '@/stores/modules/user';
  import { useAppStore } from '@/stores/modules/app';
  import { isNotEmpty, getDictLabelByValue } from '@/utils';
  import { dateFormat } from '@/utils/workflow';
  import { weatherApi } from '@/api/index';
  import { appListApi } from '@/api/workflow/app';
  import WeatherForecast from '@/components/weather/weather-forecast.vue';
  import { TaskStatusEnum } from '@/enums/workFlowEnum';
  import { getTaskPageApi, getAnnualTaskApi } from '@/api/workflow/task';
  import FormDetail from './workflow/form/form-detail.vue';
  import DictTag from '@/components/dict/dict-tag.vue';

  const noticeStore = useNoticeStore();
  const userStore = useUserStore();
  const appStore = useAppStore();

  // 路由
  const router = useRouter();

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
  /** 应用集合 */
  const appList = ref<WorkApp.AppInfo[]>();
  /** 待办查询条件 */
  const todoParams = reactive<WorkTask.TaskQuery>({
    title: '',
    userId: '',
    appId: '',
    formCode: '',
    startTime: '',
    endTime: '',
    status: TaskStatusEnum.TODO,
    pageNum: 1,
    pageSize: 7,
  });
  /** 待办列表 */
  const todoList = ref<WorkTask.TaskNodeModel[]>();
  /** 注册组件 */
  const formDetailRef = ref();
  /** 通知公告参数 */
  const noticeParams = reactive<Notice.NoticeParams>({
    title: '',
    type: '',
    status: '',
    pageNum: 1,
    pageSize: 8,
  });
  /** 我的年度办理情况 */
  const annualTask = ref<WorkTask.AnnualTaskModel>({
    todoNum: 0,
    completeNum: 0,
    startedNum: 0,
    ccNum: 0,
  });
  /** 通知公告列表 */
  const noticeList = ref<Notice.NoticeInfo[]>();

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
  const handleWeather = async () => {
    await weatherApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        weatherVisible.value = true;
        forecastInfo.value = res.data;
      } else {
        weatherVisible.value = false;
      }
    });
  };

  /**
   * @description: 更多应用
   * @return {*}
   */
  const handleMoreApp = () => {
    router.push({
      path: '/workflow/workbench',
    });
  };

  /**
   * @description: 跳转流程实例列表
   * @param {*} appId 应用ID
   * @return {*}
   */
  const handleAppClick = (appId?: string) => {
    router.push({
      path: '/workflow/workbench/instance-list',
      query: {
        appId: appId,
      },
    });
  };

  /**
   * @description: 更多待办
   * @return {*}
   */
  const handleMoreTask = () => {
    router.push('/workflow/workbench/todo');
  };

  /**
   * @description: 待办跳转
   * @param {WorkTask.TaskNodeModel} task
   * @return {*}
   */
  const handleTaskClick = (task: WorkTask.TaskNodeModel) => {
    const code = task.formCode;
    const procInstId = task.procInstId;
    formDetailRef.value.getInstanceInfoByInstanceId(code, procInstId);
  };

  /**
   * @description: 更多公告
   * @return {*}
   */
  const handleMoreNotice = () => {
    router.push('/system/notice');
  };

  /**
   * @description: 公告详情
   * @param {Notice.NoticeInfo} notice
   * @return {*}
   */
  const handleNoticeClick = (notice: Notice.NoticeInfo) => {
    noticeInfo.value = notice;
    visible.value = true;
    const dictLabel = getDictLabelByValue(appStore.dictList, 'notice_type', notice.type);
    title.value = dictLabel + (dictLabel ? ': ' : '') + noticeInfo.value.title;
  };

  /**
   * 查询应用信息
   */
  const handleQueryApp = async () => {
    await appListApi({}).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        if (res.data.length > 12) {
          appList.value = res.data.slice(0, 12);
        } else {
          appList.value = res.data;
        }
      }
    });
  };

  /**
   * @description: 查询待办列表
   * @return {*}
   */
  const handleQueryTodo = async () => {
    await getTaskPageApi(todoParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        todoList.value = res.data.list;
      } else {
        todoList.value = [];
      }
    });
  };

  /**
   * @description: 查询年度办理情况
   * @return {*}
   */
  const handleQueryAnnualTask = async () => {
    getAnnualTaskApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        annualTask.value = res.data;
      } else {
        annualTask.value = { todoNum: 0, completeNum: 0, startedNum: 0, ccNum: 0 };
      }
    });
  };

  /**
   * @description: 查询公告列表
   * @return {*}
   */
  const handleQueryNotice = async () => {
    await noticePageApi(noticeParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        noticeList.value = res.data.list;
      } else {
        noticeList.value = [];
      }
    });
  };

  onMounted(async () => {
    await handleAnnouncement();
    if (userStore.isSuperAdmin) {
      await handleWeather();
    }
    // else {
    // 查询应用
    await handleQueryApp();
    // 查询待办
    await handleQueryTodo();
    // 查询公告
    await handleQueryNotice();
    // 查询年度办理情况
    await handleQueryAnnualTask();
    // }
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

  .home-card-little {
    height: 110px;
    margin: 5px;
  }

  .home-card-small {
    height: 260px;
    margin: 5px;
  }

  .home-card-default {
    height: 300px;
    margin: 5px;
  }

  .home-card-large {
    height: 420px;
    margin: 5px;
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.2rem;

    &--content {
      text-align: center;
      line-height: 1;
      i {
        font-size: 0.75rem !important;
        color: var(--el-color-white);
        text-align: center;
        border-radius: 50%;
        padding: 3px;
        background-color: $primary-color;
      }
      span {
        padding-left: 5px;
        font-weight: 600;
      }
    }
  }

  .card-content {
    width: 100%;
    padding: 10px 10px;

    .list-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      font-size: 0.875rem;

      &--title {
        width: 70%;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      &--time {
        width: 30%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .card-content--app {
    width: 100%;
    min-width: 250px;
    padding: 5px 10px;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;

    .app-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 5px;

      .app-icon {
        width: 50px;
        height: 50px;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
        i {
          font-size: 35px;
          color: var(--el-color-white);
        }
      }
      .app-name {
        padding-top: 5px;
        font-size: 0.875rem;
      }
    }
  }
</style>
