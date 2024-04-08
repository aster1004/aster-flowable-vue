/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:07:24
 * @FilePath: \aster-flowable-vue\src\types\auth\role.d.ts
 * @Description: 角色接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Role {
  export interface RoleParams extends Page.ReqPage {
    roleName?: string;
    roleCode?: string;
    status: string;
  }

  export interface RoleMenuParams {
    roleIds: string[];
    menuIds: string[];
  }

  export interface RoleInfo {
    id?: string;
    roleName: string;
    roleCode: string;
    dataScope?: string;
    orgId?: string;
    sort?: number;
    status: string;
    remark?: string;
    createTime?: string;
    menuIdList?: string[];
    orgIdList?: string[];
  }

  export interface DataScope {
    id: string;
    dataScope: string;
    orgIdList: string[];
  }
}
