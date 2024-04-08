/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-20 10:32:40
 * @FilePath: \aster-flowable-vue\src\utils\directive\modules\hasPerm.ts
 * @Description: 按钮权限
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/stores/modules/auth';

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 「超级管理员」拥有所有的按钮权限
    const all_permission = '*:*:*';
    const { value } = binding;

    // 按钮权限
    const authStore = useAuthStore();
    const permissions = authStore.authButtonList;

    if (value && value instanceof Array && value.length > 0) {
      const requiredPerms = value;

      const hasPermissions = permissions.some((permission) => {
        return all_permission === permission || requiredPerms.includes(permission);
      });

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};
