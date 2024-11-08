/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-11-07 11:23:58
 * @FilePath: \aster-flowable-vue\src\types\sys\calendar.ts
 * @Description: 日程相关接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace AsterCalendar {
  export type HandleMoveArg = 'next' | 'prev' | 'today';
  export type ViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

  /** 日程视图类型 */
  export interface ViewTypeMenu {
    label: string;
    value: ViewType;
    icon: string;
  }

  /** 查询条件 */
  export interface CalendarParams {
    startTime?: string;
    endTime?: string;
  }

  /** 日程数据 */
  export interface CalendarEventModel {
    id: string;
    title: string;
    description?: string;
    allDay: boolean;
    color?: string;
    start?: string;
    end?: string;
  }
}
