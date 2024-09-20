<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-15 17:58:58
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\upload-file.vue
 * @Description: 附件
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
        <span v-show="showLabel">{{ formItem.title }}</span>
      </template>
      <div v-if="mode === 'design'">
        <div class="file-empty">
          <el-button disabled> <i class="iconfont icon-fujian pr-5px"></i>点击上传附件 </el-button>
        </div>
      </div>
      <div v-else-if="mode === 'form'" style="width: 100%">
        <el-upload
          v-if="!_readonly"
          list-type="text"
          :file-list="fileList"
          :action="ImageUpload.url"
          :accept="acceptList"
          :limit="formItem.props.maxNumber"
          :multiple="formItem.props.maxNumber > 1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-error="handleError"
          :before-upload="handleBeforeUpload"
        >
          <el-button> <i class="iconfont icon-fujian pr-5px"></i>点击上传附件 </el-button>
        </el-upload>
        <div v-else class="file-readonly">
          <el-row v-for="(item, index) in _value" :key="index">
            <el-col :span="24">
              <span :title="item.name">{{ item.name }}</span>
            </el-col>
          </el-row>
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
    <div v-else class="print-file">
      <div class="print-file-label">
        <span v-show="showLabel">{{ formItem.title }}</span>
      </div>
      <div class="print-file-value">
        <div v-for="(item, index) in _value" :key="index">
          <p>
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="previewImageVisible"
      :title="'预览-' + previewFile.name"
      :lock-scroll="false"
    >
      <div class="image-preview">
        <img w-full :src="previewFile.url" :alt="previewFile.name" />
      </div>
      <template #footer>
        <el-button @click="previewImageVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDownload">{{ $t('button.download') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { computed, PropType, ref } from 'vue';
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

  // 显示文档预览
  const previewDocumentVisible = ref<boolean>(false);
  // 显示图片预览
  const previewImageVisible = ref<boolean>(false);
  // 预览文件
  const previewFile = ref<WorkForm.FileModel>({
    name: '',
    url: '',
  });
  // 可以预览的文件后缀
  const fileExtensions = ref(['.pdf', '.doc,.docx', '.xls,.xlsx', '.ppt,.pptx', '.txt,.csv']);

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

  // 附件类型
  const acceptList = computed(() => {
    if (props.formItem.props.fileTypes == null || props.formItem.props.fileTypes.length == 0) {
      return '';
    }
    return props.formItem.props.fileTypes.join(',');
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
    // 判断附件数量
    ElMessage.error('上传附件数量不能超过' + props.formItem.props.maxNumber + '个');
    return;
  };

  /**
   * @description: 文件上传成功后的操作
   * @return {*}
   */
  const handleSuccess: UploadProps['onSuccess'] = (_response) => {
    if (_response.code == ResultEnum.SUCCESS) {
      const fileObj: WorkForm.FileModel = {
        name: _response.data.name,
        url: _response.data.url,
      };
      _value.value.push(fileObj);
    } else {
      ElMessage.error(_response.message);
    }
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
    if (isNotEmpty(acceptList.value) && !acceptList.value.includes(rawFile.type)) {
      ElMessage.error('不支持上传此类型的文件');
      return false;
    } else if (
      rawFile.size / 1024 / 1024 > props.formItem.props.maxSize &&
      props.formItem.props.maxSize != 0
    ) {
      // 判断附件大小
      ElMessage.error('上传附件大小不能超过' + props.formItem.props.maxSize + 'MB');
      return false;
    }
    return true;
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

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);
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
