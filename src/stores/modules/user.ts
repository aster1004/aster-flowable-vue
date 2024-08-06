/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-08 14:16:52
 * @FilePath: \aster-flowable-vue\src\stores\modules\user.ts
 * @Description: 用户
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { UserState } from '@/stores/interface';
import piniaPersistConfig from '@/config/piniaPersist';
import { isNotEmpty } from '@/utils';

const enum SuperAdminEnum {
  YES = '0',
  NO = '1',
}

export const useUserStore = defineStore({
  id: 'aster-user',
  state: (): UserState => ({
    token: '',
    userInfo: {
      id: '',
      username: '',
      gender: '',
      status: '',
    },
  }),
  getters: {
    // 是否超级管理员
    isSuperAdmin: (state) =>
      isNotEmpty(state.userInfo.superAdmin) && state.userInfo.superAdmin == SuperAdminEnum.YES,
  },
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: User.UserInfo) {
      this.userInfo = userInfo;
    },
  },
  // 持久化配置
  persist: piniaPersistConfig('aster-user'),
});
