<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-27 17:07:36
 * @FilePath: \aster-flowable-vue\src\views\workflow\form\form-initiation.vue
 * @Description: 发起表单
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-drawer
    v-model="visible"
    :size="drawerSize"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :show-close="false"
    :lock-scroll="false"
    :z-index="666"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="[titleClass]">{{ drawerTitle }}</h4>
      <el-tooltip
        :content="isFullScreen ? t('header.exitFullScreen') : t('header.fullScreen')"
        placement="bottom"
      >
        <i :class="[expandClass, 'px-18px']" @click="isFullScreen = !isFullScreen"></i>
      </el-tooltip>
      <el-tooltip :content="t('button.close')" placement="bottom">
        <i class="iconfont icon-close px-18px" @click="close"></i>
      </el-tooltip>
    </template>
    <form-render
      ref="formRenderRef"
      v-model:form-data="formData"
      :form-items="_formItems"
      :form-info="_formInfo"
    />
    <template #footer>
      <el-button @click="handleSave">{{ t('button.tmp') }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{ t('button.submit') }}</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import {
    convertDataTypes,
    evaluateFormula,
    setDefaultValue,
    setFormPermission,
  } from '@/utils/workflow';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { computed, ref } from 'vue';
  import FormRender from './form-render.vue';
  import { useI18n } from 'vue-i18n';
  import { formSubmitApi, instanceInfoApi, instanceInfoByInstanceIdApi } from '@/api/workflow/task';
  import { dynamicValidateApi } from '@/api/workflow/validate';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';

  const emits = defineEmits(['resetQuery']); // 关闭详情弹框
  // 获取工作流store
  const workFlowStore = useWorkFlowStore();
  // 国际化
  const { t } = useI18n();

  /** 显示 */
  const visible = ref<boolean>(false);
  /** 抽屉标题 */
  const drawerTitle = ref<string>('');
  /** 抽屉全屏 */
  const isFullScreen = ref<boolean>(false);
  // 注册组件
  const formRenderRef = ref();
  /** 表单ID */
  const formId = ref<string>('');
  /** 表单数据 */
  const formData = ref<WorkForm.FormDataModel>({});
  /** 表单权限 */
  const formPermission = ref<Process.FormPermissionModel>({});

  /** 表单信息 */
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
   * @description: 表单项
   */
  const _formItems = computed(() => {
    const formItems = JSON.parse(JSON.stringify(workFlowStore.design.formItems));
    if (formPermission.value && Object.keys(formPermission.value).length > 0) {
      setFormPermission(formItems, formPermission.value, 'root');
    }
    return formItems;
  });

  /**
   * @description 表单基本信息
   */
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

  /**
   * @description: 关闭
   * @return {*}
   */
  const handleClose = () => {
    ElMessageBox.confirm('离开后将会放弃本次填写的内容', '数据未保存，确定离开吗?', {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        visible.value = false;
      })
      .catch(() => {});
  };

  /**
   * @description: 提交校验
   * @return {*}
   */
  const submitValidate = () => {
    if (workFlowStore.design.settings && workFlowStore.design.settings.submitValidates) {
      const validates = workFlowStore.design.settings.submitValidates;
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
    await formRenderRef.value.validate(() => {
      // 提交校验
      if (submitValidate()) {
        callback();
      }
    });
  };

  /**
   * @description: 暂存
   * @return {*}
   */
  const handleSave = () => {
    console.log('暂存，只保存不发起流程');
    validateForm(() => {
      console.log('暂存--->', formData.value);
    });
  };

  /**
   * @description: 提交
   * @return {*}
   */
  const handleSubmit = () => {
    validateForm(() => {
      console.log('提交--->', formData.value);
      let submitFormData = {
        formId: formId.value,
        formStatus: '0',
        formData: formData.value,
      };
      // 动态校验表单
      dynamicValidateApi(submitFormData).then(() => {
        // 提交表单
        formSubmitApi(submitFormData).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success({
              message: t('common.success'),
              duration: 500,
              onClose: () => {
                visible.value = false;
                emits('resetQuery'); // 提交成功，刷新列表
              },
            });
          }
        });
      });
    });
  };

  /**
   * @description: 加载表单信息
   * @return {*}
   */
  const loadFormInfo = async (code: string) => {
    await instanceInfoApi({ code: code }).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        // 表单配置信息
        workFlowStore.design = res.data.formInfo;
        if (res.data.formInfo.id) {
          formId.value = res.data.formInfo.id;
        }
        // 流程节点的表单权限
        if (res.data.formPermission) {
          formPermission.value = res.data.formPermission;
        }
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = async (code: string) => {
    // 加载表单信息
    await loadFormInfo(code);
    // 表单项默认值
    await setDefaultValue(_formItems.value, formData.value);
    // 标题
    drawerTitle.value = _formInfo.value.formName + '-新增';
    visible.value = true;
  };

  /**
   * @description: 再次提交表单数据初始化
   * @return {*}
   */
  const initAgain = async (code: string, procInstId: string) => {
    // 加载表单信息
    await getFormData(code, procInstId);
    // 标题
    drawerTitle.value = _formInfo.value.formName + '-再次提交';
  };

  /**
   * 初始化表单信息
   * @param code
   * @param instanceId
   */
  const getFormData = async (code: string, instanceId: string) => {
    await instanceInfoByInstanceIdApi(code, instanceId).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        // 表单信息
        formInfo.value = res.data.formInfo;
        workFlowStore.design = formInfo.value;
        if (res.data.formInfo.id) {
          formId.value = res.data.formInfo.id;
        }
        // 流程节点的表单权限
        if (res.data.formPermission) {
          formPermission.value = res.data.formPermission;
        }
        // 表单数据
        const instanceInfo = res.data.instanceInfo;
        if (isNotEmpty(instanceInfo)) {
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
        visible.value = true;
      }
    });
  };

  defineExpose({ init, initAgain });
</script>
<style scoped lang="scss"></style>
