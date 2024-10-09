<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 14:44:20
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\signature-combine.vue
 * @Description: 签章
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
      <div class="sign-combine-container" v-if="mode === 'design'">
        <div class="sign-combine-content">
          <el-input
            v-model="_value.comment"
            type="textarea"
            :rows="3"
            style="width: 100%"
            readonly
            :placeholder="formItem.props.placeholder"
          />
        </div>
        <div class="sign-combine-footer">
          <el-row>
            <el-col :span="12">
              <span>(签字并盖章)</span>
            </el-col>
            <el-col :span="12"> </el-col>
          </el-row>
          <el-row>
            <div class="flex justify-end w-full">
              <p>xxxx 年 xx 月 xx 日</p>
            </div>
          </el-row>
        </div>
      </div>
      <div class="sign-combine-container sign-combine-form" v-else-if="mode === 'form'">
        <div class="sign-combine-content">
          <el-input
            v-model="_value.comment"
            type="textarea"
            :rows="3"
            style="width: 100%"
            :readonly="_readonly"
            :placeholder="formItem.props.placeholder"
          />
        </div>
        <div class="sign-combine-footer">
          <el-row>
            <el-col :span="12">
              <el-button
                type="primary"
                link
                @click="signVisible = true"
                :disabled="_readonly"
                style="position: absolute; bottom: 0"
              >
                (签字并盖章)
              </el-button>
            </el-col>
            <el-col :span="12">
              <div class="sign-combine-preview" :style="_signStyle">
                <img
                  v-if="isNotEmpty(_value.signatureCombine) && formItem.props.showSignatureCombine"
                  :src="_value.signatureCombine"
                />
              </div>
            </el-col>
          </el-row>
          <el-row class="sign-combine-date">
            <div class="flex justify-end w-full">
              <el-button type="primary" link @click="dateVisible = true" :disabled="_readonly">
                <p>{{ _signDates[0] }} 年 {{ _signDates[1] }} 月 {{ _signDates[2] }} 日</p>
              </el-button>
            </div>
          </el-row>
        </div>
      </div>
      <span v-else>
        {{ _value }}
      </span>
      <Sign ref="signRef" :show-local="formItem.props.showLocal" @success="handleSuccess" />
    </el-form-item>
    <div v-else class="print-image">
      <div class="print-image-label">
        <span v-show="showLabel">{{ formItem.title }}</span>
      </div>
      <div class="print-image-value">
        <el-image v-if="isNotEmpty(_value)" style="height: 100px" :src="_value" />
      </div>
    </div>

    <el-dialog v-model="dateVisible" title="签章日期" :lock-scroll="false">
      <div class="flex justify-center items-center">
        <span class="pr-10px">请选择签章日期:</span>
        <el-date-picker
          v-model="_value.date"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </div>
      <template #footer>
        <el-button type="primary" @click="dateVisible = false">
          {{ $t('button.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="signVisible" title="签章" :lock-scroll="false">
      <el-form>
        <el-row>
          <el-col :span="12" v-if="formItem.props.showSignature">
            <el-form-item label="选择签名">
              <i class="iconfont icon-qianming" @click="handleClick"></i>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formItem.props.showSignatureCombine">
            <el-form-item label="选择盖章">
              <el-upload
                class="avatar-uploader"
                :action="ImageUpload.url"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="handleBeforeUpload"
              >
                <i class="iconfont icon-shenpi"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="签章预览">
          <div class="sign-combine-preview" :style="_signStyle">
            <img
              v-if="isNotEmpty(_value.signatureCombine) && formItem.props.showSignatureCombine"
              :src="_value.signatureCombine"
            />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="signVisible = false">
          {{ $t('button.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { evaluateFormula } from '@/utils/workflow';
  import { ref, computed, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import mittBus from '@/utils/mittBus';
  import { isNotEmpty } from '@/utils';
  import Sign from '@/components/sign/index.vue';
  import { FormPermissionEnum } from '@/enums/workFlowEnum';
  import { ImageUpload } from '@/config/fileConfig';
  import { ElMessage, UploadProps } from 'element-plus';

  const { t } = useI18n();
  const emit = defineEmits(['update:value']);

  const props = defineProps({
    value: {
      type: Object as PropType<WorkForm.SignatureCombineModel>,
      default: {
        signature: '',
        signatureCombine: '',
        date: '',
        comment: '',
      },
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

  // 注册组件
  const signRef = ref();
  // 显示签章
  const signVisible = ref(false);
  // 显示日期组件
  const dateVisible = ref(false);

  // 打开签名
  const handleClick = () => {
    signRef.value.init();
  };
  // 更新签名
  const handleSuccess = (val: string) => {
    _value.value.signature = val;
    console.log(_value.value);
  };

  /**
   * @description: 签章日期: 年月日
   */
  const _signDates = computed(() => {
    if (_value.value && _value.value.date && isNotEmpty(_value.value.date)) {
      return _value.value.date.split('-');
    }
    return ['xxxx', 'xx', 'xx'];
  });

  /**
   * @description: 签章图片上传成功
   */
  const handleUploadSuccess: UploadProps['onSuccess'] = (_response, uploadFile) => {
    _value.value.signatureCombine = _response.data.url;
  };

  /**
   * @description: 签章图片上传前
   */
  const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (!ImageUpload.type.includes(rawFile.type)) {
      ElMessage.error(t('error.avatarUploadType'));
      return false;
    } else if (rawFile.size / 1024 / 1024 > ImageUpload.maxSize) {
      ElMessage.error(t('error.avatarUploadSize') + ImageUpload.maxSize + '!');
      return false;
    }
    return true;
  };

  /**
   * @description: 签章样式
   */
  const _signStyle = computed(() => {
    let signStyle: any = {
      width: props.formItem.props.signSize + 'px',
      height: props.formItem.props.signSize + 'px',
    };
    if (props.formItem.props.showSignature && _value.value && isNotEmpty(_value.value.signature)) {
      signStyle.backgroundImage = 'url(' + _value.value.signature + ')';
      signStyle.backgroundSize = '100%';
      signStyle.backgroundRepeat = 'no-repeat';
      signStyle.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      signStyle.backgroundPosition = 'center center';
    }
    return signStyle;
  });

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
      if (props.value && isNotEmpty(props.value)) {
        return props.value;
      }
      return {
        signature: '',
        signatureCombine: '',
        date: '',
        comment: '',
      };
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

  defineExpose({
    _hidden,
  });
</script>
<style scoped lang="scss">
  @import url(../print/print.scss);

  .sign-combine-container {
    width: 100%;
    min-height: 150px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-fill-color-blank);
  }
  .sign-combine-container:hover {
    border: 1px solid var(--el-border-color-hover);
  }

  .sign-combine-footer {
    position: absolute;
    bottom: 0;
    right: 20px;
    color: var(--el-color-info);
    width: 200px;
  }

  .sign-combine-date {
    color: var(--el-color-primary);
  }

  .sign-combine-preview {
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  :deep(.el-textarea__inner) {
    outline: none;
    border: none;
    resize: none;
    box-shadow: none;
  }
</style>
