<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-15 17:39:19
 * @FilePath: \aster-admin\src\components\header\language.vue
 * @Description: 语言
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dropdown trigger="click" @command="changeLanguage" id="language">
    <i class="iconfont icon-zhongyingwen"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useGlobalStore } from '@/stores/modules/global';
  import { LanguageType } from '@/stores/interface';

  const i18n = useI18n();
  const globalStore = useGlobalStore();

  const language = computed(() => globalStore.language);
  const languageList = [
    { label: '简体中文', value: 'zh_CN' },
    { label: 'English', value: 'en_US' },
  ];

  const changeLanguage = (lang: string) => {
    i18n.locale.value = lang;
    globalStore.setGlobalState('language', lang as LanguageType);
  };
</script>
<style lang="scss"></style>
