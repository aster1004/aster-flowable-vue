<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-04 09:55:36
 * @FilePath: \aster-flowable-vue\src\views\monitor\server\server-echarts.vue
 * @Description: 服务监控图表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="server-echarts">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <aster-echarts ref="cpuRef" :height="250" :option="cpuOption" :resize="false" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <aster-echarts ref="memRef" :height="250" :option="memOption" :resize="false" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <aster-echarts ref="jvmRef" :height="250" :option="jvmOption" :resize="false" />
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <aster-echarts ref="diskRef" :height="250" :option="diskOption" :resize="false" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
  import { ECOption } from '@/components/echarts/config';
  import AsterEcharts from '@/components/echarts/index.vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    cpuUsage: {
      type: Number,
      default: 0,
    },
    memUsage: {
      type: Number,
      default: 0,
    },
    jvmUsage: {
      type: Number,
      default: 0,
    },
    diskUsage: {
      type: Number,
      default: 0,
    },
  });

  // cpu
  const cpuOption = {
    series: [
      {
        type: 'gauge',
        radius: '90%',
        detail: {
          formatter: '{value}%',
        },
        data: [
          {
            value: props.cpuUsage,
            name: 'CPU使用率',
            title: {
              offsetCenter: ['0', '80%'],
            },
            detail: {
              fontSize: 20,
              offsetCenter: [0, '30%'],
              color: 'rgb(159,163,241)',
            },
          },
        ],
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [
                1,
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0.1,
                    color: '#30D27C',
                  },
                  {
                    offset: 0.6,
                    color: '#0B95FF',
                  },
                  {
                    offset: 1,
                    color: '#FFC600',
                  },
                ]),
              ],
            ],
          },
        },
      },
    ],
  } as ECOption;

  // mem
  const memOption = {
    title: {
      text: '内存使用率',
      top: '60%',
      left: 'center',
      textStyle: {
        fontSize: 16,
        color: '#bcbfff',
      },
    },
    series: [
      {
        name: 'CPU分配率 内圈',
        center: ['50%', '50%'],
        radius: ['74%', '75%'],
        clockwise: false,
        emphasis: {
          scale: false,
        },
        type: 'pie',
        data: [
          {
            value: props.memUsage,
            name: '',
            label: {
              show: true,
              formatter: '{d} %',
              fontSize: 18,
              fontWeight: 'bold',
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: '#5886f0',
              borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#00a2ff',
                },
                {
                  offset: 1,
                  color: '#70ffac',
                },
              ]),
              borderWidth: 10,
            },
            emphasis: {
              itemStyle: {
                color: '#5886f0',
                borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#85b6b2',
                  },
                  {
                    offset: 1,
                    color: '#6d4f8d',
                  },
                ]),
                borderWidth: 10,
              },
            },
          },
          {
            name: ' ',
            value: 100 - props.memUsage,
            itemStyle: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
              color: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0,0,0,0)',
              borderWidth: 0,
            },
            emphasis: {
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
              },
            },
          },
        ],
      },
      {
        name: 'CPU分配率 外圈',
        center: ['50%', '50%'],
        radius: ['89%', '90%'],
        clockwise: false,
        emphasis: {
          scale: false,
        },
        type: 'pie',
        data: [
          {
            value: props.memUsage,
            name: '',
            label: {
              show: true,
              formatter: '{d} %',
              fontSize: 18,
              fontWeight: 'bold',
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: '#5886f0',
              borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#00a2ff',
                },
                {
                  offset: 1,
                  color: '#70ffac',
                },
              ]),
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                color: '#5886f0',
                borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#85b6b2',
                  },
                  {
                    offset: 1,
                    color: '#6d4f8d',
                  },
                ]),
                borderWidth: 1,
              },
            },
          },
          {
            name: ' ',
            value: 100 - props.memUsage,
            itemStyle: {
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
              color: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0,0,0,0)',
              borderWidth: 0,
            },
            emphasis: {
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
              },
            },
          },
        ],
      },
    ],
  } as ECOption;

  // jvm
  const jvmData = [
    (props.jvmUsage / 100).toFixed(4),
    {
      value: (props.jvmUsage / 100).toFixed(4),
      direction: 'left',
    },
  ];

  const jvmOption = {
    title: {
      text: props.jvmUsage + '%' + '\n \n' + 'JVM使用率',
      textStyle: {
        fontSize: 22,
        fontFamily: 'Microsoft Yahei',
        fontWeight: 'normal',
        color: 'rgba(0,0,0,0.39)',
        rich: {
          a: {
            fontSize: 22,
          },
        },
      },
      x: 'center',
      y: '35%',
    },
    series: [
      {
        type: 'liquidFill',
        radius: '80%',
        center: ['50%', '50%'],
        data: jvmData,
        color: 'rgba(68, 145, 253, .25)',
        backgroundStyle: {
          borderWidth: 10,
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0.5,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: 'rgba(58, 71, 212, 0)',
              },
              {
                offset: 0.5,
                color: 'rgba(31, 222, 225, .2)',
              },
              {
                offset: 0,
                color: 'rgba(31, 222, 225, 1)',
              },
            ],
          },
        },
        label: {
          formatter: '',
        },
        outline: {
          show: false,
        },
      },
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['90%', '85%'],
        emphasis: {
          scale: false,
        },
        data: [
          {
            name: '',
            value: props.jvmUsage,
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: '#59D19C',
            },
            emphasis: {
              labelLine: {
                show: false,
              },
              itemStyle: {
                color: '#5886f0',
              },
            },
          },
          {
            //画剩余的刻度圆环
            name: '',
            value: 100 - props.jvmUsage,
            itemStyle: {
              color: 'rgba(69, 229, 155, 0.48)',
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              labelLine: {
                show: false,
              },
              itemStyle: {
                color: '#ffffff',
              },
            },
          },
        ],
      },
    ],
  } as ECOption;

  const diskOption = {
    backgroundColor: '',
    title: {
      show: true,
      x: 'center',
      y: '85%',
      text: '磁盘使用率',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bolder',
        fontStyle: 'normal',
        color: '#6eba44',
      },
    },
    series: [
      {
        name: '磁盘使用率',
        type: 'gauge',
        splitNumber: 10, //刻度数量
        min: 0,
        max: 100,
        radius: '90%', //图表尺寸
        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            shadowBlur: 0,
            color: [
              [0.2, '#6eba44'],
              [0.8, '#6eba44'],
              [1, '#6eba44'],
            ],
          },
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#6eba44',
            width: 1,
          },
          splitNumber: 5,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#6eba44',
          },
        },
        axisLabel: {
          distance: 0,
          color: '#6eba44',
          fontSize: '16',
          formatter: function (e) {
            return e;
          },
        },
        pointer: {
          show: true,
        },
        detail: {
          offsetCenter: [0, 40],
          fontSize: 22,
          color: '#6eba44',
          formatter: props.diskUsage + '%',
        },
        data: [
          {
            value: props.diskUsage,
          },
        ],
      },
    ],
  } as ECOption;
</script>
<style scoped lang="scss"></style>
