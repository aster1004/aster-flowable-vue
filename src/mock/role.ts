/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 17:23:06
 * @FilePath: \aster-flowable-vue\src\mock\role.ts
 * @Description: 角色mock
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { PORT1 } from '@/api/config';
import { MockMethod } from 'vite-plugin-mock';

const roleSaveApi = {
  url: PORT1 + `/role/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const deleteRoleApi = {
  url: PORT1 + `/role/delete`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const roleListApi = {
  url: PORT1 + `/role/list`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: [
        {
          id: '1',
          name: '超级管理员',
          remark: '',
          orderNum: 0,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '2',
          name: '系统管理员',
          remark: '三元-系统',
          orderNum: 1,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '3',
          name: '审计管理员',
          remark: '三元-审计',
          orderNum: 2,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '4',
          name: '安全管理员',
          remark: '三元-安全',
          orderNum: 3,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
      ],
      message: 'success',
    };
  },
};

const rolePageApi = {
  url: PORT1 + `/role/page`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: {
        total: 4,
        list: [
          {
            id: '1',
            name: '超级管理员',
            remark: '',
            orderNum: 0,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '2',
            name: '系统管理员',
            remark: '三元-系统',
            orderNum: 1,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '3',
            name: '审计管理员',
            remark: '三元-审计',
            orderNum: 2,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '4',
            name: '安全管理员',
            remark: '三元-安全',
            orderNum: 3,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
        ],
      },
      message: 'success',
    };
  },
};

const roleInfoApi = {
  url: PORT1 + `/role/info/2`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        id: '2',
        name: '系统管理员',
        remark: '三元-系统',
        orderNum: 1,
        status: '0',
        createTime: '2023-10-26 11:34:08',
      },
      message: 'success',
    };
  },
};

const roleMenuApi = {
  url: PORT1 + `/role/menu/2`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: ['2', '21', '22', '23', '24', '211', '212', '213', '214'],
      message: 'success',
    };
  },
};

const saveRoleMenuApi = {
  url: PORT1 + `/role/menu/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

export default [
  roleSaveApi,
  deleteRoleApi,
  roleListApi,
  rolePageApi,
  roleInfoApi,
  roleMenuApi,
  saveRoleMenuApi,
] as MockMethod[];
