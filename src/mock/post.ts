/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 11:30:09
 * @FilePath: \aster-flowable-vue\src\mock\post.ts
 * @Description: 岗位mock
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { PORT1 } from '@/api/config';
import { MockMethod } from 'vite-plugin-mock';

const postSaveApi = {
  url: PORT1 + `/post/save`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const postDeleteApi = {
  url: PORT1 + `/post/delete`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: 'success',
      message: 'success',
    };
  },
};

const postListApi = {
  url: PORT1 + `/post/list`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: [
        {
          id: '1',
          postCode: 'CEO',
          postName: '董事长',
          orderNum: 0,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '2',
          postCode: 'GM',
          postName: '总经理',
          orderNum: 1,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '3',
          postCode: 'BM',
          postName: '部门经理',
          orderNum: 2,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '4',
          postCode: 'PM',
          postName: '项目经理',
          orderNum: 3,
          status: '1',
          createTime: '2023-10-26 11:34:08',
        },
        {
          id: '5',
          postCode: 'USER',
          postName: '普通员工',
          orderNum: 4,
          status: '0',
          createTime: '2023-10-26 11:34:08',
        },
      ],
      message: 'success',
    };
  },
};

const postPageApi = {
  url: PORT1 + `/post/page`,
  method: 'post',
  response: () => {
    return {
      code: 200,
      data: {
        total: 5,
        list: [
          {
            id: '1',
            postCode: 'CEO',
            postName: '董事长',
            orderNum: 0,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '2',
            postCode: 'GM',
            postName: '总经理',
            orderNum: 1,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '3',
            postCode: 'BM',
            postName: '部门经理',
            orderNum: 2,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '4',
            postCode: 'PM',
            postName: '项目经理',
            orderNum: 3,
            status: '1',
            createTime: '2023-10-26 11:34:08',
          },
          {
            id: '5',
            postCode: 'USER',
            postName: '普通员工',
            orderNum: 4,
            status: '0',
            createTime: '2023-10-26 11:34:08',
          },
        ],
      },
      message: 'success',
    };
  },
};

const postInfoApi = {
  url: PORT1 + `/post/info/5`,
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: {
        id: '5',
        postCode: 'USER',
        postName: '普通员工',
        orderNum: 4,
        status: '0',
        createTime: '2023-10-26 11:34:08',
      },
      message: 'success',
    };
  },
};

export default [postSaveApi, postDeleteApi, postListApi, postPageApi, postInfoApi] as MockMethod[];
