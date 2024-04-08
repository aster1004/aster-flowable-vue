/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-13 17:17:33
 * @FilePath: \aster-flowable-vue\src\stores\modules\notice.ts
 * @Description: 通知公告
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

export const useNoticeStore = defineStore('notice', () => {
  const state = reactive({
    notices: [] as Notice.NoticeItem[],
    showAnnouncement: true,
  });

  const addNotice = (notice: Notice.NoticeItem) => {
    state.notices.push(notice);
  };

  const removeNotice = (notice: Notice.NoticeItem) => {
    state.notices.splice(state.notices.indexOf(notice), 1);
  };
  // 已读
  const readNotice = (key: string) => {
    state.notices.forEach((item) => {
      if (item.key == key) {
        item.read = true;
      }
    });
    ElMessage.success('已读成功');
  };
  // 全部已读
  const readAllNotice = (type: string) => {
    state.notices.forEach((item) => {
      if (item.type == type) {
        item.read = true;
      }
    });
  };

  const clearNotice = () => {
    state.notices = [];
  };
  return {
    state,
    addNotice,
    removeNotice,
    readNotice,
    readAllNotice,
    clearNotice,
  };
});

export default useNoticeStore;
