/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-28 17:20:47
 * @FilePath: \aster-flowable-vue\src\stores\modules\tenant.ts
 * @Description: 租户状态
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';
import { TenantState } from '@/stores/interface';
import piniaPersistConfig from '@/config/piniaPersist';
import { switchTenantApi } from '@/api/sys/tenant';

export const useTenantStore = defineStore({
  id: 'aster-tenant',
  state: (): TenantState => ({
    enabled: false,
    tenantId: '',
    tenantList: [],
  }),
  getters: {},
  actions: {
    // Set Enabled
    setEnabled(enabled: boolean) {
      this.enabled = enabled;
    },
    // Set TenantList
    setTenantList(tenantList: Tenant.TenantInfo[]) {
      this.tenantList = tenantList;
    },
    // Set TenantId
    setTenantId(tenantId: string) {
      this.tenantId = tenantId;
    },
    // Reset Tenant
    async resetTenant() {
      await switchTenantApi(this.tenantId);
    },
  },
  persist: piniaPersistConfig('aster-tenant'),
});
