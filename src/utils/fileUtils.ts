/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-01 09:55:16
 * @FilePath: \aster-flowable-vue\src\utils\fileUtils.ts
 * @Description: 文件工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { ElMessage, ElNotification } from 'element-plus';
import axios from 'axios';

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法 (必传)
 * @param {String} tempName 导出的文件名 (必传)
 * @param {Object} params 导出的参数 (默认{})
 * @param {Boolean} isNotify 是否有导出消息提示 (默认为 true)
 * @param {String} fileType 导出的文件格式 (默认为.xlsx)
 */
export const downloadFile = async (
  api: (params: any) => Promise<any>,
  tempName: string,
  params: any = {},
  isNotify: boolean = true,
  fileType: string = '.xlsx',
) => {
  if (isNotify) {
    ElNotification({
      title: '温馨提示',
      message: '如果数据庞大会导致下载缓慢哦，请您耐心等待！',
      type: 'info',
      duration: 3000,
    });
  }
  try {
    const res = await api(params);
    const blob = new Blob([res]);
    // 兼容 edge 不支持 createObjectURL 方法
    if ('msSaveOrOpenBlob' in navigator)
      return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
    const blobUrl = window.URL.createObjectURL(blob);
    const exportFile = document.createElement('a');
    exportFile.style.display = 'none';
    exportFile.download = `${tempName}${fileType}`;
    exportFile.href = blobUrl;
    document.body.appendChild(exportFile);
    exportFile.click();
    // 去除下载对 url 的影响
    document.body.removeChild(exportFile);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description 下载文件
 * @param {String} url 下载地址
 * @param {String} filename 文件名
 * @param {String} method 请求方式
 */
export const downloadFileByUrl = async (
  url: string,
  filename?: string,
  method: string = 'GET',
): Promise<any> => {
  return axios({
    responseType: 'blob',
    url: url,
    method: method,
  })
    .then((res: any): any => {
      console.log('down-url--->');
      console.log(res);
      // 创建a标签
      const down = document.createElement('a');
      // 文件名没传，则使用时间戳
      down.download = filename || new Date().getTime().toString();
      // 隐藏a标签
      down.style.display = 'none';

      // 创建下载url
      let binaryData: any[] = [];
      binaryData.push(res.data);
      down.href = URL.createObjectURL(new Blob(binaryData));

      // 模拟点击下载
      document.body.appendChild(down);
      down.click();

      // 释放URL
      URL.revokeObjectURL(down.href);
      // 下载完成移除
      document.body.removeChild(down);
    })
    .catch((err) => {
      ElMessage.error(err.message);
    });
};

/**
 * @description 图片压缩
 * @param {String} base64Image 图片的base64编码
 * @param {Number} compressionRatio 压缩比例，默认为0.5，即压缩到原来的50%
 */
export function compressBase64Image(base64Image, compressionRatio = 0.5) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * compressionRatio;
      canvas.height = img.height * compressionRatio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 将Canvas上的图像转换为PNG格式的Base64
      const compressedBase64 = canvas.toDataURL('image/png', 1);
      resolve(compressedBase64);
    };

    img.onerror = function () {
      reject('无法加载图像');
    };
  });
}
