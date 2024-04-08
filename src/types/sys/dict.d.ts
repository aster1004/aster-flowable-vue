/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:05:32
 * @FilePath: \aster-admin\src\types\sys\dict.d.ts
 * @Description: 字典接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Dict {
  export interface DictTypeParams extends Page.ReqPage {
    dictType: string;
    dictName: string;
    status: string;
  }
  export interface DictDataParams extends Page.ReqPage {
    dictTypeId: string;
  }

  export interface DictType {
    id?: string;
    dictType: string;
    dictName?: string;
    remark?: string;
    sort?: number;
    createTime?: string;
    status: string;
    dataList?: DictData[];
  }
  export interface DictData {
    id?: string;
    dictTypeId?: string;
    dictLabel: string;
    dictValue: string;
    labelClass?: string;
    remark?: string;
    sort?: number;
    status: string;
    createTime?: string;
  }
}
