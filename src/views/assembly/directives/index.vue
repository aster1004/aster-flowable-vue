<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 15:49:38
 * @FilePath: \aster-flowable-vue\src\views\assembly\directives\index.vue
 * @Description: 自定义指令
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div>
    <el-card class="box-card">
      <span class="title">复制指令</span>
      <div class="content">
        <el-input v-model="copyData" placeholder="请输入内容" style="width: 500px">
          <template #append>
            <el-button v-copy="copyData"> 复制 </el-button>
          </template>
        </el-input>
      </div>
    </el-card>

    <el-card class="box-card">
      <span class="title">防抖指令</span>
      <div class="content">
        <el-button v-debounce="debounceClick" type="primary"> 防抖按钮 (0.5秒后执行) </el-button>
      </div>
    </el-card>

    <el-card class="box-card">
      <span class="title">节流指令</span>
      <div class="content">
        <el-button v-throttle="throttleClick" type="primary"> 节流按钮 (每隔1S秒后执行) </el-button>
      </div>
    </el-card>

    <el-card class="box-card">
      <span class="title">长按指令</span>
      <div class="content">
        <el-button v-longpress="longpress" type="primary"> 长按2秒触发事件 </el-button>
      </div>
    </el-card>

    <el-card class="box-card">
      <div v-waterMarker="waterMarker" style="height: 400px">
        <span class="title">水印指令</span>
      </div>
    </el-card>

    <el-card class="box-card">
      <span class="title">懒加载图片指令1</span>
      <div class="content">
        <img v-lazy="images[0]" />
      </div>
    </el-card>
    <el-card class="box-card">
      <span class="title">懒加载图片指令2</span>
      <div class="content">
        <img v-lazy="images[1]" />
      </div>
    </el-card>
    <el-card class="box-card">
      <span class="title">懒加载图片指令3</span>
      <div class="content">
        <img v-lazy="images[2]" />
      </div>
    </el-card>
    <el-card class="box-card">
      <span class="title">懒加载图片指令4</span>
      <div class="content">
        <img v-lazy="images[3]" />
      </div>
    </el-card>
    <el-card class="box-card">
      <span class="title">懒加载图片指令5</span>
      <div class="content">
        <img v-lazy="images[4]" />
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  // 复制
  const copyData = ref<string>('业精于勤而荒于嬉，行成于思而毁于随！');
  // 防抖
  const debounceClick = () => {
    ElMessage.success('防抖按钮触发的事件');
  };
  // 节流
  const throttleClick = () => {
    ElMessage.success('节流按钮触发的事件');
  };
  // 长按
  const longpress = () => {
    ElMessage.success('长按事件触发成功');
  };
  // 懒加载图片
  const images = ref([
    'http://img.duoziwang.com/2019/05/09031346722939.jpg',
    'http://img.duoziwang.com/2016/11/24/23534140262.jpg',
    'http://img.duoziwang.com/2018/13/03151103290838.jpg',
    'http://img.duoziwang.com/2019/02/03181323315771.jpg',
    'http://img.duoziwang.com/2018/25/12191441795774.jpg',
  ]);
  // 水印
  const waterMarker = reactive({
    text: 'Aster',
    textColor: 'rgba(180, 180, 180, 0.6)',
  });
</script>
<style lang="scss" scoped>
  .box-card {
    margin: 20px;

    .title {
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
      color: var(--el-text-color-regular);
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .el-descriptions {
      width: 100%;
      padding: 40px 0 0;
      .el-descriptions__title {
        font-size: 18px;
      }
      .el-descriptions__label {
        width: 200px;
      }
    }
  }
</style>
