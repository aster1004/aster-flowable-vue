<!--
 * @Author: Lwj
 * @Date: 2024-09-27 11:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\processlog\flow-logs.vue
 * @Description: 流程日志
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-steps style="margin-top: 30px" direction="vertical">
    <el-step v-for="instanceItem in instanceLogs">
      <template #icon>
        <flow-avatar
          :size="45"
          :src="getAvatarByItem(instanceItem)"
          :icon="getIconByItem(instanceItem)"
          :show-icon="true"
        />
      </template>
      <template #title>
        <div>
          <div>
            <div>{{ getInstanceNodeResult(instanceItem)?.nodeName }}</div>
            <span>{{ getInstanceNodeResult(instanceItem)?.text }}</span>
            <span
              style="margin-left: 8px"
              v-if="
                instanceItem.length == 1 && isNotEmpty(getInstanceNodeResult(instanceItem)?.result)
              "
            >
              <el-tag size="small" round>
                {{ getInstanceNodeResult(instanceItem)?.result }}
              </el-tag>
            </span>
            <span
              v-if="instanceItem.length == 1"
              style="font-size: 14px; float: right; color: #8c8c8c"
            >
              {{ dateFormat(instanceItem.startTime as string, 'YYYY-MM-DD HH:mm') }}
            </span>
          </div>

          <!-- 会签头像 -->
          <div class="step-avatar" v-if="instanceItem.length > 1">
            <div v-for="item2 in instanceItem">
              <flow-avatar
                :size="40"
                :avatar="item2"
                :show-icon="true"
                :icon="getSignIconByItem(item2, instanceItem)"
                :show-name="true"
              />
            </div>
          </div>

          <div v-for="item in instanceItem">
            <!-- 任务处理人 -->
            <div class="step-assign" v-if="isNotEmpty(item.taskComments)">
              <div class="comment-content">
                <div v-for="comment in item.taskComments">
                  <div class="step-assign-top" v-if="instanceItem.length > 1">
                    <div style="display: flex; flex-direction: row; align-items: center">
                      <flow-avatar
                        :size="30"
                        v-if="item?.user?.avatar"
                        :src="comment?.user?.avatar"
                      />
                      <div style="color: black; margin-left: -10px">
                        {{ comment?.user?.realName }}
                      </div>
                      <el-tag style="margin-left: 8px" size="small" round>
                        {{ getApproveName(comment.operationType!.approveType) }}
                      </el-tag>
                    </div>
                    <div class="step-title-right" style="font-size: 14px">{{
                      dateFormat(comment.createTime as string, 'YYYY-MM-DD HH:mm')
                    }}</div>
                  </div>
                  <div
                    class="comment-task"
                    v-if="
                      isNotEmpty(comment?.opinion) ||
                      isNotEmpty(comment?.imageList) ||
                      isNotEmpty(comment?.fileList) ||
                      isNotEmpty(getOperationDesc(comment))
                    "
                  >
                    <div class="comment-task-content">
                      <div>
                        <el-tag
                          size="small"
                          type="info"
                          v-if="isNotEmpty(getOperationDesc(comment))"
                        >
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
          </div>
        </div>
      </template>
    </el-step>
    <!--  处理最后一个节点状态  -->
    <el-step>
      <template #icon>
        <!--        <flow-avatar :size="45" :src="lastNode.src" :icon="lastNode.icon" :show-icon="false" />-->
        <i
          :class="`iconfont ${lastNode.iconFont}`"
          :style="{ fontSize: lastNode.size, color: lastNode.color }"
        ></i>
      </template>
      <template #title>
        <div style="margin-top: 10px">{{ lastNode.nodeName }}</div>
      </template>
    </el-step>
  </el-steps>
</template>
<script setup lang="ts">
  import { isDef, isNotEmpty, isUnDef } from '@/utils';
  import {
    dateFormat,
    getApproveName,
    getInstanceNodeResult,
    getTaskResult,
  } from '@/utils/workflow';
  import FlowAvatar from '@/views/workflow/components/process/processlog/flow-avatar.vue';
  import { ProcessButtonTypeEnum, ProcessResultEnum } from '@/enums/workFlowEnum';
  import { reactive, ref, watchEffect, computed, PropType } from 'vue';

  const props = defineProps({
    processResult: {
      type: Object as PropType<WorkForm.ProcessResult>,
      default: () => {},
    },
  });
  const lastNode = reactive({
    size: 45,
    iconFont: 'icon-gengduo1',
    nodeName: '',
    color: '',
  });
  /**
   * 获取任务处理结果、图标、颜色等
   * @param item
   */
  const getIconByItem = (item: WorkForm.InstanceLogsList) => {
    if (item.length === 1) {
      if (item[0].nodeId === 'root') {
        return 'icon-tongyi';
      }
    } else {
      return ''; //getTaskResult(item[0]).icon;
    }
  };
  watchEffect(() => {
    if (isNotEmpty(props.processResult)) {
      // 获取数组props.instanceLogs的最后一个
      if (props.processResult.processResult === ProcessResultEnum.PROCESSING) {
        lastNode.iconFont = 'icon-gengduo1';
        lastNode.color = '#A8A8A8';
      } else {
        lastNode.iconFont = 'icon-danxuankuang';
        lastNode.color = '#A8A8A8';
      }
      lastNode.size = '30px';
      lastNode.nodeName =
        props.processResult.processResult === ProcessResultEnum.END
          ? '审批通过'
          : props.processResult.processResultText;
    }
  });
  const instanceLogs = computed(() => {
    return props.processResult.instanceLogs;
  });
  /**
   * 获取会签头像、图标、icon等
   * @param item
   */
  const getSignIconByItem = (
    item: WorkForm.InstanceLogs,
    instanceLogs: WorkForm.InstanceLogsList,
  ) => {
    // 遍历instanceLogs 查看是否有已完成的任务
    const arr = instanceLogs.filter((item2) => isNotEmpty(item2?.taskComments));
    // OR：或签，AND：会签，ORDER：顺序会签
    if (item.approveType === 'OR') {
      if (arr.length > 0 && isNotEmpty(item.taskComments)) {
        return 'icon-tongyi';
      } else {
        if (arr.length == 0) {
          return 'icon-chulizhong';
        } else {
          return '';
        }
      }
    } else {
      return getTaskResult(item).icon;
    }
  };

  const getAvatarByItem = (item: WorkForm.InstanceLogsList) => {
    if (item.length === 1) {
      return item[0].user?.avatar;
    } else {
      // 如果大于1 说明是多人会签
      return new URL(`../../../../../assets/images/countersign.png`, import.meta.url).href;
    }
  };

  const getOperationDesc = (item?: any) => {
    const operationType = item.operationType;
    if (isNotEmpty(operationType) && isDef(operationType)) {
      switch (operationType.approveType) {
        case ProcessButtonTypeEnum.AGREEN:
          return '';
        case ProcessButtonTypeEnum.DISAGREE:
          return '拒绝';
        case ProcessButtonTypeEnum.FORWARD:
          return '转交给：' + operationType.targetName;
        case ProcessButtonTypeEnum.RECALL:
          return '退回到节点：' + operationType.targetName;
        case ProcessButtonTypeEnum.AFTERADDSIGN:
          return '加签给：' + operationType.targetName;
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
    margin: -10px 0 30px 40px;
  }
  ::v-deep(.el-step__title.is-wait) {
    color: black;
  }
  ::v-deep(.el-step__title.is-process) {
    color: black;
    font-weight: normal;
  }

  ::v-deep(.el-step__description) {
    padding-right: 0;
  }
  ::v-deep(.el-step__line) {
    background-color: #e4e7ed;
  }
  /*流程title*/
  .step-avatar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: #999999;
    font-weight: normal;
    margin-left: -35px;
    margin-top: 15px;
  }
  /* .step-title .step-title-left {
    font-weight: 500;
  }
  .step-title .step-title-right {
    color: #afafaf;
    font-size: 14px;
  }*/
  /*流程办理人*/
  .step-assign {
    margin-top: 5px;
    font-weight: normal;
    margin-left: -30px;
    color: #1a1a1a;
  }
  .step-assign-top {
    color: #999999;
    font-weight: normal;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .comment-content {
    display: flex;
    flex-direction: column;
  }
  .comment-task {
    margin-left: 25px;
    margin-bottom: 15px;
    margin-top: 10px;
    padding: 0 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    background-color: #fafafa;
    border: 1px solid #e6e6e6;
  }
  .comment-task-avatar {
    display: flex;
    justify-content: center;
    width: 20%;
  }
  .comment-task-content {
    padding: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .comment-task-issue {
    color: #1a1a1a;
  }
  .comment-task-image {
    margin: 5px 0;
  }
  .image-preview {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .image-list {
    width: 27%;
    margin: 4px;
    border-radius: 5px;
  }
  ::v-deep(.iconfont::before) {
    background-color: #fff;
  }
</style>
