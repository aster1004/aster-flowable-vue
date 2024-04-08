/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-16 11:24:41
 * @FilePath: \aster-admin\src\stores\modules\keepAlive.ts
 * @Description: keepAlive
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { KeepAliveState } from '@/stores/interface';

export const useKeepAliveStore = defineStore({
  id: 'aster-keepAlive',
  state: (): KeepAliveState => ({
    keepAliveName: [],
  }),
  actions: {
    // Add KeepAliveName
    async addKeepAliveName(name: string) {
      if (this.keepAliveName.includes(name)) {
        return;
      }
      this.keepAliveName.push(name);
    },
    // Remove KeepAliveName
    async removeKeepAliveName(name: string) {
      this.keepAliveName = this.keepAliveName.filter((item) => item !== name);
    },
    // Set KeepAliveName
    async setKeepAliveName(keepAliveName: string[] = []) {
      this.keepAliveName = keepAliveName;
    },
  },
});
