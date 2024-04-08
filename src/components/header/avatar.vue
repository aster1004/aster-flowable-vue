<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-23 11:15:14
 * @FilePath: \aster-admin\src\components\header\avatar.vue
 * @Description: 头像
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-avatar :size="40" :src="avatar" @click="avatarVisible = true" />
  <el-dialog
    v-model="avatarVisible"
    width="30%"
    :title="t('label.user.avatar')"
    append-to-body
    :lock-scroll="false"
  >
    <div class="flex flex-col items-center justify-center">
      <el-upload
        class="avatar-uploader"
        :action="ImageUpload.url"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-avatar v-if="props.avatar" :size="178" :src="avatarValue" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <span>{{ t('label.user.uploadAvatar') }}</span>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Plus } from '@element-plus/icons-vue';
  import { ElMessage, UploadProps } from 'element-plus';
  import { ImageUpload } from '@/config/fileConfig';

  const { t } = useI18n();
  const avatarVisible = ref(false);
  const avatarValue = ref('');

  const props = defineProps({
    avatar: {
      type: String,
      default: () => '',
    },
  });
  const emits = defineEmits(['setAvatar']);

  watchEffect(() => {
    avatarValue.value = props.avatar;
  });

  const handleAvatarSuccess: UploadProps['onSuccess'] = (_response, uploadFile) => {
    console.log(_response);
    avatarValue.value = _response.data.url;
    emits('setAvatar', avatarValue.value);
  };

  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (!ImageUpload.type.includes(rawFile.type)) {
      ElMessage.error(t('error.avatarUploadType'));
      return false;
    } else if (rawFile.size / 1024 / 1024 > ImageUpload.maxSize) {
      ElMessage.error(t('error.avatarUploadSize') + ImageUpload.maxSize + '!');
      return false;
    }
    return true;
  };
</script>
<style lang="scss" scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
