<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-27 11:09:53
 * @FilePath: \aster-flowable-vue\src\components\sign\index.vue
 * @Description: 签名
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    title="签名"
    v-model="visible"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    draggable
  >
    <div class="sign">
      <div class="sign-header" v-if="_showLineWidth || _showLineColor || _showLocal">
        <div class="sign-setting">
          <div class="sign-setting__width" v-if="_showLineWidth">
            <span>线宽</span>
            <el-input-number v-model="_lineWidth" :min="1" :max="20" />
          </div>
          <div class="sign-setting__color" v-if="_showLineColor">
            <span>颜色</span>
            <color-picker v-model="_lineColor" />
          </div>
          <div class="sign-setting__local" v-if="_showLocal">
            <span>是否使用本地签名图片</span>
            <el-switch v-model="showLocalSign" />
          </div>
        </div>
      </div>

      <sign-panel
        v-if="!showLocalSign"
        ref="signPanelRef"
        :lineWidth="_lineWidth"
        :lineColor="_lineColor"
      />
      <div v-else class="sign-image">
        <div class="sign-image__btn">
          <el-upload
            :file-list="fileList"
            :action="ImageUpload.url"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="handleBeforeUpload"
            :show-file-list="false"
          >
            <template #trigger>
              <el-button type="primary">上传本地签名</el-button>
            </template>
          </el-upload>
        </div>
        <div class="sign-image__preview">
          <el-image
            style="width: 100px; height: 100px"
            :preview-src-list="_previewList"
            v-for="(item, index) in fileList"
            :key="index"
            :alt="item.name"
            :src="item.url"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button type="info" @click="clear">清空</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import SignPanel from './sign-panel.vue';
  import ColorPicker from '@/components/color/color-picker.vue';
  import { computed, ref } from 'vue';
  import { ImageUpload } from '@/config/fileConfig';
  import { ElMessage, UploadProps } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';

  const emits = defineEmits(['success']);

  const props = defineProps({
    showLineWidth: {
      type: Boolean,
      default: false,
    },
    showLineColor: {
      type: Boolean,
      default: false,
    },
    showLocal: {
      type: Boolean,
      default: false,
    },
  });

  // 显示弹窗
  const visible = ref(false);
  // 注册组件
  const signPanelRef = ref();
  // 显示本地签名
  const showLocalSign = ref(false);
  // 线宽
  const _lineWidth = ref<number>(4);
  // 颜色
  const _lineColor = ref<string>('#000000');
  // 上传
  const fileList = ref<WorkForm.FileModel[]>([]);
  // 签名
  const resultImg = ref('');

  const _showLineWidth = computed(() => props.showLineWidth);
  const _showLineColor = computed(() => props.showLineColor);
  const _showLocal = computed(() => props.showLocal);
  const _previewList = computed(() => {
    return fileList.value.map((m) => m.url);
  });

  /**
   * @description: 文件上传成功后的操作
   * @return {*}
   */
  const handleSuccess: UploadProps['onSuccess'] = (_response) => {
    if (_response.code == ResultEnum.SUCCESS) {
      fileList.value = [];
      const imgObj: WorkForm.FileModel = {
        name: _response.data.name,
        url: _response.data.url,
      };
      fileList.value.push(imgObj);
      resultImg.value = _response.data.url;
      console.log(fileList.value);
    } else {
      ElMessage.error(_response.message);
    }
  };

  /**
   * @description: 上传失败时的操作
   * @return {*}
   */
  const handleError = (error: Error) => {
    ElMessage.error('文件上传失败:' + error);
  };
  /**
   * @description: 上传文件之前的操作
   * @return {*}
   */
  const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 判断图片类型
    if (!ImageUpload.type.includes(rawFile.type)) {
      ElMessage.error('上传文件必须是图片格式');
      return false;
    } else if (rawFile.size / 1024 / 1024 > ImageUpload.maxSize) {
      // 判断图片大小
      ElMessage.error('上传图片大小不能超过' + ImageUpload.maxSize + 'MB');
      return false;
    }
    return true;
  };

  /**
   * @description: 生成签名
   * @return {*}
   */
  const submit = () => {
    // 如果不是本地签名
    if (!showLocalSign.value) {
      signPanelRef.value.generate().then((res: any) => {
        resultImg.value = res.value;
        emits('success', resultImg.value);
        visible.value = false;
      });
    } else {
      emits('success', resultImg.value);
      visible.value = false;
    }
  };

  /**
   * @description: 清空签名
   * @return {*}
   */
  const clear = () => {
    signPanelRef.value.reset();
  };

  /**
   * @description: 初始化
   * @return {*}
   */
  const init = () => {
    visible.value = true;
  };

  defineExpose({ init });
</script>
<style scoped lang="scss">
  .sign {
    width: 100%;
    height: 100%;
  }

  .sign-header {
    padding-bottom: 15px;
  }
  .sign-setting {
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      padding-right: 10px;
    }

    &__width {
      margin-right: 20px;
    }

    &__color {
      display: flex;
    }
  }

  .sign-image {
    width: 100%;
    height: 100%;
    padding: 15px 15px 0px;
    border: 1px dashed #ccc;

    &__btn {
      padding-bottom: 10px;
    }

    &__preview {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100px;
    }
  }
</style>
