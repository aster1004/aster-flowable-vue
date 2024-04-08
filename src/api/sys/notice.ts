import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const noticePageApi = (params: Notice.NoticeParams) => {
  return request.get<Page.ResPage<Notice.NoticeInfo>>(PORT1 + `/notice/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const noticeInfoApi = (id: string) => {
  return request.get<Notice.NoticeInfo>(PORT1 + `/notice/info/` + id, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Notice.NoticeInfo} info
 * @return {*}
 */
export const noticeSaveApi = (info: Notice.NoticeInfo) => {
  return request.post<string>(PORT1 + `/notice/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const noticeDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/notice/delete`, ids, { noLoading: true });
};

/**
 * @description: 发布
 * @param {any} params
 * @return {*}
 */
export const noticePublishApi = (params: Notice.PublishParams) => {
  return request.post<string>(PORT1 + `/notice/publish`, params, { noLoading: true });
};

/**
 * @description: 公告
 * @return {*}
 */
export const announcementApi = () => {
  return request.get<Notice.NoticeInfo>(PORT1 + `/notice/announcement`, { noLoading: true });
};
