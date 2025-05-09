/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-24 10:17:35
 * @FilePath: \aster-flowable-vue\src\api\workflow\form.ts
 * @Description: 表单相关API接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 动态校验表单
 * @param {any} formData
 * @return {*}
 */
export const dynamicValidateApi = (formData: any) => {
  return request.post<string>(PORT5 + `/validate/dynamicValidate`, formData, { noLoading: true });
};
