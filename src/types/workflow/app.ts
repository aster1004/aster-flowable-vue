/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-15 15:31:12
 * @FilePath: \aster-flowable-vue\src\types\workflow\app.ts
 * @Description: 应用信息
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

declare namespace WorkApp {
  export interface AppParams extends Page.ReqPage {
    name: string;
    status: string;
  }

  export interface QueryParams {
    id?: string;
    name?: string;
    status?: string;
  }

  export interface AppInfo {
    id?: string;
    name: string;
    icon: string;
    iconColor: string;
    sort: number;
    status: string;
    remark: string;
    forms?: Array<WorkForm.BaseInfo>;
  }
}
