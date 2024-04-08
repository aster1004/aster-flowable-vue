<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-flowable-vue\src\views\login.vue
 * @Description: 登录页
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="login-container">
    <div class="login-box">
      <el-switch
        v-model="globalStore.isDark"
        inline-prompt
        :active-icon="Sunny"
        :inactive-icon="Moon"
        @change="switchDark"
        class="dark"
      />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left1.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.png" alt="" />
          <h2 class="logo-text">{{ appTitle }}</h2>
        </div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
          <el-form-item prop="tenantId" v-if="tenantVisible">
            <el-select
              v-model="loginForm.tenantId"
              :placeholder="$t('login.placeholder.tenant')"
              style="width: 100%"
            >
              <el-option
                v-for="tenant in tenantList"
                :key="tenant.id"
                :label="tenant.companyName"
                :value="tenant.id ? tenant.id : ''"
              />
              <template #prefix>
                <i class="iconfont icon-navicon-zhgl !text-sm"></i>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" :placeholder="$t('login.placeholder.username')">
              <template #prefix>
                <i class="iconfont icon-yonghu !text-sm"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('login.placeholder.password')"
              show-password
              autocomplete="new-password"
            >
              <template #prefix>
                <i class="iconfont icon-mima !text-sm"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha" v-if="captchaVisible" class="login-captcha">
            <el-input v-model="loginForm.captcha" :placeholder="$t('login.placeholder.captcha')">
              <template #prefix>
                <i class="iconfont icon-yanzhengma !text-sm"></i>
              </template>
            </el-input>
            <img :src="captchaBase64" @click="onCaptcha" />
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">
            {{ $t('button.reset') }}
          </el-button>
          <el-button
            :icon="UserFilled"
            round
            size="large"
            type="primary"
            :loading="loading"
            @click="login(loginFormRef)"
          >
            {{ $t('button.login') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useTheme } from '@/utils/styles/useTheme';
  import { useGlobalStore } from '@/stores/modules/global';
  import { Sunny, Moon } from '@element-plus/icons-vue';
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import type { ElForm } from 'element-plus';
  import { ElNotification } from 'element-plus';
  import { CircleClose, UserFilled } from '@element-plus/icons-vue';
  import { getTimeState } from '@/utils';
  import { HOME_URL } from '@/config';
  import { useUserStore } from '@/stores/modules/user';
  import { useTabsStore } from '@/stores/modules/tabs';
  import { useKeepAliveStore } from '@/stores/modules/keepAlive';
  import { useAppStore } from '@/stores/modules/app';
  import { useTenantStore } from '@/stores/modules/tenant';
  import {
    captchaApi,
    captchaEnabledApi,
    tenantEnabledApi,
    tenantListApi,
    loginApi,
    userInfoApi,
  } from '@/api/login';
  import { initDynamicRouter } from '@/router/modules/dynamicRouter';
  import { useI18n } from 'vue-i18n';
  import { encrypt } from '@/utils/encrypt';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';

  const { switchDark } = useTheme();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const tabsStore = useTabsStore();
  const keepAliveStore = useKeepAliveStore();
  const appStore = useAppStore();
  const tenantStore = useTenantStore();

  const appTitle = import.meta.env.VITE_APP_TITLE as String;

  const router = useRouter();
  const { t } = useI18n();

  type FormInstance = InstanceType<typeof ElForm>;
  const loginFormRef = ref<FormInstance>();
  // 是否显示租户
  const tenantVisible = ref(false);
  const tenantList = ref<Tenant.TenantInfo[]>([]);
  // 是否显示验证码
  const captchaVisible = ref(false);
  const captchaBase64 = ref();
  // 秘钥
  const secretKey = ref('');

  const loginRules = reactive({
    username: [{ required: true, message: t('login.rule.username'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.rule.password'), trigger: 'blur' }],
    captcha: [{ required: true, message: t('login.rule.captcha'), trigger: 'blur' }],
    tenantId: [{ required: true, message: t('login.rule.tenant'), trigger: 'blur' }],
  });
  const loading = ref(false);
  const loginForm = reactive<Login.ReqLoginForm>({
    username: 'admin',
    password: '123456',
    key: '',
    captcha: '',
    tenantId: '000000',
  });

  // login
  const login = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (!valid) return;
      loading.value = true;
      try {
        // 1.加密密码
        const encryptPassword = encrypt(loginForm.password, secretKey.value);

        // 2.执行登录接口
        const { data } = await loginApi({ ...loginForm, password: encryptPassword });
        userStore.setToken(data.access_token);

        // 3.获取登录人信息
        const res = await userInfoApi();
        userStore.setUserInfo(res.data);

        // 4.添加动态路由 && 字典
        await initDynamicRouter();
        await appStore.setDictList();

        // 5.清空 tabs、keepAlive 数据
        tabsStore.closeMultipleTab();
        keepAliveStore.setKeepAliveName();

        // 6.租户信息
        if (tenantVisible.value) {
          tenantStore.setTenantId(loginForm.tenantId);
        } else {
          tenantStore.setTenantId('');
        }

        // 7.跳转到首页
        router.push(HOME_URL);

        ElNotification({
          title: getTimeState(),
          message: t('login.message.login') + appTitle + '系统',
          type: 'success',
          duration: 3000,
        });
      } catch {
        if (captchaVisible.value) {
          onCaptcha();
        }
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * @description: 重置表单
   * @param {*} formEl 表单
   * @return {*}
   */
  const resetForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    if (captchaVisible.value) {
      await onCaptcha();
    }
  };

  /**
   * @description: 获取验证码
   * @return {*}
   */
  const onCaptcha = async () => {
    const { data } = await captchaApi();
    loginForm.key = data.key;
    captchaBase64.value = data.image;
  };

  /**
   * @description: 是否开启租户
   * @return {*}
   */
  const onTenantEnabled = async () => {
    const { data } = await tenantEnabledApi();
    tenantVisible.value = data;
    tenantStore.setEnabled(tenantVisible.value);
    // 若开启，则获取租户列表
    if (tenantVisible.value) {
      tenantListApi().then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          tenantList.value = res.data;
          tenantStore.setTenantList(tenantList.value);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  };

  /**
   * @description: 是否开启验证码
   * @return {*}
   */
  const onCaptchaEnabled = async () => {
    const { data } = await captchaEnabledApi();
    captchaVisible.value = data;

    if (data) {
      await onCaptcha();
    }
  };

  /**
   * @description: 密钥
   * @return {*}
   */
  const getSecretKey = async () => {
    secretKey.value = appStore.secretKey;
  };

  onMounted(async () => {
    // 租户
    await onTenantEnabled();
    // 验证码
    await onCaptchaEnabled();
    // 获取秘钥
    await appStore.setSecretKey();
    await getSecretKey();
    // 监听 enter 事件（调用登录）
    document.onkeydown = (e: KeyboardEvent) => {
      e = (window.event as KeyboardEvent) || e;
      if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
        if (loading.value) return;
        login(loginFormRef.value);
      }
    };
  });
</script>
<style lang="scss" scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    min-height: 550px;
    background-color: #eeeeee;
    background-image: url('@/assets/images/login_bg.svg');
    background-size: 100% 100%;
    background-size: cover;
    .login-box {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 96.5%;
      height: 94%;
      padding: 0 50px;
      background-color: rgb(255 255 255 / 80%);
      border-radius: 10px;
      .dark {
        position: absolute;
        top: 13px;
        right: 18px;
      }
      .login-left {
        width: 800px;
        margin-right: 10px;
        .login-left-img {
          width: 100%;
          height: 100%;
        }
      }
      .login-form {
        width: 420px;
        padding: 50px 40px 45px;
        background-color: var(--el-bg-color);
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;
        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 45px;
          .login-icon {
            width: 60px;
            height: 52px;
          }
          .logo-text {
            padding: 0 0 0 25px;
            margin: 0;
            font-size: 42px;
            font-weight: bold;
            color: #34495e;
            white-space: nowrap;
          }
        }
        .el-form-item {
          margin-bottom: 40px;
        }
        .login-captcha {
          :deep(.el-input) {
            width: 63%;
          }

          img {
            width: 33%;
            height: 40px;
            float: right;
            margin-left: 10px;
            cursor: pointer;
            vertical-align: middle;
          }
        }
        .login-btn {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 40px;
          white-space: nowrap;
          .el-button {
            width: 185px;
          }
        }
      }
    }
  }

  @media screen and (width <= 1250px) {
    .login-left {
      display: none;
    }
  }

  @media screen and (width <= 600px) {
    .login-form {
      width: 97% !important;
    }
  }
</style>
