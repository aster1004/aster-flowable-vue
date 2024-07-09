<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-07-04 15:25:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-detail.vue
 * @Description: 表单详情
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-drawer
    v-model="visible"
    :show-close="false"
    :lock-scroll="false"
    :size="drawerSize"
    style="background-color: #f5f7fa !important"
  >
    <template #header="{ close }">
      <div class="form-header">
        <div class="form-header-content">
          <div class="form-header-left">
            <div class="form-header-title">
              <span :title="_formInfo.formName">{{ _formInfo.formName }}</span>
            </div>
            <div class="form-header-tag">
              <dict-tag dict-type="form_status" :value="formStatus" size="small" />
            </div>
          </div>
          <div class="form-header-right">
            <div class="form-header-action" v-if="isEdit">
              <el-tooltip content="编辑" placement="bottom">
                <i class="iconfont icon-bianji" @click="handleEdit"></i>
              </el-tooltip>
            </div>
            <div class="form-header-action">
              <el-tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
                <i :class="expandClass" @click="isFullScreen = !isFullScreen"></i>
              </el-tooltip>
            </div>
            <div class="form-header-action">
              <el-tooltip content="关闭" placement="bottom">
                <i class="iconfont icon-close" @click="close"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="form-body">
      <div class="form-detail-render">
        <el-scrollbar>
          <div style="position: relative">
            <form-render
              ref="formRenderRef"
              v-model:form-data="formData"
              :form-items="_formItems"
              :form-info="_formInfo"
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
        <div class="process-content" v-else>
          <el-tabs v-model="processActiveName" class="process-tabs">
            <el-tab-pane label="流程日志" name="log">User</el-tab-pane>
            <el-tab-pane label="评论" name="comment">Config</el-tab-pane>
          </el-tabs>
        </div>
        <div class="menu-collapse">
          <div class="ico-button" @click="isCollapse = !isCollapse">
            <i v-if="isCollapse" class="iconfont icon-zuozhijiantou !text-10px"></i>
            <i v-else class="iconfont icon-youzhijiantou !text-10px"></i>
          </div>
        </div>
      </div>
    </div>
    <template #footer v-if="isFooter">
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="cancel">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { instanceInfoApi } from '@/api/workflow/instance';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { computed, reactive, ref } from 'vue';
  import FormRender from './form-render.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { ElMessage } from 'element-plus';
  import { convertDataTypes } from '@/utils/workflow';

  const workFlowStore = useWorkFlowStore();

  // 显示抽屉
  const visible = ref(false);
  // 抽屉全屏
  const isFullScreen = ref<boolean>(false);
  // 表单数据
  const formData = ref<WorkForm.FormDataModel>({});
  // 表单状态
  const formStatus = ref<string>('');
  // 折叠状态
  const isCollapse = ref<boolean>(true);
  // 活动标签
  const processActiveName = ref<string>('log');
  // 显示footer
  const isFooter = ref<boolean>(false);

  // 查询参数
  const queryParams = reactive<Process.InstanceQueryParams>({
    id: '',
    code: '',
    procDefId: '',
  });

  /**
   * @description: 是否可编辑
   * @return {*}
   */
  const isEdit = computed(() => {
    //TODO 表单详情编辑权限
    return true;
  });

  /**
   * @description: 抽屉大小
   * @return {*}
   */
  const drawerSize = computed(() => {
    return isFullScreen.value ? '100%' : '80%';
  });

  /**
   * @description: 全屏图标改变
   * @return {*}
   */
  const expandClass = computed(() => {
    return isFullScreen.value ? 'iconfont icon-suoxiao' : 'iconfont icon-quanping';
  });

  /**
   * @description: 打开流程页签
   * @param {*} activeName 页签name
   * @return {*}
   */
  const handleShowTabs = (activeName: string) => {
    isCollapse.value = false;
    processActiveName.value = activeName;
  };

  /**
   * @description: 编辑
   * @return {*}
   */
  const handleEdit = () => {
    isFooter.value = true;
  };

  /**
   * @description: 提交
   * @return {*}
   */
  const submit = () => {
    console.log('submit');
  };

  /**
   * @description: 关闭
   * @return {*}
   */
  const cancel = () => {
    isFooter.value = false;
    visible.value = false;
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = async (id: string, code: string, procDefId: string) => {
    if (isEmpty(id) || isEmpty(code)) {
      ElMessage.error('参数错误');
      return;
    }
    // 查询参数
    queryParams.id = id;
    queryParams.code = code;
    queryParams.procDefId = procDefId;
    await instanceInfoApi(queryParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        // 显示抽屉
        visible.value = true;
        // 默认不显示footer
        isFooter.value = false;

        const instanceInfo = res.data.instanceInfo;
        const formDesignInfo = res.data.formInfo;
        if (isNotEmpty(instanceInfo)) {
          formStatus.value = instanceInfo['form_status'];
          for (const key in instanceInfo) {
            if (key.indexOf('field') != -1) {
              formData.value[key] = convertDataTypes(_formItems.value, key, instanceInfo[key]);
            }
          }
        }
        if (isNotEmpty(formDesignInfo)) {
          workFlowStore.design = formDesignInfo;
        }
      } else {
        visible.value = false;
        ElMessage.error(res.message);
      }
    });
  };

  // 表单项
  const _formItems = computed(() => {
    const formItems = JSON.stringify(workFlowStore.design.formItems);
    return JSON.parse(formItems);
  });

  // 表单基本信息
  const _formInfo = computed(() => {
    const formInfo: WorkForm.BaseInfo = {
      formName: workFlowStore.design.formName,
      icon: workFlowStore.design.icon,
      iconColor: workFlowStore.design.iconColor,
      labelPosition: workFlowStore.design.labelPosition,
      labelWidth: workFlowStore.design.labelWidth,
    };
    return formInfo;
  });

  defineExpose({
    init,
  });
</script>

<style scoped lang="scss">
  ::v-deep(.el-tag__content) {
    font-size: 12px !important;
    padding: 0 12px;
    font-weight: 400;
    border-radius: 20px;
  }

  .form-header {
    width: 100%;
    margin: 0;
    color: #304265;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;

    .form-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .form-header-left {
        display: flex;
        align-items: center;

        .form-header-title {
          display: inline-block;
          font-size: 18px;
          color: #304265;
          font-weight: 700;
        }

        .form-header-tag {
          line-height: 20px;
          margin-left: 12px;
        }
      }

      .form-header-right {
        display: flex;
        align-items: center;
        z-index: 1;

        .form-header-action {
          margin-right: 12px;
          padding: 0 8px;
          font-size: 14px;
          color: #8893a7;
          height: 32px;
          max-width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 32px;
          background: #f5f7fa;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }

  .form-body {
    display: flex;
    background: #f5f7fa;
    height: 100%;
    padding-bottom: 0;

    .form-detail-render {
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      background: #fff;
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
        background: #fff;
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
          color: #304265;
        }
        div:hover {
          background: #f4f8fc;
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
        background: #e0e3e9;
        opacity: 0.6;
        .ico-button {
          height: 100%;
          width: 100%;
          cursor: pointer;
        }
      }

      .process-content {
        width: 400px;
        background: #fff;
        height: 100%;
        .process-tabs {
          padding: 8px 15px;
        }
      }
    }
  }
</style>
