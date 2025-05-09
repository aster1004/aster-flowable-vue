<template>
  <div class="loading-container">
    <div class="loading-box" ref="loginRef"></div>
    <div class="loading-text">加载中</div>
  </div>
</template>
<script lang="ts" setup>
  import lottie from 'lottie-web';
  import * as dd from 'dingtalk-jsapi';
  import { ref, onMounted, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/modules/user';
  import { useTabsStore } from '@/stores/modules/tabs';
  import { useKeepAliveStore } from '@/stores/modules/keepAlive';
  import { useAppStore } from '@/stores/modules/app';
  import { useTenantStore } from '@/stores/modules/tenant';
  import { HOME_URL } from '@/config';
  import { initDynamicRouter } from '@/router/modules/dynamicRouter';
  import { dingLoginApi, userInfoApi } from '@/api/login';
  import loadingData from '@/assets/lottie/loading.json';

  const router = useRouter();
  const userStore = useUserStore();
  const tabsStore = useTabsStore();
  const keepAliveStore = useKeepAliveStore();
  const appStore = useAppStore();
  const tenantStore = useTenantStore();

  // loginRed对象
  const loginRef = ref();

  onMounted(() => {
    nextTick(() => {
      if (loginRef.value) {
        lottie.loadAnimation({
          container: loginRef.value,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: loadingData,
        });
        handleDinglogin();
      }
    });
  });

  /**
   * 钉钉登录
   */
  const handleDinglogin = async () => {
    const corpId = getQueryVariable('corpId', false);
    if (corpId) {
      dd.runtime.permission.requestAuthCode({
        corpId: corpId, // 企业id
        onSuccess: (info: any) => {
          var code = info.code; // 通过该免登授权码可以获取用户身份
          dingLoginApi(code)
            .then(async ({ data }) => {
              userStore.setToken(data.access_token);
              // 获取登录人信息
              const res = await userInfoApi();
              userStore.setUserInfo(res.data);
              // 添加动态路由 && 字典
              await initDynamicRouter();
              await appStore.setDictList();
              // 清空 tabs、keepAlive 数据
              tabsStore.closeMultipleTab();
              keepAliveStore.setKeepAliveName();

              tenantStore.setTenantId('');

              // 跳转到首页
              router.push(HOME_URL);
            })
            .catch((err) => {
              alert(JSON.parse(err));
              console.log(err);
            });
        },
      });
    }
  };

  /**
   * 获取url参数
   * @param name
   * @param model
   * @returns
   */
  const getQueryVariable = (name: string, model: booload) => {
    let searchUrl = model ? window.location.search.substr(1) : window.location.hash.split('?')[1];
    if (searchUrl) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      let value = searchUrl.match(reg);
      if (value != null) return unescape(value[2]);
    }
    return null;
  };
</script>
<style lang="scss" scoped>
  .loading-container {
    width: 100wh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .loading-box {
    width: 300px;
    height: 250px;
  }

  .loading-text {
    font-size: 18px;
  }
</style>
