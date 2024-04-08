/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-16 10:25:49
 * @FilePath: \aster-admin\src\types\login.d.ts
 * @Description: 登录接口
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

/**
 * @description: 登录
 * @return {*}
 */
declare namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
    key: string;
    captcha: string;
    tenantId: string;
  }

  export interface Captcha {
    key: string;
    image: string;
  }

  export interface ResLogin {
    access_token: string;
  }

  export interface ResetPassword {
    oldPassword: string;
    newPassword: string;
  }
}

declare namespace Inspire {
  export interface InspireInfo {
    id?: string;
    content: string;
    likeNum?: number;
    dislikeNum?: number;
  }
}
