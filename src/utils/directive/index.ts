/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-20 10:29:12
 * @FilePath: \aster-admin\src\utils\directive\index.ts
 * @Description: 全局注册自定义指令
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import type { App } from 'vue';
import { hasPerm } from './modules/hasPerm';
import copy from './modules/copy';
import debounce from './modules/debounce';
import throttle from './modules/throttle';
import longpress from './modules/longpress';
import lazy from './modules/lazy';
import waterMarker from './modules/waterMarker';

// 全局注册 directive
export function setupDirective(app: App<Element>) {
  // 使 v-hasPerm 在所有组件中都可用
  app.directive('hasPerm', hasPerm);
  // 复制指令
  app.directive('copy', copy);
  // 防抖指令
  app.directive('debounce', debounce);
  // 节流指令
  app.directive('throttle', throttle);
  // 长按指令
  app.directive('longpress', longpress);
  // 懒加载图片指令
  app.directive('lazy', lazy);
  // 水印指令
  app.directive('waterMarker', waterMarker);
}
