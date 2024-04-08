<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-28 17:16:27
 * @FilePath: \aster-admin\src\components\header\tenant-switch.vue
 * @Description: 切换租户
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dropdown trigger="click" @command="changeTenant" id="tenant" v-if="tenantEnabled">
    <i class="iconfont icon-navicon-zhgl"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in tenantList"
          :key="item.id"
          :command="item.id"
          :disabled="tenantId === item.id"
        >
          {{ item.companyName }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useTenantStore } from '@/stores/modules/tenant';
  import { useTabsStore } from '@/stores/modules/tabs';
  import { useKeepAliveStore } from '@/stores/modules/keepAlive';
  import { useAppStore } from '@/stores/modules/app';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/modules/user';
  import { initDynamicRouter } from '@/router/modules/dynamicRouter';
  import { HOME_URL } from '@/config';
  import { ElNotification } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const tenantStore = useTenantStore();
  const tabsStore = useTabsStore();
  const keepAliveStore = useKeepAliveStore();
  const appStore = useAppStore();
  const router = useRouter();
  const userStore = useUserStore();

  const tenantEnabled = ref(false);
  const tenantList = ref<Tenant.TenantInfo[]>([]);
  const tenantId = ref<string>('');

  /**
   * @description: 切换租户
   * @param {*} id 租户id
   * @return {*}
   */
  const changeTenant = async (id: string) => {
    tenantId.value = id;
    tenantStore.setTenantId(id);
    // 重置菜单和权限
    // 1.重置租户
    await tenantStore.resetTenant();

    // 2.添加动态路由 && 字典
    await initDynamicRouter();
    await appStore.setDictList();

    // 3.清空 tabs、keepAlive 数据
    tabsStore.closeMultipleTab();
    keepAliveStore.setKeepAliveName();

    // 4.跳转首页
    router.push(HOME_URL);

    ElNotification({
      message: t('label.tenant.switch'),
      type: 'success',
      duration: 3000,
    });
  };

  onMounted(() => {
    tenantEnabled.value = tenantStore.enabled && userStore.isSuperAdmin;
    tenantList.value = tenantStore.tenantList;
    tenantId.value = tenantStore.tenantId;
  });
</script>
<style scoped lang="scss">
  page {
    padding: 0 20rpx;
  }
</style>
