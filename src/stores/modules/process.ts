/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\stores\modules\process.ts
 * @Description: 状态管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { defineStore } from 'pinia';

// const store = createPinia();
// store.use(piniaPluginPersistedstate);

// export const setupStore = (app: App<Element>) => {
//   app.use(store);
// };

export const processStore = defineStore('store', {
  state: () => ({
    tableId: '',
    isTried: false,
    promoterDrawer: false,
    flowPermission1: {},
    approverDrawer: false,
    approverConfig1: {},
    copyerDrawer: false,
    copyerConfig1: {},
    conditionDrawer: false,
    conditionsConfig1: {
      conditionNodes: [],
    },
  }),
  actions: {
    setTableId(payload) {
      this.tableId = payload;
    },
    setIsTried(payload) {
      this.isTried = payload;
    },
    setPromoter(payload) {
      this.promoterDrawer = payload;
    },
    setFlowPermission(payload) {
      this.flowPermission1 = payload;
    },
    setApprover(payload) {
      this.approverDrawer = payload;
    },
    setApproverConfig(payload) {
      this.approverConfig1 = payload;
    },
    setCopyer(payload) {
      this.copyerDrawer = payload;
    },
    setCopyerConfig(payload) {
      this.copyerConfig1 = payload;
    },
    setCondition(payload) {
      this.conditionDrawer = payload;
    },
    setConditionsConfig(payload) {
      this.conditionsConfig1 = payload;
    },
  },
});
