/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\stores\index.ts
 * @Description: 状态管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import type { App } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();
store.use(piniaPluginPersistedstate);

export const setupStore = (app: App<Element>) => {
  app.use(store);
};

export { store };
