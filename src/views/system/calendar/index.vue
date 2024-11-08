<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-11-07 10:52:08
 * @FilePath: \aster-flowable-vue\src\views\system\calendar\index.vue
 * @Description: 日程管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box aster-fullcalendar">
    <calendar-header
      ref="calendarHeaderRef"
      :now="date"
      :view="view"
      :onMove="handleMove"
      :onCreate="() => (visible = true)"
      :onViewTypeChange="handleChangeView"
    />
    <full-calendar ref="fullCalendarRef" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div class="fc-event-main-wrapper" :style="{ color: arg.backgroundColor }">
          <div class="fc-event-main-frame">
            <div class="fc-event-time">{{ arg.timeText }}</div>
            <div class="fc-event-title-container">
              <div class="fc-event-title fc-sticky">
                {{ arg.event.title }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </full-calendar>

    <calendar-event
      :visible="visible"
      :type="eventFormType"
      :initValues="eventInitValue"
      :onCancel="handleCancel"
      :onDelete="handleDelete"
      :onCreate="handleCreate"
      :onEdit="handleEdit"
    />
  </div>
</template>
<script setup lang="ts">
  import CalendarHeader from '@/components/calendar/calendar-header.vue';
  import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import listPlugin from '@fullcalendar/list';
  import moment, { MomentInput } from 'moment';
  import { onMounted, onUnmounted, reactive, ref } from 'vue';
  import CalendarEvent from './calendar-event.vue';
  import {
    calendarListApi,
    calendarAddApi,
    calendarSaveApi,
    calendarDeleteApi,
  } from '@/api/sys/calendar';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';

  // 注册组件
  const calendarHeaderRef = ref();
  const fullCalendarRef = ref();

  /** 默认事件初始化值 */
  const DefaultEventInitValue: AsterCalendar.CalendarEventModel = {
    id: '',
    title: '',
    description: '',
    allDay: false,
    start: moment().format('YYYY-MM-DD HH:mm:ss'),
    end: moment().format('YYYY-MM-DD HH:mm:ss'),
    color: '',
  };
  /** 打开弹窗 */
  const visible = ref<boolean>(false);
  /** 日历展示视图 */
  const view = ref<AsterCalendar.ViewType>('dayGridMonth');
  /** 日历当前时间 */
  const date = ref<MomentInput>(moment().format('YYYY-MM-DD'));
  /** 事件表单的类型（添加或编辑） */
  const eventFormType = ref<'add' | 'edit'>('add');
  /** 事件表单数据 */
  const eventInitValue = ref<AsterCalendar.CalendarEventModel>(DefaultEventInitValue);
  /** 查询条件 */
  const eventParams = reactive<AsterCalendar.CalendarParams>({});

  /**
   * @description: 日历网格事件处理
   */
  function handleDateSelect(selectInfo: DateSelectArg) {
    visible.value = true;
    eventFormType.value = 'add';
    let calendarApi = selectInfo.view.calendar;
    // clear date selection
    calendarApi.unselect();
    selectInfo.allDay = false;

    eventInitValue.value = {
      id: '',
      title: '',
      description: '',
      allDay: selectInfo.allDay,
      start: moment(selectInfo.startStr).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(selectInfo.endStr).format('YYYY-MM-DD HH:mm:ss'),
      color: '',
    };
  }
  /**
   * @description: 日历事件点击
   */
  const handleEventClick = (arg: EventClickArg) => {
    const { title, extendedProps, allDay, start, end, backgroundColor, id } = arg.event;
    visible.value = true;
    eventFormType.value = 'edit';
    const newEventValue: AsterCalendar.CalendarEventModel = {
      id,
      title,
      allDay,
      color: backgroundColor,
      description: extendedProps.description,
    };
    if (start) {
      newEventValue.start = moment(start).format('YYYY-MM-DD HH:mm:ss');
    }

    if (end) {
      newEventValue.end = moment(end).format('YYYY-MM-DD HH:mm:ss');
    }
    eventInitValue.value = newEventValue;
  };

  /**
   * @description: 日期改变
   */
  const handleMove = (action: AsterCalendar.HandleMoveArg) => {
    const calendarApi = fullCalendarRef.value!.getApi();
    switch (action) {
      case 'prev':
        calendarApi.prev();
        break;
      case 'next':
        calendarApi.next();
        break;
      case 'today':
        calendarApi.today();
        break;
      default:
        break;
    }
    date.value = calendarApi.getDate();
  };

  /**
   * @description: 切换视图
   */
  const handleChangeView = (type: AsterCalendar.ViewType) => {
    const calendarApi = fullCalendarRef.value!.getApi();
    calendarApi.changeView(type);
    view.value = type;
  };

  /**
   * @description: 新增事件
   * @return {*}
   */
  const handleCreate = async (values: AsterCalendar.CalendarEventModel) => {
    const calendarApi = fullCalendarRef.value!.getApi();
    const { id, title = '', description, start, end, allDay, color } = values;
    const newEvent: EventInput = {
      id,
      title,
      allDay,
      color,
      extendedProps: {
        description,
      },
    };
    if (start) newEvent.start = start;
    if (end) newEvent.end = end;
    calendarAddApi(newEvent).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        newEvent.id = res.data;
        // 刷新日历显示
        calendarApi.addEvent(newEvent);
        console.log(calendarApi);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 编辑事件
   */
  const handleEdit = async (values: AsterCalendar.CalendarEventModel) => {
    const { id, title = '', description, start, end, allDay = false, color } = values;
    const calendarApi = fullCalendarRef.value!.getApi();
    const oldEvent = calendarApi.getEventById(id);

    const newEvent: EventInput = {
      id,
      title,
      allDay,
      color,
      extendedProps: {
        description,
      },
    };
    if (start) newEvent.start = start;
    if (end) newEvent.end = end;
    calendarSaveApi(newEvent).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        // 刷新日历显示
        oldEvent?.remove();
        calendarApi.addEvent(newEvent);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 取消事件
   * @return {*}
   */
  const handleCancel = () => {
    eventInitValue.value = DefaultEventInitValue;
    visible.value = false;
  };

  /**
   * @description: 删除事件
   * @return {*}
   */
  const handleDelete = async (id: string) => {
    const calendarApi = fullCalendarRef.value!.getApi();
    const oldEvent = calendarApi.getEventById(id);
    calendarDeleteApi(id).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        ElMessage.success(res.message);
        oldEvent?.remove();
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 获取事件列表
   * @return {*}
   */
  const handleEventList = async (
    fetchInfo: any,
    successCallback: Function,
    failureCallback: Function,
  ) => {
    eventParams.startTime = fetchInfo.start;
    eventParams.endTime = fetchInfo.end;
    await calendarListApi(eventParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        const events = res.data.map((item: AsterCalendar.CalendarEventModel) => {
          return {
            id: item.id,
            title: item.title,
            allDay: item.allDay,
            color: item.color,
            start: item.start,
            end: item.end,
            extendedProps: {
              description: item.description,
            },
          };
        });
        successCallback(events);
      } else {
        ElMessage.error(res.message);
        failureCallback([]);
      }
    });
  };

  // 手机 pc 切换视图
  const checkScreenWidth = () => {
    const calendarApi = fullCalendarRef.value!.getApi();
    if (window.matchMedia('(max-width: 768px)').matches) {
      calendarApi.changeView('listWeek');
      view.value = 'listWeek';
    } else {
      calendarApi.changeView(view.value);
    }
  };

  /**
   * fullcalendar配置
   */
  const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    headerToolbar: false,
    initialView: view.value,
    locale: 'zh-cn',
    firstDay: 1,
    events: handleEventList,
    droppable: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: handleDateSelect,
    eventClick: handleEventClick,
  } as CalendarOptions);

  onMounted(() => {
    // 在组件挂载时检查屏幕宽度
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenWidth);
  });
</script>
<style lang="scss">
  @import '@/assets/styles/fullcalendar.scss';
</style>
