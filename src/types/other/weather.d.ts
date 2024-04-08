/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-01 15:13:30
 * @FilePath: \aster-admin\src\types\other\weather.d.ts
 * @Description: 天气
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Weather {
  /**
   * @description: 天气预报
   * @return {*}
   */
  export interface WeatherForecast {
    // 省份名称
    province: string;
    // 城市名称
    city: string;
    // 城市编码
    adcode: string;
    // 预报发布时间
    reporttime: string;
    // 天气信息,当天及未来三天
    casts: WeatherInfo[];
  }

  /**
   * @description: 天气信息
   * @return {*}
   */
  export interface WeatherInfo {
    // 日期
    date: string;
    // 星期几
    week: string;
    // 白天天气现象
    dayweather: string;
    // 晚上天气现象
    nightweather: string;
    // 白天温度
    daytemp: string;
    // 晚上温度
    nighttemp: string;
    // 白天风向
    daywind: string;
    // 晚上风向
    nightwind: string;
    // 白天风力
    daypower: string;
    // 晚上风力
    nightpower: string;
    daytemp_float: string;
    nighttemp_float: string;
  }
}
