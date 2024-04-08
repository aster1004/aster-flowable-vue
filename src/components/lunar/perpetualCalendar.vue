<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-07 14:37:40
 * @FilePath: \aster-flowable-vue\src\components\lunar\perpetualCalendar.vue
 * @Description: 万年历
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="calendar">
    <div class="container">
      <div class="bar">
        <div style="width: 50px">
          <el-select v-model="state.year">
            <el-option v-for="i in years" :key="i" :label="`${i}年`" :value="i" />
          </el-select>
        </div>
        <div>
          <el-select v-model="state.month">
            <el-option v-for="i in 12" :key="i" :label="`${i}月`" :value="i" />
          </el-select>
        </div>
        <div>
          <el-select v-model="state.holidayMonth">
            <el-option :value="0" label="假期" />
            <el-option
              v-for="(h, i) in state.holidays"
              :key="i"
              :label="h.name"
              :value="`${h.month},${i}`"
            />
          </el-select>
        </div>
        <div>
          <div class="button" @click="onBack">返回今天</div>
        </div>
      </div>
      <ul class="head">
        <li v-for="(head, index) in state.data.heads" :key="index">{{ head }}</li>
      </ul>
      <ul class="body">
        <li v-for="(week, index) in state.data.weeks" :key="index">
          <ol>
            <li
              @click="onSelect(day)"
              v-for="day in week.days"
              :key="day.day"
              :class="{
                today: day.isToday,
                selected: day.isSelected,
                other: day.month != state.month,
                rest: day.isRest,
                holiday: day.isHoliday,
              }"
            >
              <div class="inner">
                <b>{{ day.day }}</b>
                <i>{{ day.desc }}</i>
                <u v-if="day.isHoliday">{{ day.isRest ? '休' : '班' }}</u>
              </div>
            </li>
          </ol>
        </li>
      </ul>
    </div>
    <div class="side">
      <div class="ymd">{{ state.selected.ymd }}</div>
      <div class="day">{{ state.selected.day }}</div>
      <div class="lunar">
        <div>{{ state.selected.lunarMonth }}月 {{ state.selected.lunarDay }}</div>
        <div>{{ state.selected.yearGanZhi }}年 {{ state.selected.yearShengXiao }}</div>
        <div>{{ state.selected.monthGanZhi }}月 {{ state.selected.dayGanZhi }}日</div>
      </div>
      <div class="festival" v-for="(f, i) in state.selected.festivals" :key="i">
        {{ f }}
      </div>
      <div class="yiji">
        <div class="yi">
          <b>宜</b>
          <div v-for="(f, i) in state.selected.yi" :key="i">
            {{ f }}
          </div>
        </div>
        <div class="ji">
          <b>忌</b>
          <div v-for="(f, i) in state.selected.ji" :key="i">
            {{ f }}
          </div>
        </div>
      </div>
      <div class="btn" @click="to_detail()"> 查看详情 </div>
    </div>

    <el-drawer
      v-model="showDrawer"
      :title="$t('calendar.almanac')"
      direction="rtl"
      :show-close="true"
      size="80%"
    >
      <almanac ref="almanacRef" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, watch, onMounted, computed } from 'vue';
  import { Solar, SolarMonth, SolarWeek, HolidayUtil } from 'lunar-typescript';
  import almanac from '@/components/lunar/almanac.vue';
  import { useGlobalStore } from '@/stores/modules/global';

  const globalStore = useGlobalStore();

  const language = computed(() => globalStore.language);

  const now = Solar.fromDate(new Date());

  const years = ref<number[]>([]);
  const almanacRef = ref();
  const showDrawer = ref(false);

  onMounted(() => {
    for (let i = 1900; i < 2100; i++) {
      years.value.push(i);
    }
  });

  class Day {
    public month: number = 0;
    public day: number = 0;
    public lunarDay: string = '';
    public lunarMonth: string = '';
    public yearGanZhi: string = '';
    public yearShengXiao: string = '';
    public monthGanZhi: string = '';
    public dayGanZhi: string = '';
    public ymd: string = '';
    public desc: string = '';
    public isToday: boolean = false;
    public isSelected: boolean = false;
    public isRest: boolean = false;
    public isHoliday: boolean = false;
    public festivals: string[] = [];
    public yi: string[] = [];
    public ji: string[] = [];
  }

  class Week {
    public days: Day[] = [];
  }

  class Month {
    public heads: string[] = [];
    public weeks: Week[] = [];
  }

  class Holiday {
    public name: string = '';
    public month: number = 0;
  }

  const state = reactive({
    year: now.getYear(),
    month: now.getMonth(),
    weekStart: 1,
    selected: new Day(),
    data: new Month(),
    holidays: new Array<Holiday>(),
    holidayMonth: 0,
  });

  function buildDay(d: Solar) {
    const ymd = d.toYmd();
    const lunar = d.getLunar();
    const day = new Day();
    day.month = d.getMonth();
    day.day = d.getDay();
    day.lunarMonth = lunar.getMonthInChinese();
    day.lunarDay = lunar.getDayInChinese();
    day.yearGanZhi = lunar.getYearInGanZhi();
    day.yearShengXiao = lunar.getYearShengXiao();
    day.monthGanZhi = lunar.getMonthInGanZhi();
    day.dayGanZhi = lunar.getDayInGanZhi();
    day.ymd = ymd;
    day.isToday = ymd == now.toYmd();
    day.isSelected = ymd == state.selected.ymd;
    if (day.isToday && state.selected.day === 0) {
      state.selected = day;
    }
    const solarFestivals = d.getFestivals();
    solarFestivals.forEach((f) => {
      day.festivals.push(f);
    });
    d.getOtherFestivals().forEach((f) => {
      day.festivals.push(f);
    });
    lunar.getFestivals().forEach((f) => {
      day.festivals.push(f);
    });
    lunar.getOtherFestivals().forEach((f) => {
      day.festivals.push(f);
    });
    let rest = false;
    if (d.getWeek() === 6 || d.getWeek() === 0) {
      rest = true;
    }
    const holiday = HolidayUtil.getHoliday(ymd);
    if (holiday) {
      rest = !holiday.isWork();
    }
    day.isHoliday = !!holiday;
    day.isRest = rest;
    day.yi = lunar.getDayYi();
    day.ji = lunar.getDayJi();
    let desc = lunar.getDayInChinese();
    const jq = lunar.getJieQi();
    if (jq) {
      desc = jq;
    } else if (lunar.getDay() === 1) {
      desc = lunar.getMonthInChinese() + '月';
    } else if (solarFestivals.length > 0) {
      const f = solarFestivals[0];
      if (f.length < 4) {
        desc = f;
      }
    }
    day.desc = desc;
    return day;
  }

  function render() {
    const month = new Month();
    const weeks: SolarWeek[] = [];
    const solarWeeks = SolarMonth.fromYm(
      parseInt(state.year + '', 10),
      parseInt(state.month + '', 10),
    ).getWeeks(state.weekStart);
    solarWeeks.forEach((w) => {
      weeks.push(w);
    });
    while (weeks.length < 6) {
      weeks.push(weeks[weeks.length - 1].next(1, false));
    }
    weeks.forEach((w) => {
      const week = new Week();
      const heads: string[] = [];
      w.getDays().forEach((d) => {
        heads.push(d.getWeekInChinese());
        week.days.push(buildDay(d));
      });
      month.heads = heads;
      month.weeks.push(week);
    });
    state.data = month;
    const holidays: Holiday[] = [];
    HolidayUtil.getHolidays(state.year).forEach((h) => {
      const holiday = new Holiday();
      holiday.name = h.getName();
      holiday.month = parseInt(h.getTarget().substring(5, 7), 10);
      const exists = holidays.some((a) => {
        return a.name == holiday.name;
      });
      if (!exists) {
        holidays.push(holiday);
      }
    });
    state.holidays = holidays;
  }

  function onSelect(day: Day) {
    state.selected = day;
  }

  function onBack() {
    state.holidayMonth = 0;
    state.year = now.getYear();
    state.month = now.getMonth();
    state.selected = buildDay(now);
  }

  const to_detail = () => {
    showDrawer.value = true;
    setTimeout(() => {
      almanacRef.value.init(state.year, state.month, state.selected.day, language.value);
    }, 500);
  };

  render();

  watch(
    () => state.year,
    () => {
      render();
    },
  );

  watch(
    () => state.month,
    () => {
      render();
    },
  );

  watch(
    () => state.selected,
    () => {
      render();
    },
  );

  watch(
    () => state.holidayMonth,
    (newVal: any) => {
      if (newVal != 0 && newVal.indexOf(',') != -1) {
        const month = newVal.split(',')[0];
        const m = parseInt(month + '', 10);
        if (m > 0) {
          state.month = m;
          render();
        }
      }
    },
  );
</script>
<style lang="scss" scoped>
  .calendar * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .calendar {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    margin: 0;
    box-sizing: border-box;
    border: 2px solid #219cfb;
    display: flex;
    height: 465px;
    overflow: hidden;

    .container {
      padding-top: 14px;
      background-color: rgba(255, 255, 255, 0.2);

      .bar {
        position: relative;
        display: flex;
        height: 30px;
        padding: 0 10px;
        margin-bottom: 24px;

        div {
          position: relative;
          flex: 1;
        }

        div.button {
          position: absolute;
          right: 0;
          width: 68px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: #f5f5f6;
          border-radius: 6px;
          color: #333;
          cursor: pointer;
          font-size: 13px;
        }

        input,
        select {
          border: 1px solid #d7d9e0;
          box-sizing: border-box;
          padding: 7px;
          border-radius: 6px;
          line-height: 1;
          cursor: pointer;
          position: relative;
          background: #ffffff;
          width: 80px;
          margin-right: 6px;
          text-align: center;
          font-size: 14px;
        }

        select {
          appearance: none;
        }
      }

      ul,
      ol {
        list-style: none;
        width: 448px;
      }

      ul.head {
        li {
          float: left;
          width: 64px;
          height: 36px;
          font-size: 13px;
        }
      }

      ul.body {
        ol {
          li {
            float: left;
            width: 64px;
            position: relative;
            height: 60px;
            padding: 2px;
            cursor: pointer;

            div.inner {
              padding: 4px;
              border-radius: 6px;
              border: 2px solid transparent;

              b {
                display: block;
                font-weight: normal;
                height: 22px;
                font-size: 18px;
                color: #000;
              }

              i {
                display: block;
                font-style: normal;
                color: #333;
                font-size: 12px;
              }

              u {
                position: absolute;
                text-decoration: none;
                left: 7px;
                top: 7px;
                color: #626675;
                font-size: 12px;
                line-height: 12px;
              }
            }
          }

          li.other {
            filter: alpha(opacity=40);
            opacity: 0.4;
          }

          li:hover {
            div.inner {
              border: 2px solid #fd726d;
            }
          }

          li.selected {
            div.inner {
              border: 2px solid #fd726d;
            }
          }

          li.holiday {
            div.inner {
              background: #f5f5f6;
            }
          }

          li.holiday.rest {
            div.inner {
              background: #fde3e4;
            }
          }

          li.rest {
            div.inner {
              b {
                color: #f73131;
              }

              u {
                color: #f73131;
              }
            }
          }

          li.today {
            div.inner {
              background-color: #fd726d;
            }
          }
        }
      }
    }

    .side {
      background: #219cfb;
      width: 120px;
      color: #fff;
      position: relative;

      .ymd {
        line-height: 45px;
        font-size: 13px;
      }

      .day {
        position: relative;
        width: 80px;
        height: 80px;
        margin: 0 auto;
        line-height: 80px;
        font-size: 52px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 12px;
      }

      .lunar {
        margin-top: 6px;

        div {
          font-size: 13px;
          line-height: 21px;
        }
      }

      .festival {
        position: relative;
        margin-top: 13px;
        padding-left: 22px;
        padding-right: 14px;
        text-align: justify;
        color: #fff;
        font-size: 12px;
        line-height: 16px;
      }

      .festival::before {
        content: '';
        position: absolute;
        top: 6px;
        left: 16px;
        width: 3px;
        height: 3px;
        background: #fff;
        border-radius: 50%;
      }

      .yiji {
        position: relative;
        margin-top: 12px;
        padding-top: 12px;
        background: rgba(255, 255, 255, 0.15);
        overflow: hidden;

        .yi {
          float: left;
          width: 50%;

          div {
            font-size: 12px;
            line-height: 20px;
          }
        }

        .ji {
          float: right;
          width: 50%;

          div {
            font-size: 12px;
            line-height: 20px;
          }
        }

        b {
          display: block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin: 0 auto;
          font-style: normal;
          font-size: 24px;
          color: #fff;
        }
      }

      .btn {
        position: absolute;
        width: 100%;
        bottom: 0;
        font-size: 13px;
        padding: 5px;
        color: #fff;
        background-color: #219cfb;
      }
    }
  }

  :deep(.el-select) {
    width: 100px;
  }
</style>
