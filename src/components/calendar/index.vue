<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-10-18 14:18:52
 * @FilePath: \aster-flowable-vue\src\components\calendar\index.vue
 * @Description: 日历
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="aster-calendar">
    <div class="aster-calendar--header">
      <div class="aster-calendar--header-month">
        <i
          class="iconfont icon-xiangzuo pr-5px"
          v-show="state.viewType === 'month'"
          @click="handleSubtractDate"
        ></i>
        <span>{{ state.currentMonth }}</span>
        <i
          class="iconfont icon-xiangyou pl-5px"
          v-show="state.viewType === 'month'"
          @click="handleAddDate"
        ></i>
      </div>
      <div class="aster-calendar--header-right">
        <span class="aster-calendar--header-span mr-10px cursor-pointer" @click="handleCurrentDay">
          今天
        </span>
        <el-dropdown trigger="click" @command="setViewType">
          <span class="aster-calendar--header-span">
            {{ _viewType }}<i class="iconfont icon-xiangxia"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in state.typeOptions"
                :key="index"
                :command="item"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="aster-calendar--body" v-if="state.viewType == 'week'">
      <div class="aster-calendar--week" v-for="(item, index) in state.currentWeekList" :key="index">
        <div class="week-normal">
          <div
            :class="[item.select ? 'current-day' : '', isActiveDay(item.day) ? 'day-active' : '']"
          >
            <div class="calendar-head-item">{{ item.label }}</div>
            <div class="day" @click="dayClickHandle(item)">{{ item.day }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="aster-calendar--body-month" v-else>
      <div class="month-week">
        <div class="month-week--item" v-for="(week, index) in state.WeekNum" :key="index">
          {{ week.label }}
        </div>
      </div>
      <div class="month-day">
        <div class="month-day--item" v-for="(item, index) in state.currentMonthList" :key="index">
          <div
            class="day"
            :class="[
              val.select ? 'current-day-item' : '',
              isActiveDay(val.day) ? 'day-active' : '',
            ]"
            v-for="(val, i) in item"
            :key="i"
            @click="dayClickHandle(val)"
          >
            {{ val.day }}
          </div>
        </div>
      </div>
    </div>
    <div class="aster-calendar--footer">
      <el-scrollbar :style="_footerStyle">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in scheduleList"
            :key="index"
            :timestamp="activity.value"
          >
            {{ activity.label }}
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { isNotEmpty } from '@/utils';
  import moment from 'moment';
  import { computed, onMounted, reactive, ref } from 'vue';

  /**
   * @description: 配置
   */
  const state = reactive({
    // 切换周或者月选择器
    viewType: 'week',
    // 当前月份展示
    currentMonth: '',
    // 当前天
    currentDay: '',
    // 周数据
    currentWeekList: [],
    // 视图类型
    typeOptions: [
      { label: '周', value: 'week' },
      { label: '月', value: 'month' },
    ],
    // 月数据
    currentMonthList: [],
    // 星期
    WeekNum: [
      { label: '日', value: 0, fullName: '星期日' },
      { label: '一', value: 1, fullName: '星期一' },
      { label: '二', value: 2, fullName: '星期二' },
      { label: '三', value: 3, fullName: '星期三' },
      { label: '四', value: 4, fullName: '星期四' },
      { label: '五', value: 5, fullName: '星期五' },
      { label: '六', value: 6, fullName: '星期六' },
    ],
  } as any);

  // 日程列表
  const scheduleList = ref<CommonModel.NodeInfo[]>([]);

  /**
   * @description: 上个月
   * @return {*}
   */
  const handleSubtractDate = () => {
    const currentMonth = state.currentMonth + '01日';
    const prevMonth = moment(currentMonth, 'YYYY年MM月DD日').subtract(1, 'months');
    // 日期
    state.currentDay = '';
    state.currentMonth = prevMonth.format('YYYY年MM月');
    // 周视图
    getCurrentWeek(prevMonth.format('YYYY-MM-DD'));
    // 月视图
    getCurrentMonth(prevMonth.format('YYYY'), prevMonth.format('MM'));
  };

  /**
   * @description: 下个月
   * @return {*}
   */
  const handleAddDate = () => {
    const currentMonth = state.currentMonth + '01日';
    const nextMonth = moment(currentMonth, 'YYYY年MM月DD日').add(1, 'months');
    // 日期
    state.currentDay = '';
    state.currentMonth = nextMonth.format('YYYY年MM月');
    // 周视图
    getCurrentWeek(nextMonth.format('YYYY-MM-DD'));
    // 月视图
    getCurrentMonth(nextMonth.format('YYYY'), nextMonth.format('MM'));
  };

  /**
   * @description: 设置今天
   * @return {*}
   */
  const handleCurrentDay = () => {
    // 日期
    state.currentDay = moment().format('D');
    state.currentMonth = moment().format('YYYY年MM月');
    // 周视图
    getCurrentWeek(moment().format('YYYY-MM-DD'));
    // 月视图
    getCurrentMonth(moment().format('YYYY'), moment().format('MM'));
    // 获取日程列表
    getScheduleList(moment().format('YYYY-MM-DD'));
  };

  /**
   * @description: 设置视图类型
   * @param {*} item 类型
   * @return {*}
   */
  const setViewType = (item: any) => {
    state.viewType = item.value;
    state.currentDay = moment().format('D');
    state.currentMonth = moment().format('YYYY年MM月');
    if (item.value === 'week') {
      getCurrentWeek(moment().format('YYYY-MM-DD'));
    } else if (item.value === 'month') {
      getCurrentMonth(moment().format('YYYY'), moment().format('MM'));
    }
    // 获取日程列表
    getScheduleList(moment().format('YYYY-MM-DD'));
  };

  /**
   * @description: 日期点击事件
   * @param {*} item
   * @return {*}
   */
  const dayClickHandle = (item: any) => {
    const day = moment(state.currentMonth + item.day + '日', 'YYYY年MM月D日').format('YYYY-MM-DD');
    state.currentDay = item.day + '';
    // 查询日程列表
    getScheduleList(day);
  };

  /**
   * @description: 是否为活动日期
   * @param {*} day
   * @return {*}
   */
  const isActiveDay = (day: string) => {
    if (isNotEmpty(day) && day === state.currentDay) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @description: 获取当天数据
   * @return {*}
   */
  const getCurrentDay = () => {
    const day = moment().format('D');
    const week = moment().day();
    if (state.viewType === 'week') {
      state.currentWeekList.forEach((item) => {
        if (item.day === day) {
          item.select = true;
        } else {
          item.select = false;
        }
      });
    } else if (state.viewType === 'month') {
      state.currentMonthList.forEach((item) => {
        if (item[week].day === day) {
          item[week].select = true;
        } else {
          item.select = false;
        }
      });
    }
  };

  /**
   * @description: 获取这周的时间数据
   * @param {*} time 时间
   * @return {*}
   */
  const getCurrentWeek = (time: any) => {
    const dateTime = new Date(time);
    // 毫秒数
    const Date2 = dateTime.getTime();
    // 放置周数据
    const weekList = new Array(6);
    const day2week = ['日', '一', '二', '三', '四', '五', '六'];
    // 获取传入的time日期为星期几
    const week = dateTime.getDay();
    // 一天的毫秒数
    const dayTime = 3600 * 24 * 1000;
    for (let i = 0; i <= 6; i++) {
      weekList[i] = {
        label: day2week[i],
        day: new Date(Date2 - (week - i) * dayTime).getDate() + '',
        select: (week - i) * dayTime === 0,
      };
    }
    return weekList;
  };

  /**
   * @description: 获取当前月份数据
   * @param {*} year 年份
   * @param {*} month 月份
   * @return {*}
   */
  const getCurrentMonth = (year: any, month: any) => {
    let stratDate: any = new Date(year, month - 1, 1),
      endData: any = new Date(year, month, 1);
    let days = (endData - stratDate) / (1000 * 60 * 60 * 24);
    let list: any[] = [];
    for (let i = 1; i <= days; i++) {
      const d = i + '';
      const day = d;
      const week =
        new Date(month + '/' + i + '/' + year).getDay() == 0
          ? '日'
          : new Date(month + '/' + i + '/' + year).getDay() == 1
            ? '一'
            : new Date(month + '/' + i + '/' + year).getDay() == 2
              ? '二'
              : new Date(month + '/' + i + '/' + year).getDay() == 3
                ? '三'
                : new Date(month + '/' + i + '/' + year).getDay() == 4
                  ? '四'
                  : new Date(month + '/' + i + '/' + year).getDay() == 5
                    ? '五'
                    : new Date(month + '/' + i + '/' + year).getDay() == 6
                      ? '六'
                      : '';
      list.push({
        day,
        week,
        d,
        select: false,
      });
      state.currentMonthList = list;
    }

    // 获取某月第一天对应的星期几
    let currentIndex = state.WeekNum.findIndex(
      (item: any) => item.label == state.currentMonthList[0].week,
    );
    // 往总天数中添加currentIndex个对象用于错位
    let addList = Array.from({ length: currentIndex }).map((_, index) => {
      return {
        d: '',
        day: '',
        week: '',
        select: false,
      };
    });
    // 合并
    let mergeArr = [...addList, ...state.currentMonthList];
    let resultList: any[] = [];
    let index = 0;
    // 将数组分为长度为7的数组方便页面循环
    while (index < days) {
      resultList.push(mergeArr.slice(index, (index += 7)));
    }
    state.currentMonthList = resultList;
    if (state.currentMonthList[state.currentMonthList.length - 1].length < 7) {
      do {
        state.currentMonthList[state.currentMonthList.length - 1].push({
          d: '',
          day: '',
          week: '',
          select: false,
        });
      } while (state.currentMonthList[state.currentMonthList.length - 1].length < 7);
    }
    getCurrentDay();
  };

  /**
   * @description: 获取日程列表
   * @return {*}
   */
  const getScheduleList = (day: string) => {
    console.log('scheduleList--->', day);
    scheduleList.value = [
      { label: '00:00 - 23:59', value: '全天值班' },
      { label: '10:30 - 11:00', value: '部门工作周报提交' },
      { label: '14:00 - 15:00', value: '参加月度总结项目会议' },
      { label: '15:30 - 16:30', value: '关于公开征求《市财政专项资金管理的实施意见》' },
    ];
  };

  /**
   * @description: 视图类型
   * @return {*}
   */
  const _viewType = computed(() => {
    return state.typeOptions.find((item) => item.value === state.viewType)?.label;
  });

  /**
   * @description: 底部样式
   * @return {*}
   */
  const _footerStyle = computed(() => {
    return state.viewType === 'week' ? { height: '250px' } : { height: '120px' };
  });

  onMounted(() => {
    state.currentDay = moment().format('D');
    state.currentMonth = moment().format('YYYY年MM月');
    state.currentWeekList = getCurrentWeek(moment().toDate());
    // 查询日程列表
    getScheduleList(moment().format('YYYY-MM-DD'));
  });
</script>
<style scoped lang="scss">
  .aster-calendar--header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;

    &-month {
      padding: 2px 5px;
      border-radius: 5px;
      font-size: 0.875rem;
      line-height: 1.2rem;
      color: var(--el-text-color-placeholder);
      i {
        font-size: 0.875rem !important;
        cursor: pointer;
      }
    }

    &-span {
      padding: 2px 5px;
      border-radius: 5px;
      font-size: 0.875rem;
      line-height: 1.2rem;
      color: var(--el-text-color-placeholder);
      background-color: var(--el-color-primary-light-9);
      border: 1px solid var(--el-color-primary-light-7);
    }

    &-right {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .aster-calendar--body {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .aster-calendar--body-month {
    width: 100%;
  }

  .aster-calendar--footer {
    padding-top: 5px;
  }

  .aster-calendar--week {
    position: relative;
    width: 7%;
    height: 5em;
    text-align: center;
    line-height: 35px;

    &:not(:last-child) {
      margin-right: 1px;
    }
    .week-normal {
      height: 30px;
      color: var(--el-text-color-regular);
      align-items: center;
      justify-content: space-around;
    }
    .current-day {
      background-color: var(--el-color-primary-light-3);
      width: 100%;
      border-radius: 20px 20px 20px 20px;
      height: 230%;
      color: #ffffff;
    }
    .day {
      font-size: 14px;
      font-weight: 600;
      padding-bottom: 1%;
      cursor: pointer;
    }
  }

  .month-week {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 1.5%;

    &--item {
      position: relative;
      width: 7%;
      height: 2em;
      text-align: center;
      line-height: 35px;
    }
  }

  .month-day {
    &--item {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      .day {
        text-align: center;
        width: 20%;
        margin-bottom: 1.2%;
        cursor: pointer;
        height: 2em;
        line-height: 2em;
        color: var(--el-text-color-regular);
        font-size: 14px;
        font-weight: 600;
      }
      .current-day-item {
        background-color: var(--el-color-primary-light-3);
        border-radius: 20px 20px 20px 20px;
        color: #ffffff;
      }
    }
  }

  .day-active {
    border: 1px solid var(--el-color-primary-light-3);
  }
</style>
