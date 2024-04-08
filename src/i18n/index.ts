/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-15 14:39:19
 * @FilePath: \aster-flowable-vue\src\i18n\index.ts
 * @Description: i18n国际化
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { createI18n } from 'vue-i18n';
import { getBrowserLang } from '@/utils';

import zh from './modules/zh_CN';
import en from './modules/en_US';

const i18n = createI18n({
  // Use Composition API, Set to false
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: {
    zh_CN: { ...zh },
    en_US: { ...en },
  },
});

export default i18n;
