/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\main.ts
 * @Description: main.ts
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
// 引入windi css
import '@/plugins/windi.css';
// 引入状态管理
import { setupStore } from '@/stores';
// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus';
// 引入全局样式
import '@/assets/styles/element.scss';
// iconfont css
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont.js';
// element css
import 'element-plus/dist/index.css';
// element dark css
import 'element-plus/theme-chalk/dark/css-vars.css';
// custom element dark css
import '@/assets/styles/element-dark.scss';
// custom element css
import '@/assets/styles/element.scss';
// 自定义样式
import '@/assets/styles/common.scss';
// vue i18n
import I18n from '@/i18n/index';
// 路由
import { setupRouter } from './router';
// errorHandler
import errorHandler from '@/utils/errorHandler';
// 自定义指令
import { setupDirective } from './utils/directive';
// vxe-table
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import { createApp } from 'vue';

import App from './App.vue';
import 'virtual:windi.css';
import '@/polyfill/polyfill';

const app = createApp(App);

app.config.errorHandler = errorHandler;

// 全局注册 自定义指令(directive)
setupDirective(app);
setupStore(app);
setupElementPlus(app);
setupRouter(app);
app.use(I18n);
app.use(VXETable);
import nodeWrap from '@/views/workflow/components/process/process/nodeWrap.vue';
app.component('nodeWrap', nodeWrap); //初始化组件
import addNode from '@/views/workflow/components/process/process/addNode.vue';
app.component('addNode', addNode); //初始化组件
app.mount('#app');
