/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:08:44
 * @FilePath: \aster-flowable-vue\src\types\log\log.d.ts
 * @Description: 日志接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Log {
  export interface AccessParams extends Page.ReqPage {
    username: string;
    startTime: string | null;
    endTime: string | null;
    status: string;
  }

  export interface AccessInfo {
    id?: string;
    username?: string;
    ipAddress?: string;
    loginLocation?: string;
    userAgent?: string;
    operation?: string;
    loginTime?: string;
    status?: string;
  }

  export interface OperationParams extends Page.ReqPage {
    username?: string;
    businessType: string;
    startTime: string | null;
    endTime: string | null;
  }

  export interface OperationInfo {
    id?: string;
    module?: string;
    name?: string;
    requestUri?: string;
    requestMethod?: string;
    requestParams?: string;
    ip?: string;
    address?: string;
    userAgent?: string;
    businessType?: string;
    duration?: string;
    status?: string;
    username?: string;
    resultMsg?: string;
    operTime?: string;
  }
}
