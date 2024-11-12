<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-17 17:48:48
 * @FilePath: \aster-flowable-vue\src\components\header\message.vue
 * @Description: 消息提醒
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="message" id="message">
    <el-popover placement="bottom" :width="320" trigger="click">
      <template #reference>
        <el-badge v-if="total > 0" :value="total" class="item">
          <i class="iconfont icon-xiaoxizhongxin toolBar-icon"></i>
        </el-badge>
        <i v-else class="iconfont icon-xiaoxizhongxin toolBar-icon"></i>
      </template>
      <el-tabs v-model="activeName" @tab-change="handleTabChange">
        <!-- 消息 -->
        <el-tab-pane :label="`${t('header.message')}(${messageList.length})`" name="3">
          <notice ref="messageRef" :data-list="messageList" :type="NoticeTypeEnum.MESSAGE" />
        </el-tab-pane>
        <!-- 通知 -->
        <el-tab-pane :label="`${t('header.notice')}(${noticeList.length})`" name="1">
          <notice ref="noticeRef" :data-list="noticeList" :type="NoticeTypeEnum.NOTICE" />
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import useNoticeStore from '@/stores/modules/notice';
  import { useI18n } from 'vue-i18n';
  import { NoticeTypeEnum } from '@/enums/systemEnum';
  import Notice from './notice.vue';

  const noticeStore = storeToRefs(useNoticeStore());
  const { t } = useI18n();
  /** 选中的标签 */
  const activeName = ref(NoticeTypeEnum.MESSAGE);

  /** 消息 */
  const messageList = ref<Notice.NoticeItem[]>([
    { key: '1', content: '一键三连❤❤❤', time: '2023年8月18日', read: false, type: '3' },
    { key: '2', content: '一键三连❤❤❤', time: '2023年8月18日', read: false, type: '3' },
    { key: '3', content: '一键三连❤❤❤', time: '2023年8月18日', read: false, type: '3' },
    { key: '4', content: '一键三连❤❤❤', time: '2023年8月18日', read: false, type: '3' },
    { key: '5', content: '一键三连❤❤❤', time: '2023年8月18日', read: false, type: '3' },
  ]);
  /** 通知 */
  const noticeList = ref<Notice.NoticeItem[]>([]);
  /** 消息总数 */
  const total = computed(() => {
    // return messageList.value.length + noticeList.value.length;
    return 0;
  });

  const messageRef = ref();
  const noticeRef = ref();

  /** 改变选中标签 */
  const handleTabChange = (name: string) => {
    nextTick(() => {
      if (name == NoticeTypeEnum.NOTICE) {
        noticeRef.value.init();
      } else if (name == NoticeTypeEnum.MESSAGE) {
        messageRef.value.init();
      }
    });
  };

  //用深度监听 消息
  watch(
    () => noticeStore.state.value.notices,
    (nval, oval) => {
      noticeList.value = nval.filter(
        (item: Notice.NoticeItem) => !item.read && item.type == NoticeTypeEnum.NOTICE,
      );
    },
    { deep: true, immediate: true },
  );
</script>

<style scoped lang="scss"></style>
