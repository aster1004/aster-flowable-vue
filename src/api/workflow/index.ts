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
export function getRoles(data: any) {
  console.info(data);
  return jsonData;
}

/**
 * 获取部门
 * @param {*} data
 * @returns
 */
export function getDepartments(data: any) {
  console.info(data);
  return departments;
}

/**
 * 获取职员
 * @param {*} data
 * @returns
 */
export function getEmployees(data: any) {
  console.info(data);
  return employees;
}
/**
 * 获取条件字段
 * @param {*} data
 * @returns
 */
export function getConditions(data: any) {
  console.info(data);
  return conditions;
}

/**
 * 获取审批数据
 * @param {*} data
 * @returns
 */
export function getWorkFlowData(data: any) {
  console.info(data);
  console.info(jsonData);
  return jsonData;
}
/**
 * 设置审批数据
 * @param {*} data
 * @returns
 */
export function setWorkFlowData(data: any) {
  return request.post(``, data);
}
