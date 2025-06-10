/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-30 17:27:59
 * @FilePath: \aster-flowable-vue\src\types\workflow\auth.ts
 * @Description: 流程权限 接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace WorkAuth {
  /**
   * @description: 角色参数
   */
  export interface RoleParams {
    roleName?: string;
  }

  /**
   * @description: 角色分页参数
   */
  export interface RolePage {
    pageNum: number;
    pageSize: number;
    roleName?: string;
    /** 角色类型：''-全部 0-分组 1-角色 */
    roleType?: string;
  }

  /**
   * @description: 角色信息
   */
  export interface RoleInfo {
    id?: string;
    name: string;
    pid?: string;
    pname?: string;
    type?: string;
    sort?: number;
    status?: string;
    remark?: string;
    children?: RoleInfo[];
  }

  /**
   * @description: 成员参数
   */
  export interface MemberParams {
    roleId: string;
    name?: string;
  }

  /**
   * @description: 成员信息
   */
  export interface MemberInfo {
    id?: string;
    roleId?: string;
    memberId?: string;
    memberName?: string;
    serviceOrgId?: string;
    serviceOrgName?: string;
    type?: string;
    avatar?: string;
  }

  /**
   * @description: 角色权限信息
   */
  export interface RolePermission {
    id?: string;
    roleId?: string;
    appId?: string;
    formId?: string;
    formName?: string;
    formPerms?: string[];
    listPerms?: string[];
    dataPerm?: string;
    checked?: boolean;
  }

  /**
   * @description: 表单数据权限
   */
  export interface FormDataPermission {
    code: string;
    isAdmin: boolean;
    formPerms?: string[];
    listPerms?: string[];
    dataPerm?: string;
    userId?: string;
    deptIds?: string[];
  }
}
