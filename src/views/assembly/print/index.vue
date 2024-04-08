<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 10:21:42
 * @FilePath: \aster-admin\src\views\assembly\print\index.vue
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
    <el-card shadow="hover" header="常用打印" class="mt-20px">
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
  </div>
</template>

<script lang="ts" setup>
  import printJs from 'print-js';
  import { getStaticResource } from '@/utils';

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
</script>
