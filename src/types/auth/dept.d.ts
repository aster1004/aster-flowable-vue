/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:06:34
 * @FilePath: \aster-flowable-vue\src\types\auth\dept.d.ts
 * @Description: 部门接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Dept {
  export interface DeptParams extends Page.ReqPage {
    orgName?: string;
    status: string;
    id?: string;
  }

  export interface DeptInfo {
    id?: string;
    pid?: string;
    orgName: string;
    parentName?: string;
    sort?: number;
    status: string;
    remark?: string;
    createTime?: string;
    children?: DeptInfo[];
  }
}
