<!-- 模板 -->
<template>
  <div class="weather" v-if="isNotEmpty(casts)">
    <div class="weather__header">
      <span>{{ province }} - {{ city }}</span>
      <span>{{ casts[0].date }} {{ convertWeek(casts[0].week) }}</span>
    </div>
    <div class="weather__current">
      <i :class="[convertIcon(casts[0].dayweather), '!text-5xl']"></i>
      <span class="text-xs">{{ casts[0].dayweather }}</span>
      <span class="text-xl">{{ casts[0].nighttemp }} ~ {{ casts[0].daytemp }}℃</span>
      <span class="text-xs">{{ casts[0].daywind }}风 {{ casts[0].daypower }}级</span>
    </div>
    <div class="weather__forecast" v-if="casts.length > 1">
      <el-row class="py-5px" v-for="(cast, i) in casts" :key="i">
        <el-col :span="8"> {{ convertDate(cast.date, i) }} </el-col>
        <el-col :span="8">
          <i :class="convertIcon(cast.dayweather)"></i> {{ cast.dayweather }}
        </el-col>
        <el-col :span="8"> {{ cast.nighttemp }} ~ {{ cast.daytemp }}℃ </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { isEmpty, isNotEmpty } from '@/utils';
  import { ref, PropType, watch } from 'vue';

  const props = defineProps({
    forecast: {
      type: Object as PropType<Weather.WeatherForecast>,
      default: null,
    },
  });

  const province = ref('');
  const city = ref('');
  const casts = ref<Weather.WeatherInfo[]>([]);

  /**
   * @description: 获取图标
   * @param {*} dayweather
   * @return {*}
   */
  const convertIcon = (dayweather: string) => {
    let weatherIcon = 'icon-qita';
    if (dayweather == '晴') {
      weatherIcon = 'icon-qing';
    } else if (dayweather == '阴') {
      weatherIcon = 'icon-yin';
    } else if (dayweather.indexOf('云') != -1) {
      weatherIcon = 'icon-duoyun';
    } else if (dayweather.indexOf('雾') != -1) {
      weatherIcon = 'icon-wu';
    } else if (dayweather.indexOf('霾') != -1) {
      weatherIcon = 'icon-mai';
    } else if (dayweather.indexOf('雹') != -1) {
      weatherIcon = 'icon-bingbao';
    } else if (dayweather.indexOf('沙') != -1) {
      weatherIcon = 'icon-shachenbao';
    } else if (dayweather.indexOf('雷') != -1) {
      weatherIcon = 'icon-leidian';
    } else if (dayweather.indexOf('雨') != -1 && dayweather.indexOf('雪') != -1) {
      weatherIcon = 'icon-yuxue';
    } else if (dayweather.indexOf('雨') != -1) {
      weatherIcon = 'icon-xiaoyu';
    } else if (dayweather.indexOf('雪') != -1) {
      weatherIcon = 'icon-xiaoxue';
    }
    return 'iconfont ' + weatherIcon;
  };

  /**
   * @description: 转换星期
   * @param {*} week 数字字符串
   * @return {*}
   */
  const convertWeek = (week: string) => {
    let w = '';
    if (isEmpty(week)) {
      w = '';
    }

    if (week == '1') {
      w = '星期一';
    } else if (week == '2') {
      w = '星期二';
    } else if (week == '3') {
      w = '星期三';
    } else if (week == '4') {
      w = '星期四';
    } else if (week == '5') {
      w = '星期五';
    } else if (week == '6') {
      w = '星期六';
    } else if (week == '7') {
      w = '星期天';
    }
    return w;
  };

  /**
   * @description: 转换日期
   * @param {*} source 源日期
   * @param {*} index 下标
   * @return {*}
   */
  const convertDate = (source: string, index: number) => {
    if (index == 0) {
      return '今天';
    } else if (index == 1) {
      return '明天';
    } else {
      return source.slice(5);
    }
  };

  watch(
    () => props.forecast,
    (val) => {
      if (val) {
        casts.value = val.casts;
        province.value = val.province;
        city.value = val.city;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
</script>
<style scoped lang="scss">
  .weather {
    width: 100%;
    height: 100%;

    &__header {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }

    &__current {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px 0px;
    }

    &__forecast {
      display: flex;
      flex-direction: column;
      padding: 20px 10px;
    }
  }
</style>
