/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-04 09:44:55
 * @FilePath: \aster-flowable-vue\src\stores\interface\index.ts
 * @Description: 接口定义
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
export type LayoutType = 'vertical' | 'classic' | 'transverse' | 'columns';

export type AssemblySizeType = 'large' | 'default' | 'small';

export type LanguageType = 'zh_CN' | 'en_US' | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
  isCollapse: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: User.UserInfo;
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: string[];
  authMenuList: Menu.MenuOptions[];
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  isKeepAlive: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}

export interface AppState {
  dictList: Dict.DictType[];
  secretKey: string;
}

export interface TenantState {
  enabled: boolean;
  tenantId: string;
  tenantList: Tenant.TenantInfo[];
}
