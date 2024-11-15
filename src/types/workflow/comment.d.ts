/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-11-14 11:11:14
 * @FilePath: \aster-flowable-vue\src\types\workflow\comment.d.ts
 * @Description: 评论接口定义
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Comment {
  export interface CommentParams extends Page.ReqPage {}

  /**
   * @description: 用户信息
   * @return {*}
   */
  export interface CommentUser {
    id: string;
    name: string;
    avatar?: string;
  }

  /**
   * @description: 评论信息
   * @return {*}
   */
  export interface CommentInfo {
    id?: string;
    parentId?: string;
    replyId?: string;
    belongId?: string;
    content: string;
    imgSrc?: string;
    likes?: number;
    liked?: boolean;
    createTime?: string;
    user?: CommentUser;
    reply?: CommentUser;
    children?: CommentInfo[];
  }

  /**
   * @description: 点赞信息
   * @return {*}
   */
  export interface CommentLike {
    userId?: string;
    belongId: string;
    commentId: string;
    liked: boolean;
  }
}
