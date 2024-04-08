/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-04 09:40:55
 * @FilePath: \aster-flowable-vue\src\config\piniaPersist.ts
 * @Description: pinia持久化配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { PersistedStateOptions } from 'pinia-plugin-persistedstate';

/**
 * @description pinia 持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} paths 需要持久化的 state name
 * @return persist
 * */
const piniaPersistConfig = (key: string, paths?: string[]) => {
  const persist: PersistedStateOptions = {
    key,
    storage: localStorage,
    // storage: sessionStorage,
    paths,
  };
  return persist;
};

export default piniaPersistConfig;
