/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-28 09:54:10
 * @FilePath: \aster-admin\src\types\generator.d.ts
 * @Description: 代码生成接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Generator {
  export interface GeneratorParams extends Page.ReqPage {
    tableName?: string;
  }

  /**
   * 基类
   */
  export interface BaseClassInfo {
    id?: string;
    code?: string;
    fields?: string;
    remark?: string;
    createTime?: string;
  }
  export interface BaseClassParams extends Page.ReqPage {
    code?: string;
  }

  /**
   * 数据源
   */
  export interface DatasourceInfo {
    id?: string;
    dbType?: string;
    connName?: string;
    connUrl?: string;
    username?: string;
    password?: string;
    createTime?: string;
  }
  export interface DatasourceParams extends Page.ReqPage {
    connName?: string;
    dbType?: string;
  }

  /**
   * 字段类型
   */
  export interface FieldTypeInfo {
    id?: string;
    columnType?: string;
    attrType?: string;
    packageName?: string;
    createTime?: string;
  }
  export interface FieldTypeParams extends Page.ReqPage {
    columnType?: string;
    attrType?: string;
  }

  /**
   * 表
   */
  export interface TableInfo {
    id?: string;
    tableName?: string;
    className?: string;
    tableComment?: string;
    packageName?: string;
    version?: string;
    author?: string;
    email?: string;
    generatorType?: number;
    backendPath?: string;
    frontendPath?: string;
    moduleName?: string;
    moduleSimple?: string;
    functionName?: string;
    formLayout?: number;
    datasourceId?: string;
    baseClassId?: string;
    createTime?: string;
    fieldList?: Array<TableFieldInfo>;
  }

  /**
   * 表字段
   */
  export interface TableFieldInfo {
    id?: string;
    tableId?: string;
    fieldName?: string;
    sort?: number;
    fieldType?: string;
    fieldComment?: string;
    attrName?: string;
    attrType?: string;
    packageName?: string;
    autoFill?: string;
    primaryPk?: boolean;
    baseField?: boolean;
    formItem?: boolean;
    formRequired?: boolean;
    formType?: string;
    formDict?: string;
    formValidator?: string;
    gridItem?: boolean;
    gridSort?: boolean;
    queryItem?: boolean;
    queryType?: string;
    queryFormType?: string;
  }

  /**
   * 预览
   */
  export interface PreviewInfo {
    fileName: string;
    content: string;
  }
}
