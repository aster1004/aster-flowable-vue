/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 11:20:23
 * @FilePath: \aster-admin\src\api\sys\post.ts
 * @Description: 岗位API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 查询
 * @return {*}
 */
export const postListApi = () => {
  return request.get<Post.PostInfo[]>(PORT1 + `/post/list`, {
    noLoading: true,
  });
};

/**
 * @description: 分页
 * @return {*}
 */
export const postPageApi = (params: Post.PostParams) => {
  return request.get<Page.ResPage<Post.PostInfo>>(PORT1 + `/post/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const postInfoApi = (id: string) => {
  return request.get<Post.PostInfo>(PORT1 + `/post/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Post.PostInfo} postInfo
 * @return {*}
 */
export const postSaveApi = (postInfo: Post.PostInfo) => {
  return request.post<string>(PORT1 + `/post/save`, postInfo, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const postDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/post/delete`, ids, { noLoading: true });
};
