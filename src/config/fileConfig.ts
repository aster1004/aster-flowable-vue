/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-23 10:47:52
 * @FilePath: \aster-flowable-vue\src\config\fileConfig.ts
 * @Description: 文件配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { useUserStore } from '@/stores/modules/user';
import { isEmpty } from '@/utils';

const userStore = useUserStore();

// 允许上传的文件类型
export const AcceptList: { label: string; value: string; type: string }[] = [
  { label: '图像', value: 'image/*', type: 'image' },
  { label: '视频', value: 'video/*', type: 'video' },
  { label: '音频', value: 'audio/*', type: 'audio' },
  {
    label: '文档',
    value: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv',
    type: 'doc',
  },
  { label: '压缩', value: '.zip,.rar,.7z,.tar.gz', type: 'zip' },
  { label: '其他', value: '.html,.css,.js,.json,.vue,.java,.class,.exe', type: 'other' },
];

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

/**
 * @description: 上传附件配置
 * @return {*}
 */
export const FileUpload = {
  // 上传url
  url:
    import.meta.env.VITE_API_URL + 'aster-flowable/sys/file/upload?access_token=' + userStore.token,
  // 最大尺寸,单位Mb
  maxSize: 20,
  // 附件格式
  type: {
    image: ['image/gif', 'image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-png', 'image/png'],
    video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-flv', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    doc: [
      'text/plain',
      'text/csv',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    zip: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
    ],
    other: [
      'text/html',
      'text/css',
      'application/javascript',
      'application/json',
      'text/vue',
      'text/java',
      'application/java-vm',
      'application/x-msdownload',
    ],
  },
};

/**
 * 通过可接受类型获取文件类型
 */
export const getFileTypeByAccept = (acceptValue: string) => {
  if (isEmpty(acceptValue)) {
    return '';
  }
  let fileTypes: string[] = [];
  const accept = AcceptList.filter((m) => m.value === acceptValue);
  if (accept && accept.length > 0) {
    accept.forEach((m) => {
      const fileType: string[] = FileUpload.type[m.type];
      fileTypes.push(...fileType);
    });
  }
  return fileTypes ? fileTypes.join(',') : '';
};
