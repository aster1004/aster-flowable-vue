/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-03 17:43:40
 * @FilePath: \aster-flowable-vue\src\utils\styles\theme\header.ts
 * @Description: 头部样式
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { Theme } from '@/utils/styles/interface';

export const headerTheme: Record<Theme.ThemeType, { [key: string]: string }> = {
  light: {
    '--el-header-logo-text-color': '#303133',
    '--el-header-bg-color': '#ffffff',
    '--el-header-text-color': '#303133',
    '--el-header-text-color-regular': '#606266',
    '--el-header-border-color': '#e4e7ed',
  },
  inverted: {
    '--el-header-logo-text-color': '#dadada',
    '--el-header-bg-color': '#191a20',
    '--el-header-text-color': '#e5eaf3',
    '--el-header-text-color-regular': '#cfd3dc',
    '--el-header-border-color': '#414243',
  },
  dark: {
    '--el-header-logo-text-color': '#dadada',
    '--el-header-bg-color': '#141414',
    '--el-header-text-color': '#e5eaf3',
    '--el-header-text-color-regular': '#cfd3dc',
    '--el-header-border-color': '#414243',
  },
};
