/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-31 11:12:58
 * @FilePath: \aster-admin\src\mock\user.ts
 * @Description: 用户mock
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { PORT1 } from '@/api/config';
import { MockMethod } from 'vite-plugin-mock';

const userSaveApi = {
  url: PORT1 + `/user/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const userDeleteApi = {
  url: PORT1 + `/user/delete`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const userPageApi = {
  url: PORT1 + `/user/page`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: {
        total: 2,
        list: [
          {
            id: '1',
            username: 'aster',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            realname: '暗影',
            nickname: 'Aster',
            gender: '0',
            birthday: '1992-10-04',
            idCard: '11******11',
            area: '',
            mobile: '153****1111',
            signature: '且听风吟，静待花开',
            status: '0',
            createTime: '2023-10-26 11:34:08',
            roleId: '3',
            postIds: ['2', '3'],
            deptId: '112',
            deptName: '商务部',
          },
          {
            id: '2',
            username: 'admin',
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            realname: 'Admin',
            nickname: 'Admin',
            gender: '1',
            birthday: '2000-10-10',
            idCard: '10******1X',
            area: '',
            mobile: '133****1111',
            signature: '业精于勤而荒于嬉，行成于思而毁于随',
            status: '1',
            createTime: '2023-10-26 11:34:08',
            roleId: '2',
            postIds: ['3'],
            deptId: '121',
            deptName: '研发部',
          },
        ],
      },
      message: 'success',
    };
  },
};

const userInfoApi = {
  url: PORT1 + `/user/info/1`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        id: '1',
        username: 'aster',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        realname: '暗影',
        nickname: 'Aster',
        gender: '0',
        birthday: '1992-10-04',
        idCard: '11******11',
        area: '',
        mobile: '153****1111',
        signature: '且听风吟，静待花开',
        status: '0',
        createTime: '2023-10-26 11:34:08',
        roleId: '3',
        postIds: ['2', '3'],
        deptId: '112',
        deptName: '商务部',
      },
      message: 'success',
    };
  },
};

const userResetApi = {
  url: PORT1 + `/user/reset`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

export default [userSaveApi, userDeleteApi, userPageApi, userInfoApi, userResetApi] as MockMethod[];
