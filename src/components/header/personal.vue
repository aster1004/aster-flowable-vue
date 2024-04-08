<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-18 14:20:17
 * @FilePath: \aster-flowable-vue\src\components\header\personal.vue
 * @Description: 个人信息
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('header.personalData')"
    width="500px"
    draggable
    :lock-scroll="false"
  >
    <template #default>
      <el-form ref="userFormRef" :model="userInfo" size="large" label-width="90px">
        <el-form-item prop="avatar" :label="t('label.user.avatar')">
          <avatar :avatar="userInfo.avatar" @set-avatar="setAvatar" />
        </el-form-item>
        <el-form-item prop="nickName" :label="t('label.user.nickName')">
          <el-input v-model="userInfo.nickName" :placeholder="t('label.user.nickName')" />
        </el-form-item>
        <el-form-item prop="gender" :label="t('label.user.gender')">
          <el-switch
            v-model="userInfo.gender"
            style="--el-switch-on-color: #93c5fd; --el-switch-off-color: #fda4af"
            inline-prompt
            active-value="0"
            inactive-value="1"
            :active-icon="Male"
            :inactive-icon="Female"
          />
        </el-form-item>
        <el-form-item prop="birthday" :label="t('label.user.birthday')">
          <el-date-picker
            v-model="userInfo.birthday"
            type="date"
            :placeholder="t('label.user.birthday')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item prop="signature" :label="t('label.user.signature')">
          <el-input
            v-model="userInfo.signature"
            :rows="2"
            type="textarea"
            :placeholder="t('label.user.signature')"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">
          {{ t('button.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/stores/modules/user';
  import { Male, Female } from '@element-plus/icons-vue';
  import Avatar from './avatar.vue';
  import { editUserInfoApi } from '@/api/login';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';

  const { t } = useI18n();
  const dialogVisible = ref(false);

  const userStore = useUserStore();
  const userInfo = ref<User.UserInfo>({
    username: '',
    gender: '',
    status: '',
  });

  const setAvatar = (avatar: string) => {
    userInfo.value.avatar = avatar;
  };

  const confirm = () => {
    editUserInfoApi(userInfo.value).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        ElMessage.success(res.data);
        dialogVisible.value = false;
      } else {
        ElMessage.error(res.data);
      }
    });
  };

  const init = () => {
    dialogVisible.value = true;
    userInfo.value = userStore.userInfo;
  };

  defineExpose({ init });
</script>
