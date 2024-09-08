<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 10:21:42
 * @FilePath: \aster-flowable-vue\src\views\assembly\print\index.vue
 * @Description: 页面打印
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div>
    <el-card shadow="hover" header="打印区域" id="printForm" class="mt-20px">
      <el-alert
        title="页面打印演示，使用的是 `print-js`，项目地址：https://github.com/crabbly/Print.js"
        type="success"
        :closable="false"
      />
    </el-card>
    <el-card shadow="hover" header="pringJS打印" class="mt-20px">
      <el-row>
        <el-col :span="24" class="mb-20px">
          <el-button type="primary" @click="printHtml"> 打印页面指定区域 </el-button>
          <el-button type="success" @click="printHtmlRemoveHf"> 打印页面去除页眉页脚 </el-button>
        </el-col>
        <el-col :span="24" class="mb-20px">
          <el-button type="primary" @click="printSingleImage"> 打印单个图片 </el-button>
          <el-button type="success" @click="printImages"> 打印多个图片 </el-button>
        </el-col>
        <el-col :span="24" class="mb-20px">
          <el-button type="primary" @click="printPdf"> 打印pdf </el-button>
          <el-button type="success" @click="printJson"> 打印JSON </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover" header="vue3-print-nb打印" class="mt-20px">
      <el-row>
        <el-col :span="24" class="mb-20px">
          <el-button type="primary" v-print="printObj"> 打印页面指定区域 </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import printJs from 'print-js';
  import { getStaticResource } from '@/utils';
  import print from 'vue3-print-nb';
  import { ref } from 'vue';

  const printHtml = () => {
    printJs({
      printable: 'printForm',
      type: 'html',
      css: ['//unpkg.com/element-plus/dist/index.css'],
      scanStyles: false,
    });
  };

  const printHtmlRemoveHf = () => {
    printJs({
      printable: 'printForm',
      type: 'html',
      css: ['//unpkg.com/element-plus/dist/index.css'],
      scanStyles: false,
      style: '@page {margin:0 10mm};',
    });
  };

  const printSingleImage = () => {
    printJs({
      printable: getStaticResource('../../../src/assets/images/avatar.png'),
      type: 'image',
      header: 'Single Image',
    });
  };

  const printImages = () => {
    printJs({
      printable: [
        getStaticResource('../../../src/assets/images/avatar.png'),
        getStaticResource('../../../src/assets/images/welcome.png'),
        getStaticResource('../../../src/assets/images/empty.png'),
      ],
      type: 'image',
      header: 'Multiple Images',
      imageStyle: 'width:50%;margin-bottom:20px;',
    });
  };

  const printPdf = () => {
    printJs({
      printable: getStaticResource('../../../../src/assets/21113.pdf'),
      type: 'pdf',
      header: 'PDF',
    });
  };

  const printJson = () => {
    printJs({
      printable: jsonData,
      properties: ['name', 'email', 'phone'],
      type: 'json',
      header: 'JSON',
    });
  };

  const jsonData = [
    {
      name: 'John Doe',
      email: 'john@doe.com',
      phone: '111-111-1111',
    },
    {
      name: 'Barry Allen',
      email: 'barry@flash.com',
      phone: '222-222-2222',
    },
    {
      name: 'Cool Dude',
      email: 'cool@dude.com',
      phone: '333-333-3333',
    },
  ];

  // 注册打印插件
  const vPrint = print;
  // 打印配置
  const printObj = ref({
    id: 'printForm',
    // popTitle: '配置页眉标题', // 打印配置页上方的标题
    // extraHead: '打印', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
    // preview: true, // 是否启动预览模式，默认是false
    // previewTitle: '预览的标题', // 打印预览的标题
    // previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
    // zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
    // previewBeforeOpenCallback() {
    //   console.log('正在加载预览窗口！');
    // }, // 预览窗口打开之前的callback
    // previewOpenCallback() {
    //   console.log('已经加载完预览窗口，预览打开了！');
    // }, // 预览窗口打开时的callback
    // beforeOpenCallback() {
    //   console.log('开始打印之前！');
    // }, // 开始打印之前的callback
    // openCallback() {
    //   console.log('执行打印了！');
    // }, // 调用打印时的callback
    // closeCallback() {
    //   console.log('关闭了打印工具！');
    // }, // 关闭打印的callback(无法区分确认or取消)
    // clickMounted() {
    //   console.log('点击v-print绑定的按钮了！');
    // },
  });
</script>
