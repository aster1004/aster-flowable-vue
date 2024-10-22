<!--
 * @Author: lwj
 * @Date: 2024-09-18 10:19:33
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\approve-upload-image.vue
 * @Description: 完成任务时，上传图片组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-upload
    :file-list="_value"
    :action="ImageUpload.url"
    list-type="picture-card"
    :limit="limit"
    :multiple="multiple"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="handleBeforeUpload"
  >
    <i class="iconfont icon-plus !text-4xl"></i>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview px-3px" @click="handlePreview(file)">
            <i class="iconfont icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete px-3px" @click="handleDownload(file)">
            <i class="iconfont icon-xiazai"></i>
          </span>
          <span class="el-upload-list__item-delete px-3px" @click="handleRemove(file, [])">
            <i class="iconfont icon-shanchu"></i>
          </span>
        </span>
      </div>
    </template>
    <template #tip>
      <div class="el-upload__tip"> 单个图片大小不超过{{ maxSize }}M </div>
    </template>
  </el-upload>
  <el-dialog v-model="previewVisible" :title="'预览-' + previewFile.name" :lock-scroll="false">
    <div class="image-preview">
      <img style="width: 100%" :src="previewFile.url" :alt="previewFile.name" />
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, PropType, ref } from 'vue';
  import { ImageUpload } from '@/config/fileConfig';
  import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';
  import { isNotEmpty } from '@/utils';
  import { downloadFileByUrl } from '@/utils/fileUtils';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<WorkForm.FileModel[]>,
      default: () => [],
    },
    //允许上传文件的最大数量
    limit: {
      type: Number,
      default: 10,
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: true,
    },
    maxSize: {
      type: Number,
      default: 10,
    },
  });

  // 显示预览
  const previewVisible = ref<boolean>(false);
  // 预览图片url
  const previewFile = ref<WorkForm.FileModel>({
    name: '',
    url: '',
  });

  /**
   * @description: 组件值
   */
  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emit('update:value', val);
    },
  });

  /**
   * @description: 超过限制数量时的操作
   * @return {*}
   */
  const handleExceed = () => {
    // 判断图片数量
    ElMessage.error('上传图片数量不能超过' + props.limit + '个');
    return;
  };

  /**
   * @description: 文件上传成功后的操作
   * @return {*}
   */
  const handleSuccess: UploadProps['onSuccess'] = (_response) => {
    if (_response.code == ResultEnum.SUCCESS) {
      const imgObj: WorkForm.FileModel = {
        name: _response.data.name,
        url: _response.data.url,
      };
      _value.value.push(imgObj);
      // 把图片对象传给父组件
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
    } else if (rawFile.size / 1024 / 1024 > props.maxSize && props.maxSize != 0) {
      // 判断图片大小
      ElMessage.error('上传图片大小不能超过' + props.maxSize + 'MB');
      return false;
    }
    return true;
  };

  /**
   * @description: 预览图片
   * @return {*}
   */
  const handlePreview: UploadProps['onPreview'] = (file: any) => {
    previewFile.value = {
      name: file.name,
      url: file.url,
    };
    previewVisible.value = true;
  };

  /**
   * @description: 删除图片
   * @return {*}
   */
  const handleRemove: UploadProps['onRemove'] = (file: any) => {
    let i = _value.value.findIndex((v) => v.url == file.url);
    _value.value.splice(i, 1);
  };

  /**
   * @description: 下载图片
   * @param {*} file
   * @return {*}
   */
  const handleDownload = (file: any) => {
    if (isNotEmpty(file.url)) {
      ElMessageBox.confirm('是否要下载此图片?', t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      }).then(async () => {
        downloadFileByUrl(file.url, file.name);
      });
    } else {
      ElMessage.error('图片不存在');
    }
  };
</script>
<style scoped lang="scss">
  .image-empty {
    i {
      color: #dbdbdb;
      padding: 10px;
      font-size: xx-large;
      background: white;
      border: 1px dashed #8c8c8c;
    }
  }

  .image-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 10px 0 20px;
  }

  ::v-deep(.el-upload-list__item) {
    width: 100px;
    height: 100px;
    transition: none;
    .el-upload-list__item-actions {
      & > span + span {
        margin: 1px;
      }
    }
  }
  ::v-deep(.el-upload--picture-card) {
    background-color: #ffffff;
  }
  ::v-deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
  }
</style>
