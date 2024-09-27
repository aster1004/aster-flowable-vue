<!--
 * @Author: Lwj
 * @Date: 2024-09-27 11:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\processlog\flow-logs.vue
 * @Description: 流程日志
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-steps style="margin-top: 20px" direction="vertical">
    <el-step v-for="item in instanceLogs">
      <template #icon>
        <flow-avatar
          :size="45"
          :src="item.user?.avatar"
          :icon="getIconByItem(item)"
          :show-icon="true"
        />
      </template>
      <template #title>
        <div class="step-title">
          <div class="step-title-left">{{ item.nodeName }}</div>
          <div class="step-title-right">{{ dateFormat(item.startTime, 'MM-DD HH:mm') }}</div>
        </div>
        <!-- 任务处理人 -->
        <div class="step-assign">
          <div>
            <span style="margin-right: 8px"> {{ item.user?.realName }}</span>
            <el-tag
              size="default"
              v-if="item.nodeId !== 'root'"
              round
              :type="getTaskResult(item).type"
            >
              {{ getTaskResult(item).text }}
            </el-tag>
          </div>
        </div>
      </template>
      <template #description>
        <!-- 任务明细展示  -->
        <div class="comment-content">
          <div v-if="isNotEmpty(item.taskComments)">
            <div v-for="comment in item.taskComments">
              <div class="comment-task">
                <div class="comment-task-avatar">
                  <flow-avatar :size="40" :src="comment?.user?.avatar" :show-icon="false" />
                </div>

                <div class="comment-task-content">
                  <div>
                    <el-tag size="small">
                      {{ getOperationDesc(comment) }}
                    </el-tag>
                  </div>
                  <div class="comment-task-issue" v-if="isNotEmpty(comment?.opinion)">
                    <span>{{ comment?.opinion }}</span>
                  </div>
                  <div class="comment-task-image" v-if="isNotEmpty(comment?.imageList)">
                    <div class="image-preview">
                      <img
                        class="image-list"
                        v-for="img in comment?.imageList"
                        :src="img.url"
                        :alt="img.name"
                      />
                    </div>
                  </div>
                  <!--附件回显-->
                  <div class="comment-task-image" v-if="isNotEmpty(comment?.fileList)">
                    <div style="color: #1e83e9" v-for="file in comment?.imageList">
                      <span>{{ file.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-step>
  </el-steps>
</template>
<script setup lang="ts">
  import { isDef, isNotEmpty } from '@/utils';
  import { dateFormat, getTaskResult } from '@/utils/workflow';
  import FlowAvatar from '@/views/workflow/components/process/processlog/flow-avatar.vue';
  import { ProcessButtonTypeEnum } from '@/enums/workFlowEnum';
  const props = defineProps({
    instanceLogs: {
      type: Array<WorkForm.InstanceLogs>,
      default: () => [],
    },
  });

  /**
   * 获取任务处理结果、图标、颜色等
   * @param item
   */
  const getIconByItem = (item: WorkForm.InstanceLogs) => {
    if (item.nodeId === 'root') {
      return 'icon-tongyi';
    } else {
      return getTaskResult(item).icon;
    }
  };

  const getOperationDesc = (item?: any) => {
    console.log(item);
    const operationType = item.operationType;
    console.log(operationType);
    if (isNotEmpty(operationType) && isDef(operationType)) {
      switch (operationType.approveType) {
        case ProcessButtonTypeEnum.AGREEN:
          return '同意';
        case ProcessButtonTypeEnum.DISAGREE:
          return '拒绝';
        case ProcessButtonTypeEnum.FORWARD:
          return '转交给了' + operationType.targetName;
        case ProcessButtonTypeEnum.RECALL:
          return '退回到节点' + operationType.targetName;
        case ProcessButtonTypeEnum.AFTERADDSIGN:
          return '加签给' + operationType.targetName;
        case ProcessButtonTypeEnum.REVOKE:
          return '撤销';
        default:
          return '未知操作类型！！！';
      }
    }
  };
</script>
<style scoped lang="scss">
  /* 流程日志 */
  ::v-deep(.is-vertical .el-step__icon.is-icon) {
    width: 60px;
  }
  ::v-deep(.is-vertical .el-step__line) {
    left: 30px;
  }
  ::v-deep(.is-vertical .el-step__main) {
    margin: -15px 0 40px 40px;
  }

  ::v-deep(.el-step__description) {
    padding-right: 0;
  }
  ::v-deep(.el-step__line) {
    background-color: var(--el-color-primary);
  }
  /*流程title*/
  .step-title {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #999999;
    font-weight: normal;
  }
  .step-title .step-title-left {
    font-weight: 500;
  }
  .step-title .step-title-right {
    color: #afafaf;
    font-size: 14px;
  }
  /*流程办理人*/
  .step-assign {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    font-weight: normal;
    color: #1a1a1a;
  }
  .comment-content {
    display: flex;
    margin-left: -30px;
    flex-direction: column;
  }
  .comment-task {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
  }
  .comment-task-avatar {
    display: flex;
    justify-content: center;
    width: 20%;
  }
  .comment-task-content {
    padding: 5px;
    width: 79%;
    display: flex;
    flex-direction: column;
  }
  .comment-task-issue {
    margin: 5px 0 0;
    color: #1a1a1a;
  }

  .image-preview {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .image-list {
    width: 25%;
    margin: 2px;
  }
</style>
