/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-12 13:07:59
 * @FilePath: \aster-flowable-vue\src\types\auth\user.d.ts
 * @Description: 用户接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace User {
  export interface UserParams extends Page.ReqPage {
    name?: string;
    gender?: string;
    orgId?: string;
    status: string;
  }

  export interface PasswordParams {
    ids: string[];
    password: string;
  }

  export interface UserInfo {
    id: string;
    avatar?: string; // 头像
    username: string; // 用户名
    nickName?: string; // 昵称
    gender: string; // 性别
    mobile?: string; // 电话
    email?: string; // 邮箱
    superAdmin?: string; // 超级管理员

    realName?: string; // 姓名
    idNumber?: string; // 身份证号
    birthday?: string; // 生日
    area?: string; // 地区
    signature?: string; // 签名

    orgId?: string; // 所属部门
    orgName?: string;

    roleIdList?: string[]; // 所属角色
    postIdList?: string[]; // 所属岗位

    createTime?: string;
    status: string;
  }
}
