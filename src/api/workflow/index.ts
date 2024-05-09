/*
 * @Date: 2022-08-25 14:06:59
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:52:57
 * @FilePath: /Workflow-Vue3/src/api/index.js
 */

// import http from '@/config/axios';
import request from '@/config/axios';
import jsonData from '@/data/data.json';
import departments from '@/data/departments.json';
import employees from '@/data/employees.json';
import conditions from '@/data/conditions.json';
let baseUrl = import.meta.env.BASE_URL;

/**
 * 获取角色
 * @param {*} data
 * @returns
 */
export function getRoles(data) {
  console.info(jsonData);
  return jsonData;
}

/**
 * 获取部门
 * @param {*} data
 * @returns
 */
export function getDepartments(data) {
  return departments;
}

/**
 * 获取职员
 * @param {*} data
 * @returns
 */
export function getEmployees(data) {
  return employees;
}
/**
 * 获取条件字段
 * @param {*} data
 * @returns
 */
export function getConditions(data) {
  return conditions;
}

/**
 * 获取审批数据
 * @param {*} data
 * @returns
 */
export function getWorkFlowData(data) {
  console.info(jsonData);
  return jsonData;
}
/**
 * 设置审批数据
 * @param {*} data
 * @returns
 */
export function setWorkFlowData(data) {
  return request.post(``, data);
}
