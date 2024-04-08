/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-19 16:58:33
 * @FilePath: \aster-admin\src\types\result.d.ts
 * @Description: 请求响应接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
// 请求响应参数（不包含data）
declare interface Result {
  code: number;
  message: string;
}

// 请求响应参数（包含data）
declare interface ResultData<T = any> extends Result {
  data: T;
}

// 文件上传模块
declare namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

declare namespace Page {
  // 分页响应参数
  export interface ResPage<T> {
    list: T[];
    total: number;
    pageNum?: number;
    pageSize?: number;
  }

  // 分页请求参数
  export interface ReqPage {
    pageNum: number;
    pageSize: number;
  }
}
