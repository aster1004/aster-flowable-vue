/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 14:51:36
 * @FilePath: \aster-flowable-vue\src\api\sys\dept.ts
 * @Description: 部门API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 列表
 * @param {Dept.DeptParams} params
 * @return {*}
 */
export const deptListApi = (params?: Dept.DeptParams) => {
  return request.get<Dept.DeptInfo[]>(PORT1 + `/org/list`, params, { noLoading: true });
};

/**
 * @description: 获取当前部门信息及当前部门下的第一级子部门，为空则获取全部
 * @param {Dept.DeptParams} params
 * @return {*}
 */
export const getDeptAndSubDeptById = (params?: Dept.DeptParams) => {
  return request.get<Dept.DeptInfo[]>(PORT1 + `/org/getDeptAndSubDeptById`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @param {string} id
 * @return {*}
 */
export const deptInfoApi = (id: string) => {
  return request.get<Dept.DeptInfo>(PORT1 + `/org/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Dept.DeptInfo} dept
 * @return {*}
 */
export const deptSaveApi = (dept: Dept.DeptInfo) => {
  return request.post<string>(PORT1 + `/org/save`, dept, { noLoading: true });
};

/**
 * @description: 删除
 * @param {string[]} ids
 * @return {*}
 */
export const deptDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT1 + `/org/delete`, ids, { noLoading: true });
};

/**
 * @description: 通过部门ids批量获取部门信息
 * @param ids
 * @return {*}
 */
export const deptSelectBatchIdsApi = (ids: string[]) => {
  return request.post<Dept.DeptInfo[]>(PORT1 + `/org/selectBatchIds`, ids, {
    noLoading: true,
  });
};
