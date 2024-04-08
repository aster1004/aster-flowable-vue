/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\mock\test.ts
 * @Description: 测试
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { MockMethod } from 'vite-plugin-mock';

const getAddressList = {
  url: '/test',
  method: 'get',
  response: () => {
    return {
      code: 200,
      data: [
        {
          id: 1,
          consignee: '暗影',
          mobile: '13766668888',
          area: '110114',
          address: '北七家镇平西府村',
          default: '1',
        },
        {
          id: 2,
          consignee: '暗影2',
          mobile: '13766668888',
          area: '110111',
          address: '北七家镇宏福苑小区1号楼3单元401',
          default: '0',
        },
        {
          id: 3,
          consignee: '暗影3',
          mobile: '13766668888',
          area: '371522',
          address: '柿子园镇堰里铺东街110号',
          default: '0',
        },
        {
          id: 4,
          consignee: '暗影4',
          mobile: '13766668888',
          area: '110113',
          address: '北七家镇宏福苑小区1号楼3单元401',
          default: '0',
        },
        {
          id: 5,
          consignee: '暗影5',
          mobile: '13766668888',
          area: '110115',
          address: '北七家镇宏福苑小区1号楼3单元401',
          default: '0',
        },
      ],
      message: 'success',
    };
  },
};

export default [getAddressList] as MockMethod[];
