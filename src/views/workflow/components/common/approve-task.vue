<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-09-06 17:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\approve-task.vue
 * @Description: 处理任务
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="55%"
    :title="buttonInfo?.operation"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <el-form-item label="审核意见">
      <el-input v-model="approveParams.comment" type="textarea" />
    </el-form-item>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { PropType, ref } from 'vue';
  import { completeTaskApi } from '@/api/workflow/task';
  const props = defineProps({
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => ({}),
    },
    // 任务id，有可能为空
    taskId: {
      type: String,
      default: '',
    },
    // 表单id
    formId: {
      type: String,
      default: '',
    },
  });
  const emits = defineEmits(['cancel']); // 关闭详情弹框

  // 是否显示
  const visible = ref(false);
  const buttonInfo = ref<WorkForm.ButtonPermission>();

  const approveParams = ref<WorkForm.ApproveParams>({
    taskId: '',
    comment: '同意',
    signature: '',
    formData: props.formData,
    approveType: 'agree',
  });

  /**
   * @description: 保存
   * @return {*}
   */
  const handleSubmit = () => {
    console.log(approveParams.value);
    approveParams.value.taskId = props.taskId;
    approveParams.value.formId = props.formId;
    console.info('处理待办：', props.taskId);
    completeTaskApi(approveParams.value).then((res) => {
      console.info(res);
    });

    visible.value = false;
    emits('cancel'); // 处理成功，关闭详情
  };

  // 初始化显示
  const init = (item: WorkForm.ButtonPermission) => {
    visible.value = true;
    buttonInfo.value = item;
    approveParams.value.approveType = buttonInfo.value?.name;
  };
  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .serial-number-container {
    height: 250px;
    padding: 0 15px;
    overflow-y: auto;

    .serial-number-list {
      width: 100%;
      .serial-number-item {
        padding-bottom: 3px;
        color: var(--el-text-color-primary);
      }

      .serial-number-icon {
        color: var(--el-color-primary);
      }
    }
  }

  .serial-number-display {
    margin-top: 20px;
    padding: 10px 15px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f3f3f3;
  }

  .custom-input {
    ::v-deep(.el-input-group__append, .el-input-group__prepend) {
      align-items: center;
      background-color: #fff;
      border-radius: 0;
      border-top-right-radius: var(--el-input-border-radius);
      border-bottom-right-radius: var(--el-input-border-radius);
      color: var(--el-color-info);
      display: inline-flex;
      justify-content: center;
      min-height: 100%;
      padding: 0 10px;
      position: relative;
      white-space: nowrap;
    }
  }
</style>
