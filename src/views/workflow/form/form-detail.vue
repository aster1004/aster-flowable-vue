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
    :append-to-body="true"
    :before-close="handleBeforeClose"
  >
    <template #header="{ close }">
      <div class="form-header">
        <div class="form-header-content">
          <div class="form-header-left">
            <div class="form-header-title">
              <span :title="_baseFormInfo.formName">{{ _baseFormInfo.formName }}</span>
            </div>
            <div class="form-header-tag">
              <dict-tag dict-type="form_status" :value="formStatus" size="small" />
            </div>
          </div>
          <div class="form-header-right">
            <div class="form-header-action" v-if="isEdit">
              <el-tooltip
                :content="isFooter ? t('workflow.form.closeEdit') : t('workflow.form.edit')"
                placement="bottom"
              >
                <i class="iconfont icon-guanbixiugai" v-if="isFooter" @click="handleEdit"></i>
                <i class="iconfont icon-xiugai" v-else @click="handleEdit"></i>
              </el-tooltip>
            </div>
            <div class="form-header-action">
              <el-tooltip
                :content="isFullScreen ? t('header.exitFullScreen') : t('header.fullScreen')"
                placement="bottom"
              >
                <i :class="expandClass" @click="isFullScreen = !isFullScreen"></i>
              </el-tooltip>
            </div>
            <div class="form-header-action">
              <el-popover placement="bottom" :width="100" trigger="click">
                <ul>
                  <li class="py-2px">
                    <el-button type="primary" link size="small" @click="printFormInfo('default')">
                      {{ t('workflow.form.defaultTemplate') }}
                    </el-button>
                  </li>
                  <li class="py-2px" v-for="(item, index) in _printTemplates" :key="index">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      @click="printFormInfo('custom', item)"
                    >
                      {{ item.title }}
                    </el-button>
                  </li>
                </ul>
                <template #reference>
                  <i class="iconfont icon-dayinji"></i>
                </template>
              </el-popover>
            </div>
            <div class="form-header-action">
              <el-tooltip :content="t('button.close')" placement="bottom">
                <i class="iconfont icon-close" @click="close"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </template>

    <el-tabs
      v-model="activeTab"
      style="height: 100%; width: 100%"
      v-if="isShowAssociationList"
      @tab-change="handleTabChange"
    >
      <el-tab-pane label="详情" name="formDetail" style="height: 100%; width: 100%">
        <form-info
          ref="formInfoRef"
          v-model:form-data="formData"
          :mode="mode"
          :form-items="_formItems"
          :form-info="_baseFormInfo"
          :form-status="formStatus"
          :process="_process"
          :proc-inst-id="procInstId"
        />
      </el-tab-pane>
      <el-tab-pane
        v-for="(item, index) in associationList"
        :key="index"
        :label="item.label"
        :name="item.value"
      >
        <list-association :ref="(el) => setComponentRefs(el, index)" />
      </el-tab-pane>
    </el-tabs>
    <form-info
      v-else
      ref="formInfoRef"
      v-model:form-data="formData"
      :mode="mode"
      :form-items="_formItems"
      :form-info="_baseFormInfo"
      :form-status="formStatus"
      :process="_process"
      :proc-inst-id="procInstId"
    />

    <template #footer v-if="isFooter || buttonPermission.length > 0">
      <div v-if="isFooter">
        <el-button type="primary" @click="superAdminSubmit">{{ $t('button.confirm') }}</el-button>
        <el-button @click="cancel">{{ $t('button.cancel') }}</el-button>
      </div>
      <div v-if="!isFooter && buttonPermission.length > 0">
        <template v-for="item in buttonPermission">
          <el-button type="primary" v-if="item.status" @click="handleAction(item)">
            {{ item.operation }}
          </el-button>
        </template>
      </div>
    </template>

    <print-template-preview
      ref="printTemplateRef"
      :form-data="formData"
      :form-items="_formItems"
      :form-info="_baseFormInfo"
      :form-status="formStatus"
      @end="printCallback"
    />

    <approve-task
      v-if="isNotEmpty(taskId)"
      ref="approveTaskRef"
      :task-id="taskId"
      :form-id="formInfo.id"
      :form-data="formData"
      @cancel="cancel"
    />
  </el-drawer>
</template>
<script setup lang="ts">
  import {
    instanceInfoApi,
    instanceInfoByInstanceIdApi,
    superAdminSubmitApi,
  } from '@/api/workflow/task';
  import { associationListInstanceNumberApi } from '@/api/workflow/assocaition';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { computed, reactive, ref } from 'vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { ElMessage, ElMessageBox, TabPaneName } from 'element-plus';
  import { convertDataTypes, evaluateFormula, setFormPermission } from '@/utils/workflow';
  import FormInfo from './form-info.vue';
  import ListAssociation from '../list/list-association.vue';
  import PrintTemplatePreview from '../settings/print-template/print-template-preview.vue';
  import ApproveTask from '@/views/workflow/components/common/approve-task.vue';
  import { useUserStore } from '@/stores/modules/user';
  import { useI18n } from 'vue-i18n';

  const userStore = useUserStore();
  const { t } = useI18n();

  const emits = defineEmits(['resetQuery']);
  // 显示抽屉
  const visible = ref(false);
  // 抽屉全屏
  const isFullScreen = ref<boolean>(false);
  // 表单类型
  const mode = ref<'design' | 'form' | 'search' | 'table' | 'print'>('form');
  // 表单数据
  const formData = ref<WorkForm.FormDataModel>({});
  // 表单状态
  const formStatus = ref<string>('');
  // 表单实例
  const formInstanceId = ref<string>('');
  // 流程实例id
  const procInstId = ref<string>('');
  // 按钮权限 格式: {name: "agree", operation: "同意", status: true}
  const buttonPermission = ref<WorkForm.ButtonPermission[]>([]);
  // 表单信息
  const formInfo = ref<WorkForm.FormModel>({
    icon: 'iconfont icon-gengduo',
    iconColor: '',
    labelPosition: 'left',
    formName: '未命名表单',
    formItems: [],
    process: {},
    labelWidth: 80,
    listSettings: {
      queryItems: [],
      columns: [],
      sortBy: 'create_time',
      sortDirection: 'desc',
      actions: [],
    },
  });
  // 表单权限
  const formPermission = ref<Process.FormPermissionModel>({});
  // 是否关联表单
  const isAssociated = ref<boolean>(false);
  // 显示footer
  const isFooter = ref<boolean>(false);
  // 活动页签
  const activeTab = ref<string>('formDetail');
  // 关联表单
  const associationList = ref<WorkComponent.TreeNode[]>([]);
  // 注册组件
  const associationListRefs: any[] = [];
  const printTemplateRef = ref();
  const formInfoRef = ref();
  const approveTaskRef = ref();
  // 查询参数
  const queryParams = reactive<Process.InstanceQueryParams>({
    id: '',
    code: '',
    procDefId: '',
  });
  const taskId = ref('');

  // 是否显示关联表单
  const isShowAssociationList = computed(() => {
    return (
      formInfo.value.settings &&
      formInfo.value.settings.associationList &&
      formInfo.value.settings.associationList.length > 0
    );
  });

  /**
   * @description: 超管显示编辑按钮
   * @return {*}
   */
  const isEdit = computed(() => {
    return userStore.isSuperAdmin;
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

  // 设置组件refs
  const setComponentRefs = (el: any, index: number) => {
    if (el) {
      associationListRefs[index] = el;
    }
  };

  /**
   * @description: 点击tab页签
   * @return {*}
   */
  const handleTabChange = (name: TabPaneName) => {
    if (name != 'formDetail') {
      const associationCode = formInfo.value.code ? formInfo.value.code : '';
      const index = associationList.value.findIndex((item) => item.value === name);
      associationListRefs[index].init(name, associationCode, formInstanceId.value);
    }
  };

  /**
   * @description: 提交校验
   * @return {*}
   */
  const submitValidate = () => {
    if (formInfo.value.settings && formInfo.value.settings.submitValidates) {
      const validates = formInfo.value.settings.submitValidates;
      for (let i = 0; i < validates.length; i++) {
        const v = validates[i];
        if (v.enable) {
          const r = evaluateFormula(v.formula, formData.value);
          if (r) {
            ElMessage.error(v.errorMessage);
            return false;
          }
        }
      }
    }
    return true;
  };

  /**
   * @description: 验证表单
   * @return {*}
   */
  const validateForm = async (callback: Function) => {
    // 表单校验
    await formInfoRef.value.validate(() => {
      // 提交校验
      if (submitValidate()) {
        callback();
      }
    });
  };

  /**
   * @description: 编辑
   * @return {*}
   */
  const handleEdit = () => {
    isFooter.value = !isFooter.value;
  };

  /**
   * @description: 超管编辑后的提交
   * @return {*}
   */
  const superAdminSubmit = () => {
    validateForm(() => {
      if (!formInfo.value.code || isEmpty(formInfo.value.code)) {
        ElMessage.error(t('workflow.error.formCode'));
        return;
      } else if (!formData.value || isEmpty(formData.value.id)) {
        ElMessage.error(t('workflow.error.formId'));
        return;
      } else {
        ElMessageBox.confirm(t('common.confirmSubmit'), t('common.tips'), {
          confirmButtonText: t('button.confirm'),
          cancelButtonText: t('button.cancel'),
          type: 'warning',
          lockScroll: false,
        }).then(() => {
          superAdminSubmitApi(formInfo.value.code!, formData.value).then((res) => {
            if (res.code === ResultEnum.SUCCESS) {
              ElMessage.success(res.message);
              visible.value = false;
              emits('resetQuery');
            } else {
              ElMessage.error(res.message);
            }
          });
        });
      }
    });
  };

  /**
   * @description: 处理按钮事件
   * @param item
   */
  const handleAction = (item: WorkForm.ButtonPermission) => {
    console.log('handleAction', item);
    validateForm(() => {
      approveTaskRef.value.init(item);
    });
  };
  /**
   * @description: 打印
   * @return {*}
   */
  const printFormInfo = (type: 'default' | 'custom', template?: WorkForm.PrintTemplate) => {
    if (template) {
      printTemplateRef.value.init(type, template.templateContent);
    } else {
      printTemplateRef.value.init(type);
    }
  };

  /**
   * @description: 打印回调
   * @return {*}
   */
  const printCallback = () => {
    mode.value = 'form';
  };

  /**
   * @description: 关闭
   * @return {*}
   */
  const cancel = () => {
    isFooter.value = false;
    visible.value = false;
    formInfoRef.value.isCollapse = true;
    // 延迟400ms后刷新列表，防止流程状态还没更改过来查询到的数据还是旧的数据
    setTimeout(() => {
      // 提交成功，刷新
      emits('resetQuery');
    }, 400);
  };

  /**
   * @description: 关闭前的处理
   * @return {*}
   */
  const handleBeforeClose = (done: () => void) => {
    formInfoRef.value.isCollapse = true;
    done();
  };

  /**
   * @description: 获取关联表单
   * @param {string} instanceId 流程实例ID
   * @return {*}
   */
  const getAssociationList = async (instanceId: string) => {
    if (isShowAssociationList.value) {
      // 当前表单的编码
      const associationCode = formInfo.value.code ? formInfo.value.code : '';
      // 当前实例ID
      formInstanceId.value = instanceId;

      // 需要显示的关联表单的code
      const associations =
        formInfo.value.settings && formInfo.value.settings.associationList
          ? formInfo.value.settings.associationList.map((item) => item.value)
          : [];

      associationList.value = [];
      await associationListInstanceNumberApi({
        associationCode: associationCode,
        associationInstanceId: instanceId,
        codes: associations,
      }).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          res.data.forEach((item) => {
            const associate = formInfo.value.settings?.associationList?.find(
              (associate) => associate.value === item.code,
            );
            if (associate && associate.value === item.code) {
              associationList.value.push({
                label: associate.label + '(' + item.instanceNumber + ')',
                value: item.code,
              });
            }
          });
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  };

  /**
   * @description: 获取表单信息
   * @param {string} id 表单实例表的ID, 非proc_inst_id
   * @param {string} code 表单编码
   * @param {string} procDefId 流程定义ID
   * @param {boolean} isAssociatedForm 是否关联表单
   * @return {*}
   */
  const getInstanceInfo = async (
    id: string,
    code: string,
    procDefId: string,
    isAssociatedForm = false,
  ) => {
    if (isEmpty(id) || isEmpty(code)) {
      ElMessage.error(t('workflow.error.params'));
      return;
    }
    isAssociated.value = isAssociatedForm;
    // 查询参数
    queryParams.id = id;
    queryParams.code = code;
    queryParams.procDefId = procDefId;
    await instanceInfoApi(queryParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        // 表单信息
        const formDesignInfo = res.data.formInfo;
        if (isNotEmpty(formDesignInfo)) {
          formInfo.value = formDesignInfo;
          // 查询关联表单信息
          getAssociationList(res.data.instanceInfo['proc_inst_id']);
        }
        // 表单权限
        if (res.data.formPermission) {
          formPermission.value = res.data.formPermission;
        }
        // 表单数据
        const instanceInfo = res.data.instanceInfo;
        taskId.value = instanceInfo['taskId'];
        procInstId.value = instanceInfo['proc_inst_id'];
        if (isNotEmpty(instanceInfo)) {
          formStatus.value = instanceInfo['form_status'];
          for (const key in instanceInfo) {
            if (key.indexOf('field') != -1) {
              formData.value[key] = convertDataTypes(
                formInfo.value.formItems,
                key,
                instanceInfo[key],
              );
            } else {
              formData.value[key] = instanceInfo[key];
            }
          }
        }
        // 当前节点配置信息，包括按钮、表单权限
        const nodeConfigInfo = res.data.nodeConfig;
        // 获取按钮权限列表
        if (isNotEmpty(nodeConfigInfo)) {
          buttonPermission.value = nodeConfigInfo?.buttonPermission || [];
        } else {
          buttonPermission.value = [];
        }
        // 显示抽屉
        visible.value = true;
        // 默认不显示footer
        isFooter.value = false;
      } else {
        visible.value = false;
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 通过实例id获取表单信息
   * @param {string} code 表单编码
   * @param {string} procInstId 流程实例id
   * @param {boolean} isAssociatedForm 是否关联表单
   * @return {*}
   */
  const getInstanceInfoByInstanceId = async (
    code: string,
    instanceId: string,
    isAssociatedForm = false,
  ) => {
    if (isEmpty(instanceId) || isEmpty(code)) {
      ElMessage.error(t('workflow.error.params'));
      return;
    }
    procInstId.value = instanceId;
    // 是否关联数据
    isAssociated.value = isAssociatedForm;
    await instanceInfoByInstanceIdApi(code, instanceId).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        // 表单信息
        const formDesignInfo = res.data.formInfo;
        if (isNotEmpty(formDesignInfo)) {
          formInfo.value = formDesignInfo;
          // 查询关联表单信息
          getAssociationList(instanceId);
        }
        // 表单权限
        if (res.data.formPermission) {
          formPermission.value = res.data.formPermission;
        }
        // 表单数据
        const instanceInfo = res.data.instanceInfo;
        taskId.value = instanceInfo['taskId'];
        if (isNotEmpty(instanceInfo)) {
          formStatus.value = instanceInfo['form_status'];
          for (const key in instanceInfo) {
            if (key.indexOf('field') != -1) {
              formData.value[key] = convertDataTypes(
                formInfo.value.formItems,
                key,
                instanceInfo[key],
              );
            }
          }
        }
        // 当前节点配置信息，包括按钮、表单权限
        const nodeConfigInfo = res.data.nodeConfig;
        // 获取按钮权限列表
        if (isNotEmpty(nodeConfigInfo)) {
          buttonPermission.value = nodeConfigInfo?.buttonPermission || [];
        } else {
          buttonPermission.value = [];
        }

        // 显示抽屉
        visible.value = true;
        // 默认不显示footer
        isFooter.value = false;
      } else {
        visible.value = false;
        ElMessage.error(res.message);
      }
    });
  };

  // 表单基本信息
  const _baseFormInfo = computed(() => {
    const info: WorkForm.BaseInfo = {
      formName: formInfo.value.formName,
      icon: formInfo.value.icon,
      iconColor: formInfo.value.iconColor,
      labelPosition: formInfo.value.labelPosition,
      labelWidth: formInfo.value.labelWidth,
    };
    return info;
  });

  // 表单项
  const _formItems = computed(() => {
    const formItems = JSON.parse(JSON.stringify(formInfo.value.formItems));
    // 超管拥有修改表单数据的权限
    if (isFooter.value) {
      setFormPermission(formItems, {}, 'root');
    } else {
      if (formPermission.value) {
        if (isAssociated.value) {
          setFormPermission(formItems, {}, 'other');
        } else {
          setFormPermission(formItems, formPermission.value, 'other');
        }
      }
    }
    return formItems;
  });

  // 流程设计
  const _process = computed(() => {
    return JSON.parse(JSON.stringify(formInfo.value.process));
  });

  // 自定义模板
  const _printTemplates = computed(() => {
    if (formInfo.value.settings && formInfo.value.settings.printTemplates) {
      return JSON.parse(JSON.stringify(formInfo.value.settings.printTemplates));
    } else {
      return [];
    }
  });

  defineExpose({
    getInstanceInfo,
    getInstanceInfoByInstanceId,
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
    color: var(--el-text-color-primary);
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
          color: var(--el-text-color-primary);
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
          color: var(--el-text-color-disabled);
          height: 32px;
          max-width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 32px;
          background: var(--el-bg-color-page);
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }

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
        background: var(--el-bg-color);
        height: 100%;
        .process-tabs {
          padding: 8px 15px;
        }
      }
    }
  }
</style>
