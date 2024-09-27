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
            <div> </div>
            <div style="height: 100%; max-width: 600px">
              <flow-logs ref="flowLogsRef" :instance-logs="instanceLogs" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comment">Config</el-tab-pane>
        </el-tabs>
      </el-scrollbar>
      <div class="menu-collapse">
        <div class="ico-button" @click="isCollapse = !isCollapse">
          <i v-if="isCollapse" class="iconfont icon-zuozhijiantou !text-10px"></i>
          <i v-else class="iconfont icon-youzhijiantou !text-10px"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, PropType, ref } from 'vue';
  import FormRender from './form-render.vue';
  import { TabPaneName } from 'element-plus';
  import { getInstanceLogsApi } from '@/api/workflow/task';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import FlowLogs from '@/views/workflow/components/process/processlog/flow-logs.vue';
  const emits = defineEmits(['update:formData']);

  const props = defineProps({
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
    procInstId: {
      type: String,
      default: '',
    },
  });
  const instanceLogs = ref<WorkForm.InstanceLogs[]>([]);
  // 折叠状态
  const isCollapse = ref<boolean>(true);
  // 活动标签
  const processActiveName = ref<string>('log');

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

  const getInstanceLogs = () => {
    instanceLogs.value = [];
    console.log(props.procInstId);
    getInstanceLogsApi(props.procInstId).then((res) => {
      console.info(res);
      if (res.code == ResultEnum.SUCCESS) {
        console.info(res);
        instanceLogs.value = res.data;
        console.log(instanceLogs.value);
      }
    });
  };

  onMounted(() => {
    if (isNotEmpty(props.procInstId)) {
      getInstanceLogs();
    }
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
</style>
