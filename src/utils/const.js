/*
 * @Date: 2023-03-29 15:25:37
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:52:38
 * @FilePath: /Workflow-Vue3/src/utils/const.js
 */

/**
 * 节点的颜色和图标配置
 */
export const nodeConfig = [
  { color: '#576A95', icon: 'node-icon iconfont icon-yonghu' }, //0、发起人
  { color: '#FF9B26', icon: 'node-icon iconfont icon-shenpi' }, //1、审批人
  { color: '#409EFF', icon: 'node-icon iconfont icon-chaosongwode' }, //2、抄送人
  { color: '#67C23A', icon: 'node-icon iconfont icon-bumen' }, //3、排他网关
  { color: '#576A95', icon: 'node-icon iconfont icon-shenpi' }, //4、网关
  { color: '#E6A23C', icon: 'node-icon iconfont icon-jiekou' }, //5、并行网关
  { color: '#345DA2', icon: 'node-icon iconfont icon-liucheng1' }, //6、包容网关
  { color: '#c96bff', icon: 'node-icon iconfont icon-ziliucheng' }, //7、网关聚合
  { color: '#c96bff', icon: 'node-icon iconfont icon-ziliucheng' }, //8、子流程
];

export let placeholderList = ['发起人', '审核人', '抄送人'];

export let setTypes = [
  { value: 1, label: '指定成员' },
  { value: 2, label: '主管' },
  { value: 4, label: '发起人自选' },
  { value: 5, label: '发起人自己' },
  { value: 7, label: '连续多级主管' },
];

export let selectModes = [
  { value: 1, label: '选一个人' },
  { value: 2, label: '选多个人' },
];

export let selectRanges = [
  { value: 1, label: '全公司' },
  { value: 2, label: '指定成员' },
  { value: 3, label: '指定角色' },
];

export let optTypes = [
  { value: '1', label: '小于' },
  { value: '2', label: '大于' },
  { value: '3', label: '小于等于' },
  { value: '4', label: '等于' },
  { value: '5', label: '大于等于' },
  { value: '6', label: '介于两个数之间' },
];

export let opt1s = [
  { value: '<', label: '<' },
  { value: '≤', label: '≤' },
];
