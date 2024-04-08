<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-06 11:16:12
 * @FilePath: \aster-admin\src\views\log\operation\oper-detail.vue
 * @Description: 操作日志详情
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="$t('button.detail')"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="50%"
    draggable
  >
    <el-form ref="formDataRef" :model="formData" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="username" :label="$t('label.operation.username')">
            <el-input v-model="formData.username" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="module" :label="$t('label.operation.module')">
            <el-input v-model="formData.module" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="name" :label="$t('label.operation.name')">
            <el-input v-model="formData.name" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="businessType" :label="$t('label.operation.businessType')">
            <dict-tag dict-type="business_type" :value="formData.businessType" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="requestUri" :label="$t('label.operation.requestUri')">
            <el-input v-model="formData.requestUri" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="requestMethod" :label="$t('label.operation.requestMethod')">
            <el-input v-model="formData.requestMethod" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="requestParams" :label="$t('label.operation.requestParams')">
            <el-input v-model="formData.requestParams" :rows="2" type="textarea" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="ip" :label="$t('label.operation.ip')">
            <el-input v-model="formData.ip" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="address" :label="$t('label.operation.address')">
            <el-input v-model="formData.address" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="userAgent" label="User Agent">
            <el-input v-model="formData.userAgent" :rows="3" type="textarea" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="duration" :label="$t('label.operation.duration')">
            <el-input v-model="formData.duration" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="operTime" :label="$t('label.operation.operTime')">
            <el-input v-model="formData.operTime" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.operation.status')">
            <dict-tag dict-type="success_fail" :value="formData.status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="resultMsg" :label="$t('label.operation.resultMsg')">
            <el-input v-model="formData.resultMsg" :rows="2" type="textarea" readonly />
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
  import { reactive, ref } from 'vue';
  import { isNotEmpty } from '@/utils';
  import { logOperationDetailApi } from '@/api/sys/log';
  import DictTag from '@/components/dict/dict-tag.vue';

  /** 是否显示 */
  const visible = ref(false);
  /** 注册组件 */
  const formDataRef = ref();
  /** 表单内容 */
  const formData = reactive<Log.OperationInfo>({});

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
    formData.id = '';
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }

    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      getDataInfo(key);
    }
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getDataInfo = (key: string) => {
    logOperationDetailApi(key).then(({ data }) => {
      Object.assign(formData, data);
    });
  };

  defineExpose({
    init,
  });
</script>
