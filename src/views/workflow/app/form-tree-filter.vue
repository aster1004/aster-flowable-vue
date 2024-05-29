<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-22 16:11:38
 * @FilePath: \aster-flowable-vue\src\views\workflow\app\form-tree-filter.vue
 * @Description: 应用表单选择器
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card filter">
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
    <el-scrollbar
      :style="{ marginTop: '10px', height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }"
    >
      <div class="form-container" v-if="isNotEmpty(formList) && formList.length > 0">
        <div
          :class="['app', formItem.id == activeId ? 'active' : '']"
          v-for="(formItem, index) in formList"
          :key="index"
          @click="handleClick(formItem)"
        >
          <div class="form-icon">
            <i
              :class="['iconfont', formItem.icon, 'iconStyle']"
              :style="{ backgroundColor: formItem.iconColor }"
            ></i>
          </div>
          <div class="form-name">{{ formItem.formName }}</div>
        </div>
      </div>
      <el-empty description="暂无数据" :image-size="70" v-else />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
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

  const title = ref<string>('应用信息');
  // 应用集合
  const appList = ref<WorkApp.AppInfo[]>([]);
  // 应用信息
  const formList = ref<WorkForm.FormModel[]>([]);
  // 选中的应用ID
  const activeId = ref<string | undefined>('');
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
      if (isNotEmpty(formList.value)) {
        // 默认选中应用下的第一个表单
        handleClick(formList.value[0]);
      } else {
        handleClick();
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
   * @description: 选中表单
   * @param {WorkForm.FormModel} formInfo
   * @return {*}
   */
  const handleClick = (formInfo?: WorkForm.FormModel) => {
    activeId.value = formInfo?.id;
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
    activeId.value = '';
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
  .filter {
    box-sizing: border-box;
    width: 220px;
    height: 100%;
    padding: 18px;
    margin-right: 10px;
    .title {
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-info-dark-2);
      letter-spacing: 0.5px;
    }
    .el-input {
      margin: 0 0 15px;
    }
    .el-scrollbar {
      :deep(.el-tree) {
        height: 80%;
        overflow: auto;
        .el-tree-node__content {
          height: 33px;
        }
      }
      :deep(.el-tree--highlight-current) {
        .el-tree-node.is-current > .el-tree-node__content {
          background-color: var(--el-color-primary);
          .el-tree-node__label,
          .el-tree-node__expand-icon {
            color: white;
          }
          .is-leaf {
            color: transparent;
          }
        }
      }
    }
  }

  .form-container {
    display: flex;
    flex-direction: column;
    .app {
      display: flex;
      height: 45px;
      line-height: 45px;
      text-align: left;
      border-left: 5px solid #ffffff;
      cursor: pointer;
      .form-icon {
        width: 35px;
        text-align: center;
      }
      .form-name {
        flex: 1;
        font-size: 14px;
      }
    }
    .app:hover {
      border-left: 5px solid $primary-color;
      background-color: #fff1f0;
    }
    .active {
      border-left: 5px solid $primary-color;
      background-color: #fff1f0;
    }
  }

  .iconStyle {
    width: 20px;
    height: 20px;
    font-size: 15px;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
  }
</style>
