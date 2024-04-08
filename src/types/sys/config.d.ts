/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:09:16
 * @FilePath: \aster-flowable-vue\src\types\sys\config.d.ts
 * @Description: 参数接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Config {
  export interface ConfigParams extends Page.ReqPage {
    configName: string;
    configKey: string;
    configType: string;
  }

  export interface ConfigInfo {
    id?: string;
    configName?: string;
    configKey?: string;
    configValue?: string;
    configType: string;
    createTime?: string;
    status: string;
    remark?: string;
  }
}
