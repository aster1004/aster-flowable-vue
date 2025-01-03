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
              class="ml-8px"
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
              style="font-size: 14px; float: right; color: var(--el-text-color-regular)"
            >
              {{ dateFormat(instanceItem[0].finishTime as string, 'YYYY-MM-DD HH:mm') }}
            </span>
          </div>

          <!-- 会签头像 -->
          <div class="step-avatar" v-if="instanceItem.length > 1">
            <div v-for="item2 in instanceItem">
              <flow-avatar
                :size="40"
                :avatar="item2.user"
                :show-icon="true"
                :icon="getSignIconByItem(item2, instanceItem)"
                :show-name="true"
              />
            </div>
          </div>

          <div v-for="item in instanceItem">
            <!-- 抄送人显示 type==2  -->
            <div v-if="item.type === '2'" class="step-avatar" style="margin-left: -15px">
              <flow-avatar
                v-for="ccUser in item.ccUsers"
                :size="40"
                :avatar="ccUser"
                :show-icon="false"
                :show-name="true"
              />
            </div>

            <!-- 任务处理人 -->
            <div class="step-assign" v-if="isNotEmpty(item.taskComments)">
              <div class="comment-content">
                <div v-for="comment in item.taskComments">
                  <div
                    class="step-assign-top"
                    v-if="instanceItem.length > 1 || item.taskComments!.length > 1"
                  >
                    <div style="display: flex; flex-direction: row; align-items: center">
                      <flow-avatar
                        :size="30"
                        v-if="item?.user?.avatar"
                        :src="comment?.user?.avatar"
                      />
                      <div style="color: var(--el-text-color-primary); margin-left: -10px">
                        {{
                          isNotEmpty(comment?.user?.realName)
                            ? comment?.user?.realName
                            : comment?.user?.nickName
                        }}
                      </div>
                      <el-tag style="margin-left: 8px" size="small" round>
                        {{ getApproveName(comment.operationType!.approveType) }}
                      </el-tag>
                    </div>
                    <div style="font-size: 13px">
                      {{ dateFormat(comment.createTime as string, 'MM-DD HH:mm') }}
                    </div>
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
                      <div v-if="isNotEmpty(comment?.opinion)">
                        <span>{{ comment?.opinion }}</span>
                      </div>
                      <div class="comment-task-image" v-if="isNotEmpty(comment?.imageList)">
                        <div class="image-preview">
                          <div class="image-list" v-for="img in comment?.imageList">
                            <el-image
                              class="image-item"
                              :src="img.url"
                              :preview-src-list="[img.url]"
                              alt="加载失败"
                            />
                            <!-- <span class="image-actions">
                              <span title="预览" @click="handlePreview(img)">
                                <i class="iconfont icon-zoom-in px-3px"></i>
                              </span>
                              <span title="下载" @click="handleDownload(img)">
                                <i class="iconfont icon-xiazai px-3px"></i>
                              </span>
                            </span> -->
                          </div>
                        </div>
                      </div>

                      <div class="comment-task-image" v-if="isNotEmpty(comment?.fileList)">
                        <div class="file-preview" v-for="file in comment?.fileList">
                          <div class="file-preview-top">
                            <i class="iconfont icon-fujian px-3px"></i>
                            <span class="px-3px">
                              <el-link @click="handlePreviewFile(file)">{{ file.name }}</el-link>
                            </span>
                          </div>
                          <div class="file-preview-bottom">
                            <span class="pl-20px">
                              <el-link type="primary" @click="handlePreviewFile(file)"
                                >预览</el-link
                              >
                            </span>
                            <span class="pl-20px">
                              <el-link type="primary" @click="handleDownloadFile(file)"
                                >下载</el-link
                              >
                            </span>
                          </div>
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
    <el-step v-if="isNotEmpty(lastNode.nodeName)">
      <template #icon>
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

  <!-- 图片预览弹框 -->
  <el-dialog v-model="previewVisible" :title="'预览-' + previewFile.name" :lock-scroll="false">
    <div class="image-preview">
      <img style="width: 100%" :src="previewFile.url" :alt="previewFile.name" />
    </div>
  </el-dialog>
  <!-- 文件预览  -->
  <el-dialog v-model="previewImageVisible" :title="'预览-' + previewFile.name" :lock-scroll="false">
    <div class="image-preview">
      <img w-full :src="previewFile.url" :alt="previewFile.name" />
    </div>
    <template #footer>
      <el-button @click="previewImageVisible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleDownload">{{ $t('button.download') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { isDef, isNotEmpty } from '@/utils';
  import {
    dateFormat,
    getApproveName,
    getInstanceNodeResult,
    getTaskResult,
  } from '@/utils/workflow';
  import FlowAvatar from '@/views/workflow/components/process/processlog/flow-avatar.vue';
  import { ProcessButtonTypeEnum, ProcessResultEnum } from '@/enums/workFlowEnum';
  import { reactive, ref, watchEffect, computed, PropType } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { downloadFileByUrl } from '@/utils/fileUtils';
  // import { ImageUpload } from '@/config/fileConfig';
  import { useI18n } from 'vue-i18n';
  import { PREVIEW_URL } from '@/config';
  import { Base64 } from 'js-base64';
  const { t } = useI18n();

  const props = defineProps({
    processResult: {
      type: Object as PropType<WorkForm.ProcessResult>,
      default: () => {},
    },
  });

  // 最后一个节点
  const lastNode = reactive({
    size: '45px',
    iconFont: 'icon-gengduo1',
    nodeName: '',
    color: '',
  });

  // 显示预览
  const previewVisible = ref<boolean>(false);
  // 预览图片url
  const previewFile = ref<WorkForm.FileModel>({
    name: '',
    url: '',
  });
  // 显示文档预览
  // const previewDocumentVisible = ref<boolean>(false);
  // 显示图片预览
  const previewImageVisible = ref<boolean>(false);
  // 可以预览的文件后缀
  // const fileExtensions = ref(['.pdf', '.doc,.docx', '.xls,.xlsx', '.ppt,.pptx', '.txt,.csv']);

  /**
   * 获取任务处理结果、图标、颜色等
   * @param item
   */
  const getIconByItem = (item: WorkForm.InstanceLogsList) => {
    if (item.length === 1) {
      if (item[0].nodeId === 'root') {
        if (isNotEmpty(item[0].finishTime)) {
          return 'icon-tongyi';
        } else {
          return 'icon-chulizhong';
        }
      } else if (item[0].type === '8') {
        if (isNotEmpty(item[0].finishTime)) {
          return 'icon-tongyi';
        } else {
          return 'icon-chulizhong';
        }
      }
    } else {
      return ''; //getTaskResult(item[0]).icon;
    }
  };

  watchEffect(() => {
    // 构造最后一个节点，包括流程状态
    if (isNotEmpty(props.processResult)) {
      // 获取数组props.instanceLogs的最后一个
      if (props.processResult.approveResult === ProcessResultEnum.PROCESSING) {
        lastNode.iconFont = 'icon-gengduo1';
        lastNode.color = '#A8A8A8';
      } else {
        lastNode.iconFont = 'icon-danxuankuang';
        lastNode.color = '#A8A8A8';
      }
      lastNode.size = '30px';
      lastNode.nodeName =
        props.processResult.approveResult === ProcessResultEnum.END
          ? '审批通过'
          : (props.processResult.approveResultText as string);
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
      // 判断是否是抄送，抄送也是一个节点
      if (item[0].type === '2') {
        return new URL(`../../../../../assets/images/cc.png`, import.meta.url).href;
      } else if (item[0].type === '8') {
        return new URL(`../../../../../assets/images/subprocess.png`, import.meta.url).href;
      } else {
        return item[0].user?.avatar;
      }
    } else {
      // 如果大于1 说明是多人会签
      return new URL(`../../../../../assets/images/countersign.png`, import.meta.url).href;
    }
  };

  /**
   * 获取任务处理结果描述
   * @param item
   */
  const getOperationDesc = (item?: any) => {
    const operationType = item.operationType;
    if (isNotEmpty(operationType) && isDef(operationType)) {
      switch (operationType.approveType) {
        case ProcessButtonTypeEnum.AGREEN:
          return '';
        case ProcessButtonTypeEnum.DISAGREE:
          return '';
        case ProcessButtonTypeEnum.FORWARD:
          return '转交给：' + operationType.targetName;
        case ProcessButtonTypeEnum.RECALL:
          return '退回到节点：' + operationType.targetName;
        case ProcessButtonTypeEnum.AFTERADDSIGN:
          return '加签给：' + operationType.targetName;
        case ProcessButtonTypeEnum.REVOKE:
          return '';
        case ProcessButtonTypeEnum.SUBMIT:
          return '提交';
        default:
          return '未知操作类型！！！';
      }
    }
  };

  /**
   * @description: 预览图片
   * @return {*}
   */
  /* const handlePreview = (file: any) => {
    previewFile.value = {
      name: file.name,
      url: file.url,
    };
    previewVisible.value = true;
  }; */

  /**
   * @description: 下载图片
   * @param {*} file
   * @return {*}
   */
  const handleDownload = (file: any) => {
    if (isNotEmpty(file.url)) {
      ElMessageBox.confirm('是否要下载此图片?', t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      }).then(async () => {
        await downloadFileByUrl(file.url, file.name);
      });
    } else {
      ElMessage.error('图片不存在');
    }
  };

  /**
   * @description: 预览文件
   * @return {*}
   */
  const handlePreviewFile = (file: any) => {
    window.open(PREVIEW_URL + encodeURIComponent(Base64.encode(file.url)));
    /* const extension = file.url.split('.').pop();
    if (ImageUpload.type.join(',').indexOf(extension) != -1) {
      previewFile.value = {
        name: file.name,
        url: file.url,
      };
      previewImageVisible.value = true;
    } else if (fileExtensions.value.join(',').indexOf(extension) != -1) {
      previewDocumentVisible.value = true;
    } else {
      ElMessageBox.confirm('不支持预览此类型的文件,是否要下载查看?', t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      }).then(async () => {
        await downloadFileByUrl(file.url, file.name);
      });
    } */
  };

  /**
   * 下载文件
   * @param file
   */
  const handleDownloadFile = (file: any) => {
    ElMessageBox.confirm('确定要下载此文件?', t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    }).then(async () => {
      await downloadFileByUrl(file.url, file.name);
    });
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
    color: var(--el-text-color-primary);
  }
  ::v-deep(.el-step__title.is-process) {
    color: var(--el-text-color-primary);
    font-weight: normal;
  }

  ::v-deep(.el-step__description) {
    padding-right: 0;
  }

  /*流程title*/
  .step-avatar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    font-weight: normal;
    margin-left: -35px;
    margin-top: 15px;
  }
  /*流程办理人*/
  .step-assign {
    margin-top: 15px;
    font-weight: normal;
    margin-left: -30px;
  }
  .step-assign-top {
    color: var(--el-text-color-secondary);
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
    border: 1px solid var(--el-header-border-color);
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

  .comment-task-image {
    margin: 5px 0;
  }
  .image-preview {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .image-list {
    width: 80px;
    height: 80px;
    border: 1px solid var(--el-header-border-color);
    position: relative;
    border-radius: 5px;
    margin: 5px;
  }
  .image-item {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .image-actions {
    align-items: center;
    background-color: var(--el-overlay-color-lighter);
    cursor: default;
    display: inline-flex;
    font-size: 20px;
    height: 100%;
    justify-content: center;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
  .image-actions:hover {
    opacity: 1;
    border-radius: 6px;
  }
  .image-actions span {
    cursor: pointer;
    display: none;
  }
  .image-actions:hover span {
    display: inline-flex;
  }

  .file-preview {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid var(--el-header-border-color);
    margin: 12px 0;
    padding: 5px;
    .file-preview-top {
      display: -webkit-box; /* 必须配合此属性使用 */
      -webkit-box-orient: vertical; /* 设置为垂直方向 */
      -webkit-line-clamp: 1; /* 显示的行数 */
      overflow: hidden; /* 隐藏超出的内容 */
    }
    .file-preview-bottom {
      color: #409eff;
      color: var(--el-color-primary-light-1);
      font-size: 14px;
      cursor: pointer;
    }
  }
</style>
