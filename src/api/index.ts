/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\api\index.ts
 * @Description: 公共API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from './config';
import { ImageUpload } from '@/config/fileConfig';

/**
 * @description: 激励列表
 * @return {*}
 */
export const inspireApi = () => {
  return request.get<Inspire.InspireInfo[]>(PORT1 + `/inspire/list`, {
    noLoading: true,
  });
};
// 评论
export const setComment = (params: { content: string; type: string }) => {
  return request.post<object>(PORT1 + '/inspire/comment', params, { noLoading: true });
};

// 文件上传
export const uploadFile = (params: FormData) => {
  return request.post<Upload.ResFileUrl>(ImageUpload.url, params);
};

/**
 * @description: 天气预报
 * @return {*}
 */
export const weatherApi = () => {
  return request.get<Weather.WeatherForecast>(PORT1 + `/weather`, {
    noLoading: true,
  });
};
