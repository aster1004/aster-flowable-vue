/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-19 16:58:33
 * @FilePath: \aster-flowable-vue\src\types\result.d.ts
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
    // 文件名称
    name: string;
    // 文件地址
    url: string;
    // 文件大小
    size: number;
    // 文件扩展名
    extension: string;
    // 存储平台
    platform: string;
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
