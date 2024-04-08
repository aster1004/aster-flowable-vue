/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-02 10:10:11
 * @FilePath: \aster-admin\src\api\monitor\online.ts
 * @Description: 在线用户API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { UserOnline } from '@/types/monitor';
import { PORT2 } from '../config';

/**
 * @description: 分页
 * @return {*}
 */
export const onlinePageApi = (params: Page.ReqPage) => {
  return request.get<Page.ResPage<UserOnline>>(PORT2 + `/online/page`, params, {
    noLoading: true,
  });
};

/**
 * @description: 强退
 * @return {*}
 */
export const onlineForceApi = (token: string) => {
  return request.get<string>(PORT2 + `/online/force/` + token, { noLoading: true });
};
