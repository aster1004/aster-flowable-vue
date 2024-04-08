/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 14:56:54
 * @FilePath: \aster-flowable-vue\src\mock\dept.ts
 * @Description: 部门mock
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { PORT1 } from '@/api/config';
import { MockMethod } from 'vite-plugin-mock';

const saveApi = {
  url: PORT1 + `/dept/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const deleteApi = {
  url: PORT1 + `/dept/delete`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const listApi = {
  url: PORT1 + `/dept/list`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: [
        {
          id: '1',
          pid: '0',
          name: 'Aster',
          orderNum: 0,
          status: '0',
          createTime: '2023-10-26 15:01:33',
          children: [
            {
              id: '11',
              pid: '1',
              name: '北京分公司',
              orderNum: 0,
              status: '0',
              createTime: '2023-10-26 15:01:33',
              children: [
                {
                  id: '111',
                  pid: '11',
                  name: '法务部',
                  orderNum: 0,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
                {
                  id: '112',
                  pid: '11',
                  name: '商务部',
                  orderNum: 1,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
                {
                  id: '113',
                  pid: '11',
                  name: '财务部',
                  orderNum: 2,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
                {
                  id: '114',
                  pid: '11',
                  name: '市场部',
                  orderNum: 3,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
              ],
            },
            {
              id: '12',
              pid: '1',
              name: '青岛分公司',
              orderNum: 1,
              status: '0',
              createTime: '2023-10-26 15:01:33',
              children: [
                {
                  id: '121',
                  pid: '12',
                  name: '研发部',
                  orderNum: 0,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
                {
                  id: '122',
                  pid: '12',
                  name: '测试部',
                  orderNum: 1,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
                {
                  id: '123',
                  pid: '12',
                  name: '运维部',
                  orderNum: 2,
                  status: '0',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
                {
                  id: '124',
                  pid: '12',
                  name: '售前/售后',
                  orderNum: 3,
                  status: '1',
                  createTime: '2023-10-26 15:01:33',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
      message: 'success',
    };
  },
};

const infoApi = {
  url: PORT1 + `/dept/info/121`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        id: '121',
        pid: '12',
        name: '研发部',
        orderNum: 0,
        status: '0',
        createTime: '2023-10-26 15:01:33',
        children: [],
      },
      message: 'success',
    };
  },
};

export default [saveApi, deleteApi, listApi, infoApi] as MockMethod[];
