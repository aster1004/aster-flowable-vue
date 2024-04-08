/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-01 17:58:15
 * @FilePath: \aster-admin\vite.config.ts
 * @Description: vite配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import WindiCSS from 'vite-plugin-windicss';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { viteMockServe } from 'vite-plugin-mock';
import { wrapperEnv, createProxy } from './src/utils/env';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    root,
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/var.scss";`,
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11'],
          }),
        ],
      },
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src'),
        },
      ],
    },
    plugins: [
      vue(),
      WindiCSS(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      legacy({
        targets: ['cover 99.5%'],
      }),
      viteMockServe({
        mockPath: './src/mock/', //设置模拟数据的存储文件夹
        supportTs: true, //是否读取ts文件模块
        logger: true, //是否在控制台显示请求日志
        localEnabled: false, //设置是否启用本地mock文件
        prodEnabled: false, //设置打包是否启用mock功能
      }),
    ],
    server: {
      host: '0.0.0.0',
      open: viteEnv.VITE_OPEN,
      port: viteEnv.VITE_PORT,
      hmr: {
        overlay: false,
      },
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY),
    },
    optimizeDeps: {
      include: ['core-js'],
    },
  };
});
