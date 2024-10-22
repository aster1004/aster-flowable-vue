<!--
 * @Author: lwj
 * @Date: 2024-09-18 10:19:33
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\approve-upload-image.vue
 * @Description: 完成任务时，上传附件组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-upload
    list-type="text"
    :file-list="fileList"
    :action="ImageUpload.url"
    :accept="accept"
    :limit="limit"
    :multiple="multiple"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-error="handleError"
    :before-upload="handleBeforeUpload"
  >
    <el-button> <i class="iconfont icon-fujian pr-5px"></i>点击上传附件 </el-button>
    <template #tip>
      <div class="el-upload__tip"> 单个附件大小不超过{{ maxSize }}M </div>
    </template>
  </el-upload>

  <el-dialog v-model="previewImageVisible" :title="'预览-' + previewFile.name" :lock-scroll="false">
    <div class="image-preview">
      <img w-full :src="previewFile.url" :alt="previewFile.name" />
    </div>
    <template #footer>
      <el-button @click="previewImageVisible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleDownload">{{ $t('button.download') }}</el-button>
    </template>
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
    // 支持的格式
    accept: {
      type: Array,
      default: [],
    },
  });

  // 显示文档预览
  const previewDocumentVisible = ref<boolean>(false);
  // 显示图片预览
  const previewImageVisible = ref<boolean>(false);
  // 预览图片url
  const previewFile = ref<WorkForm.FileModel>({
    name: '',
    url: '',
  });
  // 可以预览的文件后缀
  const fileExtensions = ref(['.pdf', '.doc,.docx', '.xls,.xlsx', '.ppt,.pptx', '.txt,.csv']);
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

  // 附件列表
  const fileList = computed(() => {
    return _value.value.map((f) => {
      return {
        name: f.name,
        url: f.url,
        status: 'success',
      };
    });
  });
  /**
   * @description: 超过限制数量时的操作
   * @return {*}
   */
  const handleExceed = () => {
    // 判断图片数量
    ElMessage.error('上传附件数量不能超过' + props.limit + '个');
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
    // 判断附件类型
    if (isNotEmpty(props.accept) && !props.accept.includes(rawFile.type)) {
      ElMessage.error('不支持上传此类型的文件');
      return false;
    } else if (rawFile.size / 1024 / 1024 > props.maxSize && props.maxSize != 0) {
      // 判断附件大小
      ElMessage.error('上传附件大小不能超过' + props.maxSize + 'MB');
      return false;
    }
    return true;
  };

  /**
   * @description: 预览文件
   * @return {*}
   */
  const handlePreview: UploadProps['onPreview'] = (file: any) => {
    const extension = file.url.split('.').pop();
    if (ImageUpload.type.join(',').indexOf(extension) != -1) {
      previewFile.value = {
        name: file.name,
        url: file.url,
      };
      previewImageVisible.value = true;
    } else if (fileExtensions.value.join(',').indexOf(extension) != -1) {
      previewDocumentVisible.value = true;
    } else {
      ElMessageBox.confirm('不支持预览此类型的文件,是否要下载查看?', t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      }).then(async () => {
        await downloadFileByUrl(file.url, file.name);
      });
    }
  };

  /**
   * @description: 删除附件
   * @return {*}
   */
  const handleRemove: UploadProps['onRemove'] = (file: any) => {
    let i = _value.value.findIndex((v) => v.url == file.url);
    _value.value.splice(i, 1);
  };

  /**
   * @description: 下载附件
   * @return {*}
   */
  const handleDownload = () => {
    if (isNotEmpty(previewFile.value.url)) {
      ElMessageBox.confirm('是否要下载此文件?', t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      }).then(async () => {
        downloadFileByUrl(previewFile.value.url, previewFile.value.name);
      });
    } else {
      ElMessage.error('附件不存在');
    }
  };
</script>
<style scoped lang="scss">
  .file-empty {
    color: #909399;
  }

  .file-readonly {
    color: #606266;
  }

  .image-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  ::v-deep(.el-upload-list__item .el-icon--close-tip) {
    display: none !important;
  }
</style>
