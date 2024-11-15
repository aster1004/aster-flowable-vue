import request from '@/config/axios';
import { PORT5 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const commentPageApi = (params: Comment.CommentParams) => {
  return request.get<Page.ResPage<Comment.CommentInfo>>(PORT5 + `/comment/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const commentInfoApi = (id: string) => {
  return request.get<Comment.CommentInfo>(PORT5 + `/comment/info/` + id, { noLoading: true });
};

/**
 * @description: 新增
 * @param {Comment.CommentInfo} info
 * @return {*}
 */
export const commentAddApi = (info: Comment.CommentInfo) => {
  return request.post<string>(PORT5 + `/comment/add`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids 评论ID
 * @return {*}
 */
export const commentDeleteApi = (ids: string[]) => {
  return request.post<string>(PORT5 + `/comment/delete`, ids, { noLoading: true });
};

/**
 * @description: 评论树
 * @return {*}
 */
export const commentTreeApi = (belongId: string) => {
  return request.get<Comment.CommentInfo[]>(PORT5 + `/comment/tree/` + belongId, {
    noLoading: true,
  });
};

/**
 * @description: 点赞
 * @param {Comment.CommentLike} info 点赞信息
 * @return {*}
 */
export const commentLikeApi = (info: Comment.CommentLike) => {
  return request.post<string>(PORT5 + `/comment/like`, info, { noLoading: true });
};
