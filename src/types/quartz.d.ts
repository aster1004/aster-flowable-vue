/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-07 14:08:30
 * @FilePath: \aster-admin\src\types\quartz.d.ts
 * @Description: 任务调度接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Quartz {
  export interface JobParams extends Page.ReqPage {
    jobName: string;
    jobGroup: string;
    status: string;
  }

  export interface JobInfo {
    id?: string;
    jobName: string;
    jobGroup: string;
    invokeTarget: string;
    cronExpression: string;
    misfirePolicy: string;
    concurrent: string;
    createTime?: string;
    status: string;
    remark: string;
  }

  export interface LogParams extends Page.ReqPage {
    jobId: string;
    jobName: string;
    jobGroup: string;
  }

  export interface LogInfo {
    id?: string;
    jobId?: string;
    jobName: string;
    jobGroup: string;
    invokeTarget: string;
    jobMessage: string;
    status: string;
    exceptionInfo: string;
    createTime?: string;
  }
}
