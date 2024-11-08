import request from '@/config/axios';
import { PORT1 } from '../config';
import { EventInput } from '@fullcalendar/core';

/**
 * @description: 分页
 * @return {*}
 */
export const calendarPageApi = (params: AsterCalendar.CalendarParams) => {
  return request.get<Page.ResPage<AsterCalendar.CalendarEventModel>>(
    PORT1 + `/calendar/page`,
    params,
    {
      noLoading: true,
    },
  );
};

/**
 * @description: 列表
 * @return {*}
 */
export const calendarListApi = (params: AsterCalendar.CalendarParams) => {
  return request.get<AsterCalendar.CalendarEventModel[]>(PORT1 + `/calendar/list`, params, {
    noLoading: true,
  });
};

/**
 * @description: 单条信息
 * @return {*}
 */
export const calendarInfoApi = (id: string) => {
  return request.get<AsterCalendar.CalendarEventModel>(PORT1 + `/calendar/info/` + id, {
    noLoading: true,
  });
};

/**
 * @description: 新增
 * @param {Calendar.CalendarInfo} info
 * @return {*}
 */
export const calendarAddApi = (info: EventInput) => {
  return request.post<string>(PORT1 + `/calendar/add`, info, { noLoading: true });
};

/**
 * @description: 保存
 * @param {Calendar.CalendarInfo} info
 * @return {*}
 */
export const calendarSaveApi = (info: EventInput) => {
  return request.post<string>(PORT1 + `/calendar/save`, info, { noLoading: true });
};

/**
 * @description: 删除
 * @param {any} ids
 * @return {*}
 */
export const calendarDeleteApi = (ids: any) => {
  return request.post<string>(PORT1 + `/calendar/delete`, ids, { noLoading: true });
};
