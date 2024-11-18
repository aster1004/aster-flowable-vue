<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-21 17:43:14
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-info.vue
 * @Description: 表单信息
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="form-body">
    <div class="form-detail-render">
      <el-scrollbar>
        <div style="position: relative">
          <form-render
            ref="formRenderRef"
            v-model:form-data="_formData"
            :mode="mode"
            :form-items="formItems"
            :form-info="formInfo"
            style="margin: 8px"
          />
          <div class="form-complete" v-if="formStatus === '9'">
            <img src="@/assets/images/process-complete.png" alt="审批通过" />
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="form-detail-process">
      <div class="vertical-menu" v-if="isCollapse">
        <div @click="handleShowTabs('log')">
          <i class="iconfont icon-shenpi"></i>
          <span>流程日志</span>
        </div>
        <div @click="handleShowTabs('comment')">
          <i class="iconfont icon-xinxi"></i>
          <span>评论</span>
        </div>
      </div>
      <el-scrollbar v-else class="process-content">
        <el-tabs v-model="processActiveName" @tab-change="handleTabChange" class="process-tabs">
          <el-tab-pane label="流程日志" name="log">
            <div style="height: 100%; max-width: 600px">
              <!-- 数据加载中..  -->
              <div
                id="loadingDiv"
                v-if="loadingInstance"
                v-loading="loadingInstance"
                element-loading-text="数据加载中……"
              ></div>
              <div v-else class="w-full flex justify-end items-center">
                <el-button type="primary" link size="small" @click="flowRenderVisible = true">
                  查看流程图
                </el-button>
              </div>
              <flow-logs ref="flowLogsRef" :process-result="processResult" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comment">
            <form-comment :procInstId="procInstId" />
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
      <div class="menu-collapse">
        <div class="ico-button" @click="handleCollapse">
          <i v-if="isCollapse" class="iconfont icon-zuozhijiantou !text-10px"></i>
          <i v-else class="iconfont icon-youzhijiantou !text-10px"></i>
        </div>
      </div>
    </div>
    <el-drawer
      v-if="flowRenderVisible"
      v-model="flowRenderVisible"
      size="60%"
      title="查看流程图"
      append-to-body
      :lock-scroll="false"
    >
      <render-flow :data="props.process" :active-node-id="activeNodeId" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { computed, PropType, ref } from 'vue';
  import FormRender from './form-render.vue';
  import { ElMessage, TabPaneName } from 'element-plus';
  import { getInstanceLogsApi } from '@/api/workflow/task';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import FlowLogs from '@/views/workflow/components/process/processlog/flow-logs.vue';
  import RenderFlow from '@/views/workflow/components/flow/render-flow.vue';
  import FormComment from './form-comment.vue';
  import { ProcessResultEnum } from '@/enums/workFlowEnum';

  const emits = defineEmits(['update:formData']);

  const props = defineProps({
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
      default: 'form',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => ({}),
    },
    formItems: {
      type: Array as PropType<WorkComponent.ComponentConfig[]>,
      default: () => [],
    },
    formInfo: {
      type: Object as PropType<WorkForm.BaseInfo>,
      default: () => ({
        formName: '',
        icon: '',
        iconColor: '',
        labelPosition: '',
        labelWidth: 80,
      }),
    },
    formStatus: {
      type: String,
      default: '',
    },
    process: {
      type: Object,
      default: () => ({}),
    },
    procInstId: {
      type: String,
      default: '',
    },
  });

  const activeNodeId = ref<string[]>([]);

  // 流程日志
  const processResult = ref<WorkForm.ProcessResult>({
    instanceLogs: [],
    approveResult: '',
    approveResultText: '',
  });
  // 折叠状态
  const isCollapse = ref<boolean>(true);
  // 加载中...
  const loadingInstance = ref<boolean>(true);
  // 活动标签
  const processActiveName = ref<string>('log');
  // 显示流程图
  const flowRenderVisible = ref<boolean>(false);

  // 表单数据
  const _formData = computed({
    get() {
      return props.formData;
    },
    set(val) {
      emits('update:formData', val);
    },
  });

  /**
   * @description: 打开流程页签
   * @param {*} activeName 页签name log | comment and so on
   * @return {*}
   */
  const handleShowTabs = (activeName: string) => {
    isCollapse.value = false;
    processActiveName.value = activeName;
    getInstanceLogs();
  };

  /**
   * @description: 页签切换
   * @param tabName
   */
  const handleTabChange = (tabName: TabPaneName) => {
    console.log(tabName);
    getInstanceLogs();
  };

  /**
   * @description: 获取流程日志
   */
  const getInstanceLogs = async () => {
    loadingInstance.value = true;
    processResult.value = { instanceLogs: [], approveResult: '', approveResultText: '' };
    await getInstanceLogsApi(props.procInstId).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        processResult.value = res.data;
        loadingInstance.value = false;
        // 如果是正在进行中
        if (processResult.value.approveResult == ProcessResultEnum.PROCESSING) {
          let instanceLogs = processResult.value.instanceLogs;
          console.info(instanceLogs[instanceLogs.length - 1][0]);
          activeNodeId.value = [instanceLogs[instanceLogs.length - 1][0].nodeId];
        }
      } else {
        ElMessage.error(res.message);
        loadingInstance.value = false;
      }
    });
  };

  /**
   * @description: 折叠
   */
  const handleCollapse = () => {
    isCollapse.value = !isCollapse.value;
    if (!isCollapse.value && isNotEmpty(props.procInstId)) {
      getInstanceLogs();
    }
  };

  defineExpose({
    isCollapse,
  });
</script>
<style scoped lang="scss">
  .form-body {
    display: flex;
    background: var(--el-bg-color-page);
    height: 100%;
    padding-bottom: 0;

    .form-detail-render {
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      background: var(--el-bg-color);
      margin-right: 4px;
      overflow: auto;

      .form-complete {
        position: absolute;
        top: 50px;
        right: 10px;
        z-index: 10;
        pointer-events: none;
        img {
          opacity: 0.6;
        }
      }
    }

    .form-detail-process {
      float: right;
      flex-shrink: 0;
      flex-grow: 0;
      height: 100%;
      position: relative;

      .vertical-menu {
        display: flex;
        flex-direction: column;
        width: 64px;
        height: 100%;
        margin-left: 4px;
        background: var(--el-bg-color);
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0 8px 0;
          cursor: pointer;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: var(--el-text-color-primary);
        }
        div:hover {
          background: var(--el-fill-color-light);
        }
      }

      .menu-collapse {
        position: absolute;
        top: 50%;
        width: 10px;
        height: 40px;
        left: -14px;
        line-height: 40px;
        border-radius: 0 2px 2px 0;
        transform: translateY(-50%);
        background: var(--el-fill-color-dark);
        opacity: 0.6;
        .ico-button {
          height: 100%;
          width: 100%;
          cursor: pointer;
        }
      }

      .process-content {
        width: 400px;
        overflow: auto;
        background-color: #ffffff;
        background: var(--el-bg-color);
        height: 100%;
        .process-tabs {
          padding: 8px 15px;
        }
      }
    }
  }

  /*数据加载中样式*/
  #loadingDiv {
    overflow: hidden;
    z-index: 1000;
    height: 70vh;
    width: 100%;
  }
</style>
