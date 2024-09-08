<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-22 16:11:38
 * @FilePath: \aster-flowable-vue\src\views\workflow\app\form-tree-filter.vue
 * @Description: 应用表单选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="tree-box">
    <div class="tree-app">
      <el-select
        v-model="queryParams.appId"
        placeholder="请选择应用"
        clearable
        @change="handleAppChange"
      >
        <el-option
          v-for="appItem in appList"
          :key="appItem.id"
          :label="appItem.name"
          :value="appItem.id"
        />
      </el-select>
    </div>
    <div class="tree-form">
      <tree-filter
        label="formName"
        :data="formList"
        :default-value="formList[0]?.id"
        :show-all="false"
        @change="handleFormClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
  import TreeFilter from '@/components/tree/tree-filter.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { formListApi } from '@/api/workflow/form';
  import { appListApi } from '@/api/workflow/app';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isDef, isNotEmpty } from '@/utils';
  import { useRoute } from 'vue-router';
  import { ElMessage } from 'element-plus';

  let route = useRoute();

  // emit
  const emits = defineEmits(['change']);

  // 应用集合
  const appList = ref<WorkApp.AppInfo[]>([]);
  // 应用信息
  const formList = ref<WorkForm.FormModel[]>([]);
  // 查询参数
  const queryParams = reactive<WorkForm.QueryParams>({
    appId: '',
    formName: '',
  });

  /**
   * @description: 获取表单列表
   * @return {*}
   */
  const getFormList = () => {
    formListApi(queryParams).then(({ data }) => {
      formList.value = data;
      if (isNotEmpty(formList.value) && formList.value[0].id) {
        // 默认选中应用下的第一个表单
        handleFormClick(formList.value[0].id);
      } else {
        handleFormClick('');
      }
    });
  };

  /**
   * @description: 查询应用信息
   * @return {*}
   */
  const handleQueryApp = () => {
    appListApi({}).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        appList.value = res.data;
        // 获取表单list
        getFormList();
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 处理表单点击事件
   * @param {WorkForm.FormModel} formInfo
   * @return {*}
   */
  const handleFormClick = (formId: string) => {
    const formInfo = formList.value.find((item) => item.id == formId);
    const params: WorkForm.QueryParams = {
      id: formInfo?.id,
      code: formInfo?.code,
      appId: formInfo ? formInfo.appId : queryParams.appId,
    };
    emits('change', params);
  };

  /**
   * @description: 应用选择
   * @param {any} e 应用ID
   * @return {*}
   */
  const handleAppChange = (e: any) => {
    if (isDef(e)) {
      queryParams.appId = e;
      getFormList();
    } else {
      formList.value = [];
    }
  };

  onMounted(async () => {
    if (route.query.appId && typeof route.query.appId === 'string') {
      queryParams.appId = route.query.appId;
    }
    // 查询应用信息
    handleQueryApp();
  });
</script>

<style scoped lang="scss">
  .tree-box {
    height: 100%;

    .tree-app {
      height: 32px;
      width: 220px;
      margin-right: 10px;
    }

    .tree-form {
      height: calc(100% - 32px);
    }
  }
</style>
