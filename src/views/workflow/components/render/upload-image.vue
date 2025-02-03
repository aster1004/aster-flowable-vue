<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 17:59:33
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\upload-image.vue
 * @Description: 图片
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div v-if="!_hidden">
    <el-form-item
      v-if="mode != 'print'"
      :prop="formItemProp"
      :label-width="labelWidth"
      :show-message="showMessage"
    >
      <template #label>
        <span v-show="showLabel" style="line-height: normal">{{ formItem.title }}</span>
      </template>
      <div v-if="mode === 'design'">
        <div class="image-empty">
          <i class="iconfont icon-plus"></i>
        </div>
      </div>
      <div v-else-if="mode === 'form'">
        <el-upload
          v-if="!_readonly"
          :file-list="fileList"
          :action="ImageUpload.url"
          list-type="picture-card"
          :limit="formItem.props.maxNumber"
          :multiple="formItem.props.maxNumber > 1"
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
      <div v-else-if="mode === 'search'" style="width: 100%">
        <el-input v-model="_value[0]" />
      </div>
      <div v-else>
        <span v-for="(item, index) in _value" :key="index">
          <p>
            {{ item.name }}
          </p>
        </span>
      </div>
    </el-form-item>
    <div v-else class="print-file" ref="printRef">
      <div class="print-file-label" :style="{ height: printMaxHeight + 'px' }">
        <span ref="printLabelRef" v-show="showLabel">{{ formItem.title }}</span>
      </div>
      <div class="print-file-value" :style="{ height: printMaxHeight + 'px' }">
        <div ref="printValueRef">
          <el-image
            class="print-image"
            :preview-src-list="previewList"
            v-for="(img, i) in fileList"
            :key="i"
            :alt="img.name"
            :src="img.url"
          />
        </div>
      </div>
    </div>
    <el-dialog v-model="previewVisible" :title="'预览-' + previewFile.name" :lock-scroll="false">
      <div class="image-preview">
        <img w-full :src="previewFile.url" :alt="previewFile.name" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref, watch } from 'vue';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import { ImageUpload } from '@/config/fileConfig';
  import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { ResultEnum } from '@/enums/httpEnum';
  import { downloadFileByUrl } from '@/utils/fileUtils';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';

  const emit = defineEmits(['update:value']);
  const props = defineProps({
    value: {
      type: Array as PropType<WorkForm.FileModel[]>,
      default: () => [],
    },
    mode: {
      type: String as PropType<'design' | 'form' | 'search' | 'table' | 'print'>,
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

  const { t } = useI18n();
  // 显示预览
  const previewVisible = ref<boolean>(false);
  // 预览图片url
  const previewFile = ref<WorkForm.FileModel>({
    name: '',
    url: '',
  });

  // 打印 宽度
  const printRef = ref();
  const printLabelRef = ref();
  const printValueRef = ref();
  const printMaxHeight = ref(32);

  /**
   * @description: 更新高度
   */
  const updateHeight = () => {
    const parentHeight = printRef.value.parentNode?.offsetHeight;
    const labelHeight = printLabelRef.value?.offsetHeight;
    const valueHeight = printValueRef.value?.offsetHeight;
    printMaxHeight.value = Math.max(parentHeight, labelHeight, valueHeight);
  };

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
    // 解析隐藏条件公式
    if (props.formItem.props.hidden) {
      let expression = props.formItem.props.hidden;
      // 如果是子表中的控件，则需要用到下标
      if (isNotEmpty(props.tableId)) {
        expression = expression.replaceAll('?', props.tableIndex);
      }
      r = evaluateFormula(expression, props.formData);
    }
    // 判断流程节点下该控件是否隐藏
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.HIDDEN;
    }
    // 如果是必填则动态添加rule
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

  /**
   * @description: 是否只读, true-只读
   */
  const _readonly = computed(() => {
    let r = props.formItem.props.readonly;
    if (props.formItem.operation && props.formItem.operation.length > 0) {
      r = r || props.formItem.operation[0] == FormPermissionEnum.READONLY;
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

  /**
   * @description: 监听打印高度
   */
  watch(
    () => [props.mode, printRef.value],
    () => {
      if (printRef.value && props.mode === 'print') {
        updateHeight();
      }
    },
    { immediate: true, deep: true },
  );

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
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
