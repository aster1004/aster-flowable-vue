<template>
  <div class="emoji-selector" @mousedown.prevent @mousedown.stop>
    <div class="triangle" />
    <div class="emoji-content">
      <div class="category">
        <div
          v-for="(item, i) in currentEmojis"
          :key="`emoji-${i}`"
          class="item"
          @click="onChoose(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="next-page">
      <div
        v-for="cat in Object.keys(emojis)"
        :key="cat"
        :class="{ active: currentCat === cat }"
        @click="nextPage(cat)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';

  /**
   * 加载传入的方法
   */
  const emits = defineEmits<{ (e: 'choose', value: string): void }>();

  /**
   * 调用父组件方法
   * @param item 表情
   */
  const onChoose = (item: string) => {
    emits('choose', item);
  };

  /** 当前表情key */
  const currentCat = ref('FrequentlyUsed');

  /** 所有表情 */
  const emojis = reactive({
    FrequentlyUsed: [
      '😃',
      '😘',
      '😂',
      '😳',
      '😍',
      '👏',
      '👍',
      '👎',
      '😁',
      '😉',
      '😠',
      '😞',
      '😥',
      '😭',
      '😝',
      '😡',
      '❤',
      '💔',
      '😣',
      '😔',
      '😄',
      '😷',
      '😚',
      '😓',
      '😊',
      '😢',
      '😜',
      '😨',
      '😰',
      '😲',
      '😏',
      '😱',
      '😪',
      '😖',
      '😌',
      '😒',
      '👻',
      '🎅',
      '👧',
      '👦',
      '👩',
      '👨',
      '🐶',
      '🐱',
      '👊',
      '✊',
      '✌',
      '💪',
      '👆',
      '👇',
      '👉',
      '👈',
      '👌',
      '💩',
    ],
    Symbols0: [
      '🤗',
      '😎',
      '🤓',
      '👩‍💻',
      '👨‍💻',
      '🙄',
      '😭',
      '😨',
      '🤪',
      '🎉',
      '🤔',
      '🐵',
      '😇',
      '🤬',
      '🐈',
      '😹',
      '🙀',
      '🇨🇳',
      '👮',
      '🐕',
      '✅',
      '👋',
      '🔥',
      '🐛',
      '🍉',
      '👽',
      '🤖',
      '⌚',
      '🤝',
      '🏳️‍🌈',
      '🚩',
      '💤',
      '®',
      '©',
      '💯',
      '™',
      '💻',
      '📅',
      '📌',
      '✉',
      '⌨',
      '📗',
      '🤳',
      '🛌',
      '🎣',
      '🎨',
      '🎧',
      '🎸',
      '🎤',
      '🏸',
      '🏀',
      '⚽',
      '🎮',
      '🏊',
    ],
    Symbols1: [
      '🍗',
      '🦄',
      '🔞',
      '🙏',
      '☀',
      '🌙',
      '🌟',
      '⚡',
      '☁',
      '☔',
      '🍁',
      '🌻',
      '🍃',
      '👗',
      '🎀',
      '👄',
      '🌹',
      '☕',
      '🎂',
      '🕙',
      '🍺',
      '🔍',
      '📱',
      '🏠',
      '🚗',
      '🎁',
      '⚽',
      '💣',
      '💎',
      '💊',
      '🤮',
      '🏆',
      '👿',
    ],
  });

  onMounted(() => {
    // 初始化
    setEmojis();
  });

  const currentEmojis = ref([]);

  /**
   * 设置表情
   */
  const setEmojis = () => {
    currentEmojis.value = emojis[currentCat.value];
  };

  /**
   * 下一页
   * @param cat 表情key
   */
  const nextPage = (cat: string) => {
    currentCat.value = cat;
    setEmojis();
  };
</script>
<style scoped lang="scss">
  .emoji-selector {
    padding: 0.8rem;
    position: absolute;
    top: 2.24rem;
    z-index: 1;
    bottom: 0;
    width: 19rem;
    height: 14rem;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.16);
    box-sizing: content-box;
    .triangle {
      position: absolute;
      top: -0.56rem;
      left: 14%;
      width: 0;
      height: 0;
      transform: translate(-50%, -50%);
      border: 0.64rem solid transparent;
      border-bottom-color: #fff;
    }
    .emoji-content {
      height: 100%;
      overflow: auto;
      margin-bottom: 10px;
      .category {
        max-width: 19rem;
        max-height: 13rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        .item {
          width: calc(19rem / 9);
          height: calc(13rem / 6);
          font-size: 1.25rem;
          text-align: center;
          line-height: calc(10rem / 6);
          cursor: pointer;
          .item:hover {
            font-size: 1.6rem;
          }
        }
      }
    }
    .next-page {
      list-style: none;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%, -50%);
      div {
        list-style: none;
        margin: 0 5px;
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background-color: #f0f0f0;
        cursor: pointer;
        div.active {
          cursor: default;
          background-color: #d8d8d8;
        }
      }
    }
  }
</style>
