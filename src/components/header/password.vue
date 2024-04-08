<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-18 14:22:28
 * @FilePath: \aster-admin\src\components\header\password.vue
 * @Description: 修改密码
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('header.changePassword')"
    width="500px"
    draggable
    :lock-scroll="false"
  >
    <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" size="large">
      <el-form-item prop="oldPassword">
        <el-input
          v-model="resetForm.oldPassword"
          type="password"
          :placeholder="t('placeholder.oldPassword')"
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
          :placeholder="t('placeholder.newPassword')"
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
  import { logoutApi } from '@/api/login';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useRouter } from 'vue-router';
  import { LOGIN_URL } from '@/config';
  import { useUserStore } from '@/stores/modules/user';
  import { useAppStore } from '@/stores/modules/app';
  import { editPasswordApi } from '@/api/sys/user';
  import { encrypt } from '@/utils/encrypt';

  const { t } = useI18n();
  const appStore = useAppStore();

  type FormInstance = InstanceType<typeof ElForm>;
  const resetFormRef = ref();
  const loading = ref(false);
  const dialogVisible = ref(false);
  const router = useRouter();
  const userStore = useUserStore();

  // 秘钥
  const secretKey = ref('');

  const init = () => {
    dialogVisible.value = true;
    secretKey.value = appStore.secretKey;
  };

  const validatePassword = (_rule: any, value: any, callback: any) => {
    if (value == resetForm.oldPassword) {
      callback(new Error(t('error.password')));
    } else {
      callback();
    }
  };

  const resetRules = reactive({
    oldPassword: [{ required: true, message: t('placeholder.password'), trigger: 'blur' }],
    newPassword: [
      { required: true, message: t('placeholder.newPassword'), trigger: 'blur' },
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
        // 加密
        const oldPwd = encrypt(resetForm.oldPassword, secretKey.value);
        const newPwd = encrypt(resetForm.newPassword, secretKey.value);

        const res = await editPasswordApi({
          oldPassword: oldPwd,
          newPassword: newPwd,
        });
        if (res.code == ResultEnum.SUCCESS) {
          ElNotification({
            title: t('header.changePassword'),
            message: t('common.success'),
            type: 'success',
            duration: 3000,
          });
          // 成功则退出重新登录
          await logoutApi();
          // 清除 Token
          userStore.setToken('');
          // 重定向到登陆页
          router.replace(LOGIN_URL);
        } else {
          ElNotification({
            title: t('header.changePassword'),
            message: t('common.failed'),
            type: 'error',
            duration: 3000,
          });
        }
      } finally {
        loading.value = false;
      }
    });
  };

  defineExpose({ init });
</script>
