<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\views\home.vue
 * @Description: 首页
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="home">
    <el-scrollbar class="w-full h-full">
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
                    <div class="app-name single-line-text">{{ item.name }}</div>
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
              <el-card class="home-card-small">
                <div class="card-title pb-2px">
                  <div class="card-title--content">
                    <i class="iconfont icon-niannianyouyu"></i>
                    <span>我的本年度办理情况</span>
                  </div>
                </div>
                <div class="card-content flex justify-evenly">
                  <div class="chart-info chart-info--todo" @click="handleAnnualTaskClick('todo')">
                    <span class="font-600">{{ annualTask.todoNum }}</span>
                    <span class="pt-5px text-sm">我的待办</span>
                  </div>
                  <div
                    class="chart-info chart-info--complete"
                    @click="handleAnnualTaskClick('complete')"
                  >
                    <span class="font-600">{{ annualTask.completeNum }}</span>
                    <span class="pt-5px text-sm">我的办结</span>
                  </div>
                  <div
                    class="chart-info chart-info--started"
                    @click="handleAnnualTaskClick('started')"
                  >
                    <span class="font-600">{{ annualTask.startedNum }}</span>
                    <span class="pt-5px text-sm">我发起的</span>
                  </div>
                  <div class="chart-info chart-info--cc" @click="handleAnnualTaskClick('cc')">
                    <span class="font-600">{{ annualTask.ccNum }}</span>
                    <span class="pt-5px text-sm">抄送我的</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <!-- 我的本年度已办理件数 -->
              <el-card class="home-card-small">
                <div class="card-title">
                  <div class="card-title--content">
                    <i class="iconfont icon-shenpi"></i>
                    <span>我的本年度已办理件数</span>
                  </div>
                  <el-button type="primary" link size="small" @click="handleMoreTask">
                    更多
                  </el-button>
                </div>
                <div class="card-content--complete">
                  <div
                    class="complete-info"
                    v-for="(item, index) in _completeStatistics"
                    :key="index"
                  >
                    <el-tooltip
                      v-if="item.formName.length > 6"
                      effect="dark"
                      :content="item.formName"
                      placement="top"
                    >
                      <span class="complete-info--title single-line-text">
                        {{ item.formName }}
                      </span>
                    </el-tooltip>
                    <span v-else class="complete-info--title">
                      {{ item.formName }}
                    </span>

                    <span class="complete-info--value">{{ item.completeNum }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <!-- 我的日程 -->
          <el-card class="home-card-large">
            <div class="card-title">
              <div class="card-title--content">
                <i class="iconfont icon-rili"></i>
                <span>日程安排</span>
              </div>
              <el-button type="primary" link size="small" @click="handleMoreSchedule">
                更多
              </el-button>
            </div>
            <div class="card-content">
              <aster-calendar />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="w-full">
        <el-col :span="8">
          <!-- 通知公告 -->
          <el-card class="home-card-default">
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
        <el-col :span="8">
          <el-card class="home-card-default">
            <div class="card-title pb-2px">
              <div class="card-title--content">
                <i class="iconfont icon-test"></i>
                <span>办件时间统计</span>
              </div>
            </div>
            <div class="card-content--echarts" :style="_echartStyle">
              <aster-echarts
                ref="diskRef"
                :height="250"
                :option="operationOption"
                :resize="false"
              />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="home-card-default">
            <p>
              基于SpringBoot3、Flowable7.0、Mybatis-Plus、Vue3、ElementPlus等开发的工作流管理系统，仿钉钉设计，
              支持表单设计、流程设计、流程权限、流程管理等。
            </p>
            <p class="pt-5px">
              <span class="font-bold">演示地址：</span>
              <a href="http://flowable.aster.vip/#/" target="_blank" class="text-blue-500">
                http://flowable.aster.vip/#/
              </a>
            </p>
            <p> 超级管理员: admin/123456 </p>
            <p class="pt-5px font-bold">支持</p>
            <p>
              帮忙点个
              <a
                href="https://gitee.com/lp1791803611/aster-flowable-vue"
                target="_blank"
                class="text-blue-500"
              >
                ⭐ Star
              </a>
              ，作者更有动力。
            </p>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>

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
  import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
  import { announcementApi, noticePageApi } from '@/api/sys/notice';
  import { ResultEnum } from '@/enums/httpEnum';
  import useNoticeStore from '@/stores/modules/notice';
  import { useAppStore } from '@/stores/modules/app';
  import { isNotEmpty, getDictLabelByValue } from '@/utils';
  import { dateFormat } from '@/utils/workflow';
  import { appActiveListApi } from '@/api/workflow/app';
  import { TaskStatusEnum } from '@/enums/workFlowEnum';
  import { getTaskPageApi, getAnnualTaskApi, getCompleteStatisticskApi } from '@/api/workflow/task';
  import FormDetail from './workflow/form/form-detail.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import AsterCalendar from '@/components/calendar/index.vue';
  import AsterEcharts from '@/components/echarts/index.vue';
  import { ElMessage } from 'element-plus';

  const noticeStore = useNoticeStore();
  const appStore = useAppStore();
  const router = useRouter();

  /** 是否显示公告 */
  const visible = ref(false);
  /** 公告标题 */
  const title = ref('');
  /** 公告信息 */
  const noticeInfo = ref<Notice.NoticeInfo>();
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
    pageSize: 6,
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
  /** 已办统计列表 */
  const completeStatisticsList = ref<WorkTask.CompleteStatisticsModel[]>([]);
  /** 通知公告列表 */
  const noticeList = ref<Notice.NoticeInfo[]>();
  /** 办件统计选项 */
  const operationOption = ref<any>();

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
   * @description: 更多日程
   * @return {*}
   */
  const handleMoreSchedule = () => {
    router.push('/system/calendar');
  };

  /**
   * @description: 我的办理跳转
   * @return {*}
   */
  const handleAnnualTaskClick = (type: 'todo' | 'complete' | 'started' | 'cc') => {
    if (type === 'todo') {
      router.push('/workflow/workbench/todo');
    } else if (type === 'complete') {
      router.push('/workflow/workbench/complete');
    } else if (type === 'started') {
      router.push('/workflow/workbench/started');
    } else if (type === 'cc') {
      router.push('/workflow/workbench/ccme');
    } else {
      ElMessage.error('系统错误,请联系管理员');
    }
  };

  /**
   * @description: 首页展示的已办统计
   * @return {*}
   */
  const _completeStatistics = computed(() => {
    return completeStatisticsList.value.length > 8
      ? completeStatisticsList.value.slice(0, 6)
      : completeStatisticsList.value;
  });

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
    await appActiveListApi().then((res) => {
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
   * @description: 查询已办统计列表
   * @return {*}
   */
  const handleQueryCompleteStatistics = async () => {
    getCompleteStatisticskApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        completeStatisticsList.value = res.data;
      } else {
        completeStatisticsList.value = [];
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

  /**
   * @description: 查询办件统计
   * @return {*}
   */
  const handleQueryOperation = () => {
    operationOption.value = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: [
        {
          type: 'category',
          data: ['8点', '10点', '12点', '14点', '16点', '18点', '20点'],
          axisLine: {
            lineStyle: {
              color: '#999',
            },
          },
          axisLabel: {
            interval: 1,
          },
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitNumber: 4,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#DDD',
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333',
            },
          },
          nameTextStyle: {
            color: '#999',
          },
          splitArea: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '办件数量',
          type: 'line',
          data: [8, 36, 21, 46, 32, 20, 16],
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              colorStops: [
                {
                  offset: 0,
                  color: '#A9F387', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#48D8BF', // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
            shadowColor: 'rgba(72,216,191, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20,
          },
          itemStyle: {
            color: '#fff',
            borderWidth: 10,
            borderColor: '#A9F387',
          },
          smooth: true,
        },
      ],
      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '25%',
        containLabel: true,
      },
    };
  };

  // echarts宽度
  const _echartStyle = computed(() => {
    return {
      maxWidth: window.innerWidth / 4 + 'px',
    };
  });

  onBeforeMount(() => {
    // 查询办件统计
    handleQueryOperation();
  });

  onMounted(async () => {
    // 查询公告
    handleAnnouncement();
    // 查询应用
    handleQueryApp();
    // 查询待办
    handleQueryTodo();
    // 查询通知公告
    handleQueryNotice();
    // 查询年度办理情况
    handleQueryAnnualTask();
    // 查询已办统计
    handleQueryCompleteStatistics();
  });
</script>
<style lang="scss" scoped>
  .home {
    // background-image: url('../assets/images/welcome.png');
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }

  .home-card-small {
    height: 145px;
    margin: 5px;
  }

  .home-card-default {
    height: 265px;
    margin: 5px;
  }

  .home-card-large {
    height: 420px;
    margin: 5px;
  }

  .card-header {
    &--user {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
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
      padding: 7px 10px;
      font-size: 0.875rem;

      &--title {
        width: 60%;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      &--time {
        width: 40%;
        display: flex;
        justify-content: flex-end;
      }
    }

    .chart-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      width: 23%;
      padding: 15px 5px;
      color: var(--el-text-color-regular);
      cursor: pointer;

      &--todo {
        background-color: var(--el-color-primary-light-7);
      }

      &--complete {
        background-color: var(--el-color-success-light-7);
      }

      &--started {
        background-color: var(--el-color-warning-light-7);
      }

      &--cc {
        background-color: var(--el-color-info-light-7);
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
        width: 42px;
        height: 42px;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
        i {
          font-size: 22px;
          line-height: 42px;
          color: var(--el-color-white);
        }
      }
      .app-name {
        padding-top: 5px;
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
      }
    }
  }

  .card-content--complete {
    width: 100%;
    min-width: 250px;
    padding-top: 2px;
    display: grid;
    grid-template-columns: 33.3% 33.3% 33.3%;

    .complete-info {
      height: 40px;
      margin: 5px;
      padding: 0 5px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: var(--el-text-color-regular);
      background-color: var(--el-color-primary-light-9);

      &--title {
        width: 70%;
        font-size: 0.75rem;
        line-height: 1.5rem;
      }

      &--value {
        max-width: 30%;
        font-weight: 600;
      }
    }
  }

  .card-content--echarts {
    width: 100%;
    position: absolute;
    top: 10px;
  }
</style>
