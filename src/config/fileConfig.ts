/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-23 10:47:52
 * @FilePath: \aster-flowable-vue\src\config\fileConfig.ts
 * @Description: 文件配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { useUserStore } from '@/stores/modules/user';

const userStore = useUserStore();

/**
 * @description: 上传图片配置
 * @return {*}
 */
export const ImageUpload = {
  // 上传url
  url:
    import.meta.env.VITE_API_URL + 'aster-flowable/sys/file/upload?access_token=' + userStore.token,
  // 最大尺寸,单位Mb
  maxSize: 10,
  // 图片格式
  type: ['image/gif', 'image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-png', 'image/png'],
};
