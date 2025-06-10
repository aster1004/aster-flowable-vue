/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-01 09:55:16
 * @FilePath: \aster-flowable-vue\src\utils\fileUtils.ts
 * @Description: 文件工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { ElMessage, ElNotification, UploadRawFile } from 'element-plus';
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
 * @param {UploadRawFile} file 图片文件
 * @param {Number} compressionRatio 压缩比例，默认为0.5，即压缩到原来的50%
 */
export function compressImage(
  file: UploadRawFile,
  compressionRatio: number = 0.5,
  mimeType: string = 'image/jpeg',
) {
  return new Promise((resolve, reject) => {
    // 创建FileReader对象，异步读取存储在客户端上的文件内容
    const reader: FileReader = new FileReader();
    reader.onload = ({ target }: ProgressEvent<FileReader>) => {
      //创建img元素
      const image = new Image() as any;
      // 图片加载完成后异步执行，当image的src发生改变，浏览器就会跑去加载这个src里的资源，这个操作是异步的。
      image.onload = async () => {
        // 创建一个新的画布元素和上下文，用于绘制压缩后的图片
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as any;
        // 计算目标图片的宽度和高度，以适应最大宽度和高度的要求
        const targetWidth = image.width * compressionRatio;
        const targetHeight = image.height * compressionRatio;
        // 设置画布的尺寸
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清空画布并在画布上绘制压缩后的图片
        context.clearRect(0, 0, targetWidth, targetHeight);
        context.drawImage(image, 0, 0, targetWidth, targetHeight);
        // 将压缩后的图片数据转换为 data URI。可以使用 type 参数其类型，默认为 PNG 格式。qualitys越小，文件体积越小
        const canvasURL = canvas.toDataURL(mimeType, compressionRatio);
        // 解码 data URI，获取图片的二进制数据。atob：是ascii to binary，用于将ascii码解析成binary数据，即Base64的解码过程。
        const buffer = atob(canvasURL.split(',')[1]);
        let length = buffer.length;
        //创建一个 Uint8Array 类型的向量，用于存储图片的二进制数据
        const bufferArray = new Uint8Array(new ArrayBuffer(length));
        while (length--) {
          bufferArray[length] = buffer.charCodeAt(length);
        }
        // 创建一个压缩后的文件对象
        const miniFile = new File([bufferArray], file.name, {
          type: mimeType,
        });

        // 解析压缩后的文件对象
        resolve({
          uid: file.uid,
          raw: miniFile,
          origin: file,
          beforeSrc: target?.result,
          afterSrc: canvasURL,
          beforeKB: Number((file.size / 1024).toFixed(2)),
          afterKB: Number((miniFile.size / 1024).toFixed(2)),
        });
      };
      // 设置图片的 src，触发图片加载
      image.src = target?.result;
    };
    // 读取文件内容，并在读取完成后触发 onload 事件
    reader.readAsDataURL(file);
  });
}

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

/**
 * @description base64转blob
 * @param {String} base64 base64编码
 * @param {String} mimeType 文件类型
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mimeType });
}
