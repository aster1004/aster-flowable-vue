/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-13 16:16:07
 * @FilePath: \aster-admin\src\config\nprogress.ts
 * @Description: 进度条
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

export default NProgress;
