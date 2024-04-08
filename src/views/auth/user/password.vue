<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-31 17:36:56
 * @FilePath: \aster-admin\src\views\auth\user\password.vue
 * @Description: 修改密码
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('label.user.resetPassword')"
    :lock-scroll="false"
    width="500px"
    draggable
  >
    <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" size="large">
      <el-form-item prop="oldPassword">
        <el-input
          v-model="resetForm.oldPassword"
          type="password"
          :placeholder="t('placeholder.password')"
          show-password
          autocomplete="new-password"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          v-model="resetForm.newPassword"
          type="password"
          :placeholder="t('placeholder.repeatPassword')"
          show-password
          autocomplete="new-password"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ t('button.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="reset(resetFormRef)">
          {{ t('button.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Lock } from '@element-plus/icons-vue';
  import type { ElForm } from 'element-plus';
  import { ElNotification } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';
  import { userResetPwdApi } from '@/api/login';

  const { t } = useI18n();

  type FormInstance = InstanceType<typeof ElForm>;
  const resetFormRef = ref();
  const loading = ref(false);
  const dialogVisible = ref(false);
  const userIds = ref<string[]>([]);

  const init = (keys: string[]) => {
    dialogVisible.value = true;
    // 重置表单
    resetFormRef.value.resetFields();
    userIds.value = keys;
  };

  const validatePassword = (_rule: any, value: any, callback: any) => {
    if (value !== resetForm.oldPassword) {
      callback(new Error(t('error.repeatPassword')));
    } else {
      callback();
    }
  };

  const resetRules = reactive({
    oldPassword: [{ required: true, message: t('placeholder.password'), trigger: 'blur' }],
    newPassword: [
      { required: true, message: t('placeholder.repeatPassword'), trigger: 'blur' },
      { validator: validatePassword, trigger: 'blur' },
    ],
  });

  const resetForm = reactive<Login.ResetPassword>({
    oldPassword: '',
    newPassword: '',
  });

  const reset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (!valid) return;
      loading.value = true;
      try {
        const res = await userResetPwdApi(userIds.value);
        if (res.code == ResultEnum.SUCCESS) {
          ElNotification({
            title: t('header.changePassword'),
            message: t('common.success'),
            type: 'success',
            duration: 3000,
          });
        } else {
          ElNotification({
            title: t('header.changePassword'),
            message: t('common.failed'),
            type: 'error',
            duration: 3000,
          });
        }
        dialogVisible.value = false;
      } finally {
        loading.value = false;
      }
    });
  };

  defineExpose({ init });
</script>
