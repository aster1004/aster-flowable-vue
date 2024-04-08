/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:04:29
 * @FilePath: \aster-admin\src\types\sys\menu.d.ts
 * @Description: 菜单接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace Menu {
  export interface MenuOptions {
    id: string;
    pid: string;
    parentName?: string;
    name: string; // 中文名称
    path: string; // 路径
    component?: string; // 组件
    perms?: string; // 权限标识
    type: string; // 菜单类型
    icon: string; // 图标
    openStyle: string; // 打开方式
    isKeepAlive: string; // 是否缓存
    isAffix: string; // 是否固定
    isFull: string; // 是否全屏
    isHide: string; // 是否隐藏
    status: string; // 菜单状态
    sort?: number; // 排序
    remark?: string; // 备注
    createTime?: string; // 创建时间
    children?: MenuOptions[];
  }

  export interface MenuParams {
    name: string;
    path: string;
    status: string;
  }
}
