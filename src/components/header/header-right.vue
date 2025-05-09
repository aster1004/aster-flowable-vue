<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-16 14:18:55
 * @FilePath: \aster-flowable-vue\src\components\header\header-right.vue
 * @Description: 右头部
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="header-ri">
    <div class="header-icon">
      <tenant-switch />
      <search-menu />
      <a href="https://gitee.com/lp1791803611/aster-flowable" target="_blank">
        <i class="iconfont icon-gitee"></i>
      </a>
      <assembly-size />
      <language />
      <theme-setting />
      <message />
      <fullscreen />
    </div>
    <span class="header-username">{{ userInfo.realName }}</span>
    <div class="header-avatar" id="userAvatar">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-avatar :size="40" :src="avatar" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openDialog('info')">
              <div class="header-dropdown">
                <i class="iconfont icon-geren"></i>
                {{ t('header.personalData') }}
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="openDialog('edit')">
              <div class="header-dropdown">
                <i class="iconfont icon-bianji"></i>
                {{ t('header.changePassword') }}
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <div class="header-dropdown">
                <i class="iconfont icon-tuichu"></i>
                {{ t('header.logout') }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <personal ref="personalRef" />
  <password ref="passwordRef" />
</template>
<script setup lang="ts">
  import SearchMenu from './search-menu.vue';
  import AssemblySize from './assembly-size.vue';
  import Language from './language.vue';
  import Fullscreen from './fullscreen.vue';
  import ThemeSetting from './theme-setting.vue';
  import Message from './message.vue';
  import Personal from './personal.vue';
  import Password from './password.vue';
  import TenantSwitch from './tenant-switch.vue';
  import { useI18n } from 'vue-i18n';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import router from '@/router';
  import { LOGIN_URL } from '@/config';
  import { logoutApi } from '@/api/login';
  import { useUserStore } from '@/stores/modules/user';
  import { computed, ref, onMounted } from 'vue';
  import { isEmpty } from '@/utils';
  import { initWebSocket } from '@/utils/websocket';
  import { PORT } from '@/api/config';

  const userStore = useUserStore();

  const { t } = useI18n();

  const userInfo = userStore.userInfo;

  const avatar = computed(() => {
    return isEmpty(userInfo.avatar) ? './src/assets/images/avatar.png' : userInfo.avatar;
  });

  const personalRef = ref();
  const passwordRef = ref();
  const openDialog = (type: string) => {
    if (type == 'info') personalRef.value.init();
    if (type == 'edit') passwordRef.value.init();
  };

  const logout = () => {
    ElMessageBox.confirm(t('header.logoutTip'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    }).then(async () => {
      // 1.执行退出登录接口
      await logoutApi();

      // 2.清除 Token
      userStore.setToken('');

      // 3.重定向到登陆页
      router.replace(LOGIN_URL);
      ElMessage.success(t('header.logout') + ' ' + t('common.success'));
    });
  };

  onMounted(() => {
    let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const url = import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '') + PORT;
    initWebSocket(protocol + url + '/resource/websocket');
  });
</script>
<style lang="scss" scoped>
  .header-ri {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 20px;

    .header-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      /** & > *表示header-icon下的每一项都执行 */
      & > * {
        margin-left: 21px;
        color: var(--el-header-text-color);
      }
    }

    .header-username {
      margin: 0 20px;
      font-size: 15px;
      color: var(--el-header-text-color);
    }

    .header-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
