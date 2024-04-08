<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-14 14:52:22
 * @FilePath: \aster-flowable-vue\src\components\header\notice.vue
 * @Description: 消息
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div>
    <div class="message-list" v-if="noticeList.length > 0">
      <div style="height: 220px; position: relative">
        <div v-for="(item, index) in noticeList" :key="index">
          <el-row class="message-item">
            <el-col :span="4">
              <div class="flex justify-center">
                <img
                  v-if="type == NoticeTypeEnum.MESSAGE"
                  src="@/assets/images/xiaoxi.png"
                  alt=""
                  class="message-icon"
                />
                <img
                  v-if="type == NoticeTypeEnum.NOTICE"
                  src="@/assets/images/tongzhi.png"
                  alt=""
                  class="message-icon"
                />
                <img
                  v-if="type == NoticeTypeEnum.Announcement"
                  src="@/assets/images/daiban.png"
                  alt=""
                  class="message-icon"
                />
              </div>
            </el-col>
            <el-col :span="16">
              <div class="message-content">
                <el-text truncated class="message-title">{{ item.content }}</el-text>
                <span class="message-date">{{ item.time }}</span>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" text @click="readNotice(item.key)"> 已读 </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="message-footer">
          <el-button type="primary" text @click="prev" :disabled="pageParam.pageNum <= 1">
            上一页
          </el-button>
          <el-button type="primary" text @click="readAllNotice(NoticeTypeEnum.MESSAGE)">
            全部已读
          </el-button>
          <el-button
            type="primary"
            text
            @click="next"
            :disabled="dataList.length <= pageParam.pageNum * pageParam.pageSize"
          >
            下一页
          </el-button>
        </div>
      </div>
    </div>
    <div class="message-empty" v-else>
      <img src="@/assets/images/empty.png" alt="empty" />
      <div>{{ emptyMessage }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { NoticeTypeEnum } from '@/enums/systemEnum';
  import useNoticeStore from '@/stores/modules/notice';
  import { isNotEmpty } from '@/utils';

  const { t } = useI18n();
  const { readNotice, readAllNotice } = useNoticeStore();

  const props = defineProps({
    dataList: {
      type: Array<Notice.NoticeItem>,
      default: () => [],
    },
    type: {
      type: String,
      default: () => '3',
    },
  });

  /** 空消息 */
  const emptyMessage = ref('');
  /** 消息列表 */
  const noticeAll = ref<Notice.NoticeItem[]>([]);
  const noticeList = ref<Notice.NoticeItem[]>([]);
  /** 总数 */
  const total = ref<number>(0);
  /** 分页 */
  const pageParam = reactive<Page.ReqPage>({
    pageNum: 1,
    pageSize: 3,
  });

  /**
   * @description: 分页
   * @param {*} data 原数据
   * @return {*}
   */
  const startPage = (data: Notice.NoticeItem[]) => {
    const startIndex = (pageParam.pageNum - 1) * pageParam.pageSize;
    const endIndex = startIndex + pageParam.pageSize;
    // 获取指定范围内的子数组
    noticeList.value = data.slice(startIndex, endIndex);
  };

  /**
   * @description: 上一页
   * @return {*}
   */
  const prev = () => {
    --pageParam.pageNum;
    startPage(noticeAll.value);
  };

  /**
   * @description: 下一页
   * @return {*}
   */
  const next = () => {
    ++pageParam.pageNum;
    startPage(noticeAll.value);
  };

  /**
   * @description:
   * @return {*}
   */
  const init = () => {
    pageParam.pageNum = 1;
    startPage(noticeAll.value);
  };

  watch(
    () => props.dataList,
    (nval: Notice.NoticeItem[], oval: any) => {
      if (isNotEmpty(nval)) {
        total.value = nval.length;
        noticeAll.value = nval.filter((item) => !item.read);
        pageParam.pageNum = 1;
        startPage(noticeAll.value);
      } else {
        if (props.type == NoticeTypeEnum.NOTICE) {
          emptyMessage.value = t('header.noneNotice');
        } else if (props.type == NoticeTypeEnum.Announcement) {
          emptyMessage.value = t('header.noneAnnouncement');
        } else {
          emptyMessage.value = t('header.noneMessage');
        }
      }
    },
    { deep: true, immediate: true },
  );

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .message-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 220px;
    line-height: 45px;
  }
  .message-list {
    display: flex;
    flex-direction: column;
    .message-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-light);
      &:last-child {
        border: none;
      }
      .message-icon {
        width: 30px;
        height: 30px;
        // margin: 0 20px 0 5px;
      }
      .message-content {
        display: flex;
        flex-direction: column;
        .message-title {
          align-self: self-start;
          margin-bottom: 5px;
        }
        .message-date {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .message-button {
      display: flex;
      justify-content: flex-end;
      padding-right: 5px;
    }

    .message-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 5px;

      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }
</style>
