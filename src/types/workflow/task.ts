/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-09-29 17:16:34
 * @FilePath: \aster-flowable-vue\src\types\workflow\task.ts
 * @Description: 流程任务相关类型定义
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace WorkTask {
  /**
   * @description: 任务查询参数
   */
  export interface TaskQuery extends Page.ReqPage {
    title: string;
    userId: string;
    appId: string;
    formCode: string;
    startTime: string | null;
    endTime: string | null;
    status: string;
  }

  /**
   * @description: 我的待办/已办
   */
  export interface TaskNodeModel {
    id: string;
    taskId: string;
    appId?: string;
    formCode: string;
    formName?: string;
    dataTitle?: string;
    nodeKey?: string;
    nodeName?: string;
    procDefId: string;
    procInstId: string;
    executionId?: string;
    version?: number;
    startUserId?: string;
    startUserName?: string;
    startUserAvatar?: string;
    createTime?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
  }

  /**
   * @description: 我发起的
   */
  export interface MyStartedModel {
    id: string;
    procInstId: string;
    procDefId?: string;
    appId?: string;
    formCode?: string;
    formName?: string;
    dataTitle?: string;
    formStatus?: string;
    version?: number;
    startUserId?: string;
    nodeKey?: string;
    nodeName?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
  }

  /**
   * @description: 抄送给我的
   */
  export interface CcMeModel {
    id: string;
    procInstId: string;
    procDefId?: string;
    appId?: string;
    formCode?: string;
    formName?: string;
    dataTitle?: string;
    formStatus?: string;
    version?: number;
    startUserId?: string;
    startUserName?: string;
    startUserAvatar?: string;
    createTime?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
  }

  /**
   * @description: 年度任务统计
   */
  export interface AnnualTaskModel {
    todoNum: number;
    completeNum: number;
    startedNum: number;
    ccNum: number;
  }

  /**
   * @description: 已办统计
   */
  export interface CompleteStatisticsModel {
    appId: string;
    formCode: string;
    formName: string;
    icon: string;
    iconColor: string;
    completeNum: number;
  }
}
