/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 10:54:03
 * @FilePath: \aster-flowable-vue\src\stores\modules\app.ts
 * @Description: 字典/盐
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { AppState } from '@/stores/interface';
import piniaPersistConfig from '@/config/piniaPersist';
import { dictAllApi } from '@/api/sys/dict';
import { secretKeyApi } from '@/api/login';

export const useAppStore = defineStore('aster-app', {
  state: (): AppState => ({
    dictList: [],
    secretKey: '',
  }),
  getters: {},
  actions: {
    async setDictList() {
      const { data } = await dictAllApi();
      this.dictList = data || [];
    },
    async setSecretKey() {
      const { data } = await secretKeyApi();
      this.secretKey = data || '';
    },
  },
  // 持久化配置
  persist: piniaPersistConfig('aster-app'),
});
