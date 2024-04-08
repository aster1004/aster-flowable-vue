/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-02 15:10:16
 * @FilePath: \aster-admin\src\api\monitor\server.ts
 * @Description: 服务API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { ServerInfo } from '@/types/monitor';
import { PORT2 } from '../config';

/**
 * @description: 服务信息
 * @return {*}
 */
export const serverInfoApi = () => {
  return request.get<ServerInfo.ServerModel>(PORT2 + `/server/all`, {
    noLoading: true,
  });
};
