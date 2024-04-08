/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:06:05
 * @FilePath: \aster-flowable-vue\src\types\sys\post.d.ts
 * @Description: 岗位接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Post {
  export interface PostParams extends Page.ReqPage {
    postCode?: string;
    postName?: string;
    status: string;
  }

  export interface PostInfo {
    id: string;
    postCode: string;
    postName: string;
    sort?: number;
    status: string;
    createTime?: string;
    remark?: string;
  }
}
