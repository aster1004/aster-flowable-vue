/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-21 14:59:29
 * @FilePath: \aster-flowable-vue\src\api\workflow\assocaition.ts
 * @Description: 关联列表API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * 查询关联列表
 * @param code 关联的表单编码
 * @returns
 */
export const assocaitionListApi = (code: string) => {
  return request.get<WorkComponent.TreeNode[]>(
    PORT5 + `/assocaition/list`,
    { associationCode: code },
    {
      noLoading: true,
    },
  );
};
