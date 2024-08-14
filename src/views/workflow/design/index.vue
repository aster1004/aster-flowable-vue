<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-15 17:45:56
 * @FilePath: \aster-flowable-vue\src\views\workflow\design\index.vue
 * @Description: 流程设计
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-container class="design-container">
    <el-header class="design-header">
      <design-header ref="designHeaderRef" v-model="activeMenu" @save="save" @publish="publish" />
    </el-header>
    <el-main class="design-main">
      <!-- 表单设计 -->
      <form-design ref="formDesignRef" v-show="activeMenu === 'formDesign'" />
      <!-- 流程设计 -->
      <process-design ref="processDesignRef" v-show="activeMenu === 'processDesign'" />
      <!-- 列表设计(必须使用v-if) -->
      <list-design ref="listDesignRef" v-if="activeMenu == 'listDesign'" />
      <!-- 表单设置 -->
      <form-settings ref="formSettingsRef" v-show="activeMenu === 'formSettings'" />
    </el-main>

    <!--  校验弹框  -->
    <el-dialog v-model="validateVisible" title="表单流程设计校验" width="550" :lock-scroll="false">
      <el-steps align-center :active="validateIndex" finish-status="success">
        <el-step
          v-for="(step, i) in validateRefs"
          :title="step.name"
          :key="i"
          :status="step.status"
        />
      </el-steps>
      <el-result :icon="validIcon" :title="errTitle" :subTitle="validateResult.desc">
        <template #icon>
          <el-icon size="30" class="is-loading" v-if="!validateResult.finished">
            <Loading />
          </el-icon>
        </template>
        <template #sub-title>
          <el-scrollbar v-if="validateResult.errs?.length > 0">
            <div class="err-info">
              <el-text tag="div" truncated v-for="(err, i) in validateResult.errs" :key="i">
                <el-icon :size="16">
                  <WarningFilled />
                </el-icon>
                <span style="margin-left: 4px">{{ err }}</span>
              </el-text>
            </div>
          </el-scrollbar>
        </template>
        <template #extra>
          <el-button type="primary" v-if="validateResult.finished" @click="doHandle">
            {{ validateResult.action }}
          </el-button>
        </template>
      </el-result>
    </el-dialog>
  </el-container>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted, getCurrentInstance } from 'vue';
  import DesignHeader from './design-header.vue';
  import FormDesign from '../form/form-design.vue';
  import ProcessDesign from '../process/process-design.vue';
  import ListDesign from '../list/list-design.vue';
  import FormSettings from '../settings/form-settings.vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { formSaveApi } from '@/api/workflow/form';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { WarningFilled, Loading } from '@element-plus/icons-vue';

  const { t } = useI18n();
  //获取当前组件实例对象数组
  const currentInstances: any = getCurrentInstance();
  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 路由
  const route = useRoute();

  // 活动菜单
  const activeMenu = ref('formDesign');
  // 表单设计ref
  const formDesignRef = ref();
  // 流程设计ref
  const processDesignRef = ref();
  // 头部ref
  const designHeaderRef = ref();

  const validateVisible = ref(false);
  //校验结果
  const validateResult = ref<any>({});
  const validIcon = computed(() => {
    if (!validateResult.value.finished) {
      return 'info';
    } else if (validateResult.value.success) {
      return 'success';
    } else {
      return 'warning';
    }
  });
  //错误信息
  const errTitle = computed(() => {
    if (validateResult.value.finished && !validateResult.value.success) {
      return validateResult.value.title + ` (${validateResult.value.errs.length}项错误)`;
    }
    return validateResult.value.title;
  });
  //几个设置页面的ref，如后续添加页面，可以继续添加ref进行校验
  const validateIndex = ref(0);
  const validateRefs = ref([
    { _ref: 'formDesignRef', name: '表单设计', status: '' },
    { _ref: 'processDesignRef', name: '流程设计', status: '' },
  ]);
  /**
   * @description 保存
   */
  const save = () => {
    console.log('save');
    console.log(workFlowStore.design);
    // nextTick(() => {
    //   processDesignRef.value.jsonValue();
    // });
  };
  const reloadValidResult = (isSuccess: boolean) => {
    validateResult.value.finished = true;
    validateResult.value.success = isSuccess;
    validateResult.value.desc = '';
    validateResult.value.action = isSuccess ? '去发布' : '去处理';
    validateResult.value.title = isSuccess ? '校验成功😃' : '校验失败😥，发现';
    validateRefs.value[validateIndex.value].status = isSuccess ? 'success' : 'error';
  };
  /**
   * @description 发布
   */
  const publish = () => {
    console.log('publish');
    //流程设计json
    console.log('流程设计json', workFlowStore.design);
    validate()
      .then(() => {
        reloadValidResult(true);
      })
      .catch((errs) => {
        console.log('发布校验未通过errs-----', errs);
        reloadValidResult(false);
        validateRefs.value[validateIndex.value].status = 'error';
        if (Array.isArray(errs)) {
          validateResult.value.errs.push(...errs);
        }
      });
  };

  // 分步校验流程表单设计
  const validate = async () => {
    validateVisible.value = true;
    validateIndex.value = 0;
    validateResult.value = {
      errs: [],
      finished: false,
      success: false,
      title: '检查中...',
      action: '去处理',
      desc: '正在检查设置项',
    };
    validateRefs.value.forEach((v) => (v.status = ''));
    for (let i = 0; i < validateRefs.value.length; i++) {
      validateIndex.value = i;
      await new Promise((resolve) => setTimeout(resolve, 500));
      let currentRef = validateRefs.value[validateIndex.value]._ref;
      await currentInstances.refs[currentRef].validate();
      validateRefs.value[validateIndex.value].status = 'success';
    }
  };

  // 去对应的页面处理没校验通过的校验结果
  const doHandle = () => {
    if (validateResult.value.success) {
      // 发布
      doSave();
      validateVisible.value = false;
    } else {
      // 移除Ref,和当前活动菜单保持一致
      activeMenu.value = validateRefs.value[validateIndex.value]._ref.replace('Ref', '');
      validateVisible.value = false;
    }
  };

  /**
   * 校验通过后发布
   */
  const doSave = () => {
    console.info(workFlowStore.design);
    formSaveApi(workFlowStore.design).then((res) => {
      console.info('保存成功');
      console.info(res);
      if (res.code == ResultEnum.SUCCESS) {
        ElMessage.success({
          message: t('common.success'),
          duration: 500,
          onClose: () => {},
        });
      } else {
        ElMessage.error({
          message: t('common.failed'),
          duration: 500,
          onClose: () => {},
        });
      }
    });
  };

  onMounted(async () => {
    // 新增
    if (route.query.appId && typeof route.query.appId === 'string') {
      await workFlowStore.initFormInfo(route.query.appId);
    }
    // 编辑
    if (route.query.formId && typeof route.query.formId === 'string') {
      await workFlowStore.loadFormInfo(route.query.formId);
    }
  });
</script>
<style scoped lang="scss">
  .design-container {
    height: 100%;
    background-color: var(--el-bg-color-page);
  }

  .design-header {
    height: 60px;
    padding: 0 !important;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .design-main {
    height: calc(100% - 60px);
    margin: 15px 15px 5px;
    padding: 0 !important;
  }
  .err-info {
    max-height: 200px;
    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2px 5px;
      color: #f56c6c;
    }
  }
</style>
