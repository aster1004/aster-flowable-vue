<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 17:59:33
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\upload-image.vue
 * @Description: 图片
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-form-item
    v-if="!_hidden"
    :prop="formItemProp"
    :label-width="labelWidth"
    :show-message="showMessage"
  >
    <template #label>
      <span v-show="showLabel">{{ formItem.title }}</span>
    </template>
    <div v-if="mode === 'design'">
      <div class="image-empty">
        <i class="iconfont icon-plus"></i>
      </div>
    </div>
    <div v-else-if="mode === 'form'">
      <el-upload
        v-if="!formItem.props.readonly"
        :file-list="fileList"
        :action="ImageUpload.url"
        list-type="picture-card"
        :limit="formItem.props.maxNumber"
        :multipl="formItem.props.maxNumber > 1"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
      >
        <i class="iconfont icon-plus !text-4xl"></i>
      </el-upload>
      <div v-else class="image-readonly">
        <el-image
          style="width: 100px; height: 100px"
          :preview-src-list="previewList"
          v-for="(img, i) in fileList"
          :key="i"
          :alt="img.name"
          :src="img.url"
        />
      </div>
    </div>
    <div v-else>
      <el-image
        style="width: 100px; height: 100px"
        :preview-src-list="previewList"
        v-for="(img, i) in fileList"
        :key="i"
        :alt="img.name"
        :src="img.url"
      />
    </div>

    <el-dialog v-model="previewVisible">
      <div class="image-preview">
        <img w-full :src="previewImageUrl" alt="预览图片" />
      </div>
    </el-dialog>
  </el-form-item>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { ImageUpload } from '@/config/fileConfig';
  import { ElMessage, UploadProps } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<WorkForm.FileModel[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search'>,
      default: 'design',
    },
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: {},
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
    tableId: {
      type: String,
      default: '',
    },
    tableIndex: {
      type: Number,
      default: 0,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
  });

  // 显示预览
  const previewVisible = ref<boolean>(false);
  // 预览图片url
  const previewImageUrl = ref<string>('');

  // 键
  const formItemProp = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return props.tableId + '.' + props.tableIndex + '.' + props.formItem.id;
    } else {
      return props.formItem.id;
    }
  });

  // 标签长度
  const labelWidth = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return '12px';
    } else {
      return '';
    }
  });

  // 是否显示校验信息
  const showMessage = computed(() => {
    if (isNotEmpty(props.tableId)) {
      return false;
    } else {
      return true;
    }
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
   * @description: 是否隐藏, true-隐藏
   */
  const _hidden = computed(() => {
    let r = false;
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (isNotEmpty(props.tableId)) {
        expression = expression.replaceAll('?', props.tableIndex);
      }
      r = evaluateFormula(expression, props.formData);
    }
    if (props.formItem.props.required) {
      // 调用form-render的方法
      mittBus.emit('changeFormRules', {
        hidden: r,
        fieldId: isNotEmpty(props.tableId)
          ? props.tableId + '.' + props.tableIndex + '.' + props.formItem.id
          : props.formItem.id,
        fieldName: props.formItem.title,
        trigger: 'blur',
      });
    }
    return r;
  });

  // 只读预览
  const previewList = computed(() => {
    return _value.value.map((v) => v.url);
  });

  // 图片列表
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
    ElMessage.error('上传图片数量不能超过' + props.formItem.props.maxNumber + '个');
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
   * @description: 预览图片
   * @return {*}
   */
  const handlePreview: UploadProps['onPreview'] = (file: any) => {
    previewImageUrl.value = file.url;
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
    } else if (
      rawFile.size / 1024 / 1024 > props.formItem.props.maxSize &&
      props.formItem.props.maxSize != 0
    ) {
      // 判断图片大小
      ElMessage.error('上传图片大小不能超过' + props.formItem.props.maxSize + 'MB');
      return false;
    }
    return true;
  };

  defineExpose({
    _hidden,
  });
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
    width: 100px;
    height: 100px;
  }

  ::v-deep(.el-upload-list__item .el-icon--close-tip) {
    display: none !important;
  }
</style>
