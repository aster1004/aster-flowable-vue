/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-30 17:50:58
 * @FilePath: \aster-flowable-vue\src\api\sys\user.ts
 * @Description: 钉钉API
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import request from '@/config/axios';
import { PORT1 } from '../config';

/**
 * @description: 同步钉钉用户
 * @return {*}
 */
export const dingSyncApi = () => {
  return request.post<string>(PORT1 + `/dingTalk/sync`, {}, { noLoading: true });
};
