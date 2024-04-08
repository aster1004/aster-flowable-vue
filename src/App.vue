<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-admin\src\App.vue
 * @Description: App.vue
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
  import { computed, reactive, onMounted } from 'vue';
  import { useGlobalStore } from './stores/modules/global';
  import { getBrowserLang } from './utils';
  import en from 'element-plus/es/locale/lang/en';
  import zhCn from 'element-plus/es/locale/lang/zh-cn';
  import { useI18n } from 'vue-i18n';
  import { LanguageType } from './stores/interface';
  import { useTheme } from './utils/styles/useTheme';

  const globalStore = useGlobalStore();

  // init theme
  const { initTheme } = useTheme();
  initTheme();

  // init language
  const i18n = useI18n();
  onMounted(() => {
    const language = globalStore.language ?? getBrowserLang();
    i18n.locale.value = language;
    globalStore.setGlobalState('language', language as LanguageType);
  });

  // element language
  const locale = computed(() => {
    if (globalStore.language == 'zh_CN') return zhCn;
    if (globalStore.language == 'en_US') return en;
    return getBrowserLang() == 'zh_CN' ? zhCn : en;
  });

  // element assemblySize
  const assemblySize = computed(() => globalStore.assemblySize);

  // element button config
  const buttonConfig = reactive({ autoInsertSpace: false });
</script>

<style lang="scss">
  html,
  body,
  #app {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
</style>
