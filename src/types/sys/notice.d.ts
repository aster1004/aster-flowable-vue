/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 12:07:10
 * @FilePath: \aster-admin\src\types\sys\notice.d.ts
 * @Description: 通知公告 接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Notice {
  export interface NoticeParams extends Page.ReqPage {
    title: string;
    type: string;
    status: string;
  }

  export interface NoticeInfo {
    id?: string;
    title: string;
    type: string;
    content: string;
    status: string;
    remark: string;
  }

  export interface NoticeItem {
    key: string;
    content: string;
    type: string;
    time: string;
    read?: boolean;
  }

  export interface PublishParams {
    id: string;
    publishTime: string;
  }
}
