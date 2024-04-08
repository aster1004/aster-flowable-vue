/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-19 16:05:59
 * @FilePath: \aster-admin\src\mock\dict.ts
 * @Description: 字典mock
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { PORT1 } from '@/api/config';
import { MockMethod } from 'vite-plugin-mock';

const dictAll = {
  url: PORT1 + `/dict`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: [
        {
          dictType: 'status',
          dataList: [
            {
              dictLabel: '正常',
              dictValue: '0',
              labelClass: 'primary',
            },
            {
              dictLabel: '停用',
              dictValue: '1',
              labelClass: 'info',
            },
          ],
        },
        {
          dictType: 'gender',
          dataList: [
            {
              dictLabel: '男',
              dictValue: '0',
              labelClass: 'primary',
            },
            {
              dictLabel: '女',
              dictValue: '1',
              labelClass: 'success',
            },
            {
              dictLabel: '未知',
              dictValue: '2',
              labelClass: 'warning',
            },
          ],
        },
        {
          dictType: 'enable_disable',
          dataList: [
            {
              dictLabel: '启用',
              dictValue: '0',
              labelClass: 'primary',
            },
            {
              dictLabel: '禁用',
              dictValue: '1',
              labelClass: 'danger',
            },
          ],
        },
        {
          dictType: 'success_fail',
          dataList: [
            {
              dictLabel: '成功',
              dictValue: '0',
              labelClass: 'primary',
            },
            {
              dictLabel: '失败',
              dictValue: '1',
              labelClass: 'danger',
            },
          ],
        },
        {
          dictType: 'menu_type',
          dataList: [
            {
              dictLabel: '目录',
              dictValue: '0',
              labelClass: 'success',
            },
            {
              dictLabel: '菜单',
              dictValue: '1',
              labelClass: 'primary',
            },
            {
              dictLabel: '按钮',
              dictValue: '2',
              labelClass: 'info',
            },
          ],
        },
        {
          dictType: 'business_type',
          dataList: [
            {
              dictLabel: '新增',
              dictValue: '0',
              labelClass: 'primary',
            },
            {
              dictLabel: '修改',
              dictValue: '1',
              labelClass: 'success',
            },
            {
              dictLabel: '删除',
              dictValue: '2',
              labelClass: 'danger',
            },
            {
              dictLabel: '导入',
              dictValue: '3',
              labelClass: 'info',
            },
            {
              dictLabel: '导出',
              dictValue: '4',
              labelClass: 'info',
            },
            {
              dictLabel: '授权',
              dictValue: '5',
              labelClass: 'warning',
            },
            {
              dictLabel: '强退',
              dictValue: '6',
              labelClass: 'danger',
            },
            {
              dictLabel: '清空',
              dictValue: '7',
              labelClass: 'danger',
            },
            {
              dictLabel: '其他',
              dictValue: '8',
              labelClass: 'info',
            },
          ],
        },
        {
          dictType: 'operator_type',
          dataList: [
            {
              dictLabel: 'PC用户',
              dictValue: '0',
              labelClass: 'primary',
            },
            {
              dictLabel: 'H5用户',
              dictValue: '1',
              labelClass: 'success',
            },
            {
              dictLabel: 'App用户',
              dictValue: '2',
              labelClass: 'info',
            },
            {
              dictLabel: '其他',
              dictValue: '3',
              labelClass: 'warning',
            },
          ],
        },
      ],
      message: 'success',
    };
  },
};

const dictTypePage = {
  url: PORT1 + `/dict/type/page`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: {
        list: [
          {
            id: '1',
            dictType: 'status',
            dictName: '状态',
            remark: '通用：正常 | 停用',
            orderNum: 0,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: '2',
            dictType: 'gender',
            dictName: '性别',
            remark: '用户管理',
            orderNum: 1,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: '3',
            dictType: 'enable_disable',
            dictName: '状态',
            remark: '功能状态：启用 | 禁用 ',
            orderNum: 2,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: '4',
            dictType: 'success_fail',
            dictName: '状态',
            remark: '操作状态：成功 | 失败',
            orderNum: 3,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: '5',
            dictType: 'menu_type',
            dictName: '菜单类型',
            remark: '菜单类型：目录 | 菜单 | 按钮',
            orderNum: 4,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: '6',
            dictType: 'business_type',
            dictName: '业务类型',
            remark: '操作日志-业务类型',
            orderNum: 5,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: '7',
            dictType: 'operator_type',
            dictName: '操作类别',
            remark: '操作日志-操作类别',
            orderNum: 6,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
        ],
        total: 5,
      },
      message: 'success',
    };
  },
};

const dictType = {
  url: PORT1 + `/dict/type/1`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        id: '1',
        dictType: 'status',
        dictName: '状态',
        remark: '通用',
        orderNum: 11,
        status: '0',
        createTime: '2023-10-10 00:00:00',
      },
      message: 'success',
    };
  },
};

const saveDictType = {
  url: PORT1 + `/dict/type/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const deleteDictType = {
  url: PORT1 + `/dict/type/delete`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const dictDataPage = {
  url: PORT1 + `/dict/data/page`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: {
        list: [
          {
            id: 1,
            dictTypeId: 1,
            dictLabel: '正常',
            labelClass: 'primary',
            dictValue: '0',
            remark: '',
            orderNum: 0,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
          {
            id: 2,
            dictTypeId: 1,
            dictLabel: '停用',
            labelClass: 'info',
            dictValue: '1',
            remark: '',
            orderNum: 1,
            status: '0',
            createTime: '2023-10-10 00:00:00',
          },
        ],
        pageNum: 1,
        pageSize: 10,
        total: 2,
      },
      message: 'success',
    };
  },
};

const dictData = {
  url: PORT1 + `/dict/data/1`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        id: 1,
        dictTypeId: 1,
        dictLabel: '正常',
        labelClass: 'primary',
        dictValue: '0',
        remark: '',
        orderNum: 22,
        status: '0',
        createTime: '2023-10-10 00:00:00',
      },
      message: 'success',
    };
  },
};

const saveDictData = {
  url: PORT1 + `/dict/data/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const deleteDictData = {
  url: PORT1 + `/dict/data/delete/1`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

export default [
  dictAll,
  dictTypePage,
  dictType,
  saveDictType,
  deleteDictType,
  dictDataPage,
  dictData,
  saveDictData,
  deleteDictData,
] as MockMethod[];
