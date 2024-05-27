<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-27 10:02:20
 * @FilePath: \aster-flowable-vue\src\components\sign\sign-panel.vue
 * @Description: 签名板
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <canvas
    ref="canvasRef"
    @mousedown="mouseDown"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  ></canvas>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  const emits = defineEmits(['update:bgColor']);

  const props = defineProps({
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 300,
    },
    lineWidth: {
      type: Number,
      default: 4,
    },
    lineColor: {
      type: String,
      default: '#000000',
    },
    bgColor: {
      type: String,
      default: '',
    },
    isCrop: {
      type: Boolean,
      default: false,
    },
    isClearBgColor: {
      type: Boolean,
      default: true,
    },
    format: {
      type: String,
      default: 'image/png',
    },
    quality: {
      type: Number,
      default: 1,
    },
  });

  const canvasRef = ref();
  const hasDrew = ref(false);
  const resultImg = ref('');
  const points = ref<{ x: number; y: number }[]>([]);
  const canvasTxt = ref<CanvasRenderingContext2D | null>(null);
  const startX = ref(0);
  const startY = ref(0);
  const isDrawing = ref(false);
  const sratio = ref(1);

  const ratio = computed(() => {
    return props.height / props.width;
  });

  const stageInfo = computed(() => {
    return canvasRef.value.getBoundingClientRect();
  });

  const myBg = computed(() => {
    return props.bgColor ? props.bgColor : 'rgba(255, 255, 255, 0)';
  });
  watch(
    () => myBg,
    (newVal) => {
      canvasRef.value.style.background = newVal;
    },
  );

  const $_resizeHandler = () => {
    canvasRef.value.style.width = props.width + 'px';
    const realw = parseFloat(window.getComputedStyle(canvasRef.value).width);
    canvasRef.value.style.height = ratio.value * realw + 'px';
    canvasTxt.value = canvasRef.value.getContext('2d');
    canvasTxt.value?.scale(1 * sratio.value, 1 * sratio.value);
    sratio.value = realw / props.width;
    canvasTxt.value?.scale(1 / sratio.value, 1 / sratio.value);
  };
  // pc
  const mouseDown = (e) => {
    e = e || event;
    e.preventDefault();
    isDrawing.value = true;
    hasDrew.value = true;
    let obj = {
      x: e.offsetX,
      y: e.offsetY,
    };
    drawStart(obj);
  };
  const mouseMove = (e) => {
    e = e || event;
    e.preventDefault();
    if (isDrawing.value) {
      let obj = {
        x: e.offsetX,
        y: e.offsetY,
      };
      drawMove(obj);
    }
  };
  const mouseUp = (e) => {
    e = e || event;
    e.preventDefault();
    let obj = {
      x: e.offsetX,
      y: e.offsetY,
    };
    drawEnd(obj);
    isDrawing.value = false;
  };
  // mobile
  const touchStart = (e) => {
    e = e || event;
    e.preventDefault();
    hasDrew.value = true;
    if (e.touches.length === 1) {
      let obj = {
        x: e.targetTouches[0].clientX - canvasRef.value.getBoundingClientRect().left,
        y: e.targetTouches[0].clientY - canvasRef.value.getBoundingClientRect().top,
      };
      drawStart(obj);
    }
  };
  const touchMove = (e) => {
    e = e || event;
    e.preventDefault();
    if (e.touches.length === 1) {
      let obj = {
        x: e.targetTouches[0].clientX - canvasRef.value.getBoundingClientRect().left,
        y: e.targetTouches[0].clientY - canvasRef.value.getBoundingClientRect().top,
      };
      drawMove(obj);
    }
  };
  const touchEnd = (e) => {
    e = e || event;
    e.preventDefault();
    if (e.touches.length === 1) {
      let obj = {
        x: e.targetTouches[0].clientX - canvasRef.value.getBoundingClientRect().left,
        y: e.targetTouches[0].clientY - canvasRef.value.getBoundingClientRect().top,
      };
      drawEnd(obj);
    }
  };
  // 绘制
  const drawStart = (obj) => {
    startX.value = obj.x;
    startY.value = obj.y;
    if (canvasTxt.value) {
      canvasTxt.value.beginPath();
      canvasTxt.value.moveTo(startX.value, startY.value);
      canvasTxt.value.lineTo(obj.x, obj.y);
      canvasTxt.value.lineCap = 'round';
      canvasTxt.value.lineJoin = 'round';
      canvasTxt.value.lineWidth = props.lineWidth * sratio.value;
      canvasTxt.value.stroke();
      canvasTxt.value.closePath();
      points.value.push(obj);
    }
  };
  const drawMove = (obj) => {
    if (canvasTxt.value) {
      canvasTxt.value.beginPath();
      canvasTxt.value.moveTo(startX.value, startY.value);
      canvasTxt.value.lineTo(obj.x, obj.y);
      canvasTxt.value.strokeStyle = props.lineColor;
      canvasTxt.value.lineWidth = props.lineWidth * sratio.value;
      canvasTxt.value.lineCap = 'round';
      canvasTxt.value.lineJoin = 'round';
      canvasTxt.value.stroke();
      canvasTxt.value.closePath();
    }
    startY.value = obj.y;
    startX.value = obj.x;
    points.value.push(obj);
  };
  const drawEnd = (obj) => {
    if (canvasTxt.value) {
      canvasTxt.value.beginPath();
      canvasTxt.value.moveTo(startX.value, startY.value);
      canvasTxt.value.lineTo(obj.x, obj.y);
      canvasTxt.value.lineCap = 'round';
      canvasTxt.value.lineJoin = 'round';
      canvasTxt.value.stroke();
      canvasTxt.value.closePath();
    }
    points.value.push(obj);
    points.value.push({ x: -1, y: -1 });
  };
  // 操作
  const generate = (options) => {
    let imgFormat = options && options.format ? options.format : props.format;
    let imgQuality = options && options.quality ? options.quality : props.quality;
    const pm = new Promise((resolve, reject) => {
      if (!hasDrew.value || !canvasTxt.value) {
        reject(`Warning: Not Signned!`);
        return;
      }
      let resImgData: ImageData = canvasTxt.value.getImageData(
        0,
        0,
        canvasRef.value.width,
        canvasRef.value.height,
      );
      canvasTxt.value.globalCompositeOperation = 'destination-over';
      canvasTxt.value.fillStyle = myBg.value;
      canvasTxt.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      resultImg.value = canvasRef.value.toDataURL(imgFormat, imgQuality);
      canvasTxt.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      canvasTxt.value.putImageData(resImgData, 0, 0);
      canvasTxt.value.globalCompositeOperation = 'source-over';
      if (props.isCrop) {
        const crop_area = getCropArea(resImgData.data);
        let crop_canvas: HTMLCanvasElement | null = document.createElement('canvas');
        const crop_ctx = crop_canvas.getContext('2d');
        crop_canvas.width = crop_area[2] - crop_area[0];
        crop_canvas.height = crop_area[3] - crop_area[1];
        const crop_imgData = canvasTxt.value.getImageData(
          crop_area[0],
          crop_area[1],
          crop_area[2],
          crop_area[3],
        );
        if (crop_ctx) {
          crop_ctx.globalCompositeOperation = 'destination-over';
          crop_ctx.putImageData(crop_imgData, 0, 0);
          crop_ctx.fillStyle = myBg.value;
          crop_ctx.fillRect(0, 0, crop_canvas.width, crop_canvas.height);
          resultImg.value = crop_canvas.toDataURL(imgFormat, imgQuality);
          crop_canvas = null;
        }
      }
      resolve(resultImg);
    });
    return pm;
  };
  const reset = () => {
    canvasTxt.value?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    if (props.isClearBgColor) {
      emits('update:bgColor', '');
      canvasRef.value.style.background = 'rgba(255, 255, 255, 0)';
    }
    points.value = [];
    hasDrew.value = false;
    resultImg.value = '';
  };
  const getCropArea = (imgData) => {
    var topX = canvasRef.value.width;
    var btmX = 0;
    var topY = canvasRef.value.height;
    var btnY = 0;
    for (var i = 0; i < canvasRef.value.width; i++) {
      for (var j = 0; j < canvasRef.value.height; j++) {
        var pos = (i + canvasRef.value.width * j) * 4;
        if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
          btnY = Math.max(j, btnY);
          btmX = Math.max(i, btmX);
          topY = Math.min(j, topY);
          topX = Math.min(i, topX);
        }
      }
    }
    topX++;
    btmX++;
    topY++;
    btnY++;
    const data = [topX, topY, btmX, btnY];
    return data;
  };

  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler);
  });
  onMounted(() => {
    canvasRef.value.height = props.height;
    canvasRef.value.width = props.width;
    canvasRef.value.style.background = myBg.value;
    $_resizeHandler();
    // 在画板以外松开鼠标后冻结画笔
    document.onmouseup = () => {
      isDrawing.value = false;
    };
  });

  defineExpose({
    reset,
    generate,
  });
</script>

<style lang="scss" scoped>
  canvas {
    max-width: 100%;
    display: block;
    border: 1px dashed #ccc;
  }
</style>
