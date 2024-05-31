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
      <el-tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
        <i :class="[expandClass, 'px-18px']" @click="isFullScreen = !isFullScreen"></i>
      </el-tooltip>
      <el-tooltip content="关闭" placement="bottom">
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
      <el-button @click="handleSave">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { formInfoApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { setDefaultValue } from '@/utils/workflow';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { computed, ref } from 'vue';
  import FormRender from './form-render.vue';
  import { useI18n } from 'vue-i18n';

  // 获取工作流store
  const workFlowStore = useWorkFlowStore();
  // 国际化
  const { t } = useI18n();

  /** 显示 */
  const visible = ref<boolean>(false);
  // 抽屉标题
  const drawerTitle = ref<string>('');
  // 抽屉全屏
  const isFullScreen = ref<boolean>(false);
  // 注册组件
  const formRenderRef = ref();
  // 表单数据
  const formData = ref<WorkForm.FormDataModel>({});

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

  /**
   * @description: 加载表单信息
   * @param {string} id 表单主键
   * @return {*}
   */
  const loadFormInfo = async (formId: string) => {
    await formInfoApi(formId).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        workFlowStore.loadForm(res.data);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 加载实例数据
   * @param {string} formId 表单主键
   * @param {string} instanceId 实例主键
   * @return {*}
   */
  const loadFormData = async (formId: string, instanceId?: string) => {
    console.log('加载实例数据');
    console.log(formId, instanceId);
  };

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
   * @description: 验证表单
   * @return {*}
   */
  const validateForm = async () => {
    let formValidate = false;
    await formRenderRef.value.validate(() => {
      formValidate = true;
    });
    return formValidate;
  };

  /**
   * @description: 暂存
   * @return {*}
   */
  const handleSave = () => {
    console.log('暂存，只保存不发起流程');
    if (!validateForm()) {
      ElMessage.error('表单校验失败！');
      return;
    }
    console.log('暂存--->', formData.value);
  };

  /**
   * @description: 提交
   * @return {*}
   */
  const handleSubmit = () => {
    console.log('提交，发起流程');
    if (!validateForm()) {
      ElMessage.error('表单校验失败！');
      return;
    }
    console.log('提交--->', formData.value);
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = async (formId: string, instanceId?: string) => {
    visible.value = true;
    // 加载表单信息
    await loadFormInfo(formId);

    if (instanceId) {
      // 加载实例数据
      await loadFormData(formId, instanceId);
      // 标题
      drawerTitle.value = _formInfo.value.formName + '-编辑';
    } else {
      // 表单项默认值
      setDefaultValue(_formItems.value, formData.value);
      // 标题
      drawerTitle.value = _formInfo.value.formName + '-新增';
    }
  };

  defineExpose({ init });
</script>
<style scoped lang="scss"></style>
