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
   * @description: 角色信息
   */
  export interface RoleInfo {
    id?: string;
    name: string;
    pid?: string;
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
}
