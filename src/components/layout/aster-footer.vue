<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-08 17:11:58
 * @FilePath: \aster-flowable-vue\src\components\layout\aster-footer.vue
 * @Description: footer
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-footer>
    <div class="footer">
      <a href="https://gitee.com/lp1791803611/aster-study-plan" target="_blank">
        {{ currentYear }} © aster.vip By Aster
      </a>
      <div v-show="showSentence" class="sentence">
        <span :style="titleStyle">{{ title }}</span>
        <div class="comment">
          <el-button plain @click="comment('dislike', title)">
            <i :class="iconStyle.chaping"></i>
          </el-button>
          <el-button plain @click="comment('like', title)">
            <i :class="iconStyle.haoping"></i>
          </el-button>
        </div>
      </div>
    </div>
  </el-footer>
</template>
<script setup lang="ts">
  import { inspireApi, setComment } from '@/api';
  import { ResultEnum } from '@/enums/httpEnum';
  import { randomNum } from '@/utils';
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import { ElNotification } from 'element-plus';

  const showSentence = ref(true);
  const sentenceList = ref<Inspire.InspireInfo[]>([]);
  const title = ref('');
  const currentYear = new Date().getFullYear();

  const iconStyle = reactive({
    haoping: 'iconfont icon-haoping',
    chaping: 'iconfont icon-chaping',
  });
  const colorList = ref([
    { s: '#EE9CA7', e: '#FFDDE1', c: '#909399' },
    { s: '#FCEABB', e: '#F8B500', c: '#ffffff' },
    { s: '#FFAFBD', e: '#FFC3A0', c: '#ffffff' },
    { s: '#ED4264', e: '#FFEDBC', c: '#ffffff' },
    { s: '#C9FFBF', e: '#FFAFBD', c: '#909399' },
    { s: '#D9A7C7', e: '#FFFCDC', c: '#b88230' },
    { s: '#D3959B', e: '#BFE6BA', c: '#c45656' },
    { s: '#E1EEC3', e: '#F05053', c: '#ffffff' },
    { s: '#D3CCE3', e: '#E9E4F0', c: '#f89898' },
    { s: '#1C92D2', e: '#F2FCFE', c: '#606266' },
  ]);
  const startColor = ref(colorList.value[3].s);
  const endColor = ref(colorList.value[3].e);
  const titleColor = ref(colorList.value[3].c);

  const titleStyle = computed(() => {
    const bgColor = 'linear-gradient(to right, ' + startColor.value + ' , ' + endColor.value + ')';
    return {
      backgroundImage: bgColor,
      color: titleColor.value,
      padding: '5px',
      borderRadius: '5px',
    };
  });

  onMounted(() => {
    sentence();
  });

  const sentence = () => {
    inspireApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        sentenceList.value = res.data;
        title.value = sentenceList.value[0].content;
        randomSentence();
      }
    });
  };

  const comment = (type: string, title: string) => {
    let message = '';
    if (type == 'like') {
      iconStyle.haoping = 'iconfont icon-haoping active';
      iconStyle.chaping = 'iconfont icon-chaping';
      message =
        '<i class="iconfont icon-xiaolian-" style="color: #fd726d" /> 海内存知己，天涯若比邻';
    } else {
      iconStyle.haoping = 'iconfont icon-haoping';
      iconStyle.chaping = 'iconfont icon-chaping active';
      message =
        '<i class="iconfont icon-error" style="color: #0c819f" /> 横看成岭侧成峰，远近高低各不同';
    }
    setComment({ content: title, type: type }).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        ElNotification({
          message: message,
          position: 'bottom-right',
          dangerouslyUseHTMLString: true,
          duration: 3000,
          offset: 50,
        });
      }
    });
  };

  const timer = ref();

  /**
   * @description: 随机语句
   * @return {*}
   */
  const randomSentence = () => {
    timer.value = setInterval(
      () => {
        // 文本
        const i = randomNum(0, sentenceList.value.length - 1);
        title.value = sentenceList.value[i].content;
        // 文本样式
        const j = randomNum(0, 9);
        startColor.value = colorList.value[j].s;
        endColor.value = colorList.value[j].e;
        titleColor.value = colorList.value[j].c;
        // 点赞样式
        iconStyle.haoping = 'iconfont icon-haoping';
        iconStyle.chaping = 'iconfont icon-chaping';
      },
      1000 * 60 * 10,
    );
  };

  /** 页面销毁前清除定时器 */
  onBeforeUnmount(() => {
    clearInterval(timer.value);
  });
</script>
<style lang="scss" scoped>
  .el-footer {
    height: auto;
    padding: 0;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-light);

    a {
      width: 60%;
      display: flex;
      justify-content: flex-end;
      font-size: 14px;
      color: var(--el-text-color-secondary);
      text-decoration: none;
      letter-spacing: 0.5px;
    }

    .sentence {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      padding: 0 20px;
      width: 40%;

      span {
        white-space: normal !important;
        line-height: 1;
        font-size: 13px;
        color: var(--el-text-color-secondary);
        text-align: center;
        text-decoration: none;
        letter-spacing: 0.5px;
      }

      .comment {
        display: flex;

        button {
          margin-left: 10px;
          padding: 8px 10px;
          height: 22px;
        }

        i {
          font-size: 14px;
        }

        .active {
          font-weight: bold;
          color: #fc8888;
        }
      }
    }
  }
</style>
