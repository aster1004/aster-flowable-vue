/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-admin\src\types\global.d.ts
 * @Description: 全局接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import type { CSSProperties } from 'vue';
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T;
  }

  declare type Nullable<T> = T | null;

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

  declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>;

  declare type ComponentRef<T> = InstanceType<T>;

  declare type LocaleType = 'zh-CN' | 'en';

  declare type AxiosHeaders =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data';

  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put';

  declare type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

  declare interface AxiosConfig {
    params?: any;
    data?: any;
    url?: string;
    method?: AxiosMethod;
    headersType?: string;
    responseType?: AxiosResponseType;
  }

  declare interface IResponse<T = any> {
    code: string;
    data: T extends any ? T : T & any;
  }

  /* Generic Tools */
  declare type ObjToKeyValUnion<T> = {
    [K in keyof T]: { key: K; value: T[K] };
  }[keyof T];

  declare type ObjToKeyValArray<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T];

  declare interface ViteEnv {
    VITE_USER_NODE_ENV: 'development' | 'production' | 'test';
    VITE_GLOB_APP_TITLE: string;
    VITE_PORT: number;
    VITE_OPEN: boolean;
    VITE_REPORT: boolean;
    VITE_ROUTER_MODE: 'hash' | 'history';
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none';
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_DROP_CONSOLE: boolean;
    VITE_PWA: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_API_URL: string;
    VITE_PROXY: [string, string][];
  }

  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  /* FileType */
  declare namespace File {
    type ImageMimeType =
      | 'image/apng'
      | 'image/bmp'
      | 'image/gif'
      | 'image/jpeg'
      | 'image/pjpeg'
      | 'image/png'
      | 'image/svg+xml'
      | 'image/tiff'
      | 'image/webp'
      | 'image/x-icon';

    type ExcelMimeType =
      | 'application/vnd.ms-excel'
      | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
}
