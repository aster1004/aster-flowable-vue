<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-08 09:53:05
 * @FilePath: \aster-admin\src\views\quartz\log\detail.vue
 * @Description: 日志详情
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="$t('label.quartz.logDetail')"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="50%"
    draggable
  >
    <el-form ref="formDataRef" :model="formData" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.quartz.logId')">{{ formData?.id }}</el-form-item>
          <el-form-item :label="$t('label.quartz.jobName')">{{ formData?.jobName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('label.quartz.jobGroup')">{{ formData?.jobGroup }}</el-form-item>
          <el-form-item :label="$t('label.createTime')">{{ formData?.createTime }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('label.quartz.invokeTarget')">
            {{ formData?.invokeTarget }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('label.quartz.jobMessage')">
            {{ formData?.jobMessage }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('label.quartz.status')">
            <dict-tag dict-type="success_fail" :value="formData?.status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('label.quartz.exceptionInfo')" v-if="formData?.status == '1'">
            {{ formData?.exceptionInfo }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  /** 是否显示 */
  const visible = ref(false);

  const formData = ref<Quartz.LogInfo>();

  const init = (row: Quartz.LogInfo) => {
    visible.value = true;
    formData.value = row;
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  page {
    padding: 0 20rpx;
  }
</style>
