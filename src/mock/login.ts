/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-08 11:37:38
 * @FilePath: \aster-admin\src\mock\login.ts
 * @Description: 登录mock
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { PORT1 } from '@/api/config';
import { MockMethod } from 'vite-plugin-mock';

const login = {
  url: PORT1 + '/login',
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: {
        access_token: 'bqddxxwqmfncffacvbpkuxvwvqrhln',
      },
      message: 'success',
    };
  },
};

const logout = {
  url: PORT1 + `/logout`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const resetPassword = {
  url: PORT1 + `/resetPassword`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const userInfo = {
  url: PORT1 + `/user`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        username: 'Aster',
        avatar: '/src/assets/images/avatar.png',
        realname: '暗影',
        nickname: '暗影',
        gender: 'M',
        birthday: '1992-06-15',
        area: '100000',
      },
      message: 'success',
    };
  },
};

const editUserInfo = {
  url: PORT1 + `/user/edit`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

export default [login, logout, resetPassword, userInfo, editUserInfo] as MockMethod[];
