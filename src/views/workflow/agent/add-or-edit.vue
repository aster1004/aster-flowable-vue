<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    draggable
  >
    <el-form
      ref="formDataRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="delegatorId" :label="$t('workflow.label.delegatorName')">
            <el-input
              v-model="formData.delegatorName"
              readonly
              @click="handleSelectUser('delegator')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="agentId" :label="$t('workflow.label.agentName')">
            <el-input v-model="formData.agentName" readonly @click="handleSelectUser('agent')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="agentType" :label="$t('workflow.label.agentType')">
            <template #label>
              <div>
                {{ $t('workflow.label.agentType') }}
                <el-tooltip
                  content="设为永久代理后，被代理人的所有代理关系将会失效"
                  placement="top"
                >
                  <i class="iconfont icon-help"></i>
                </el-tooltip>
              </div>
            </template>
            <dict-select v-model="formData.agentType" dict-type="agent_type" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="formData.agentType != '1'">
          <el-form-item prop="startTime" :label="$t('workflow.label.agentStart')">
            <el-date-picker
              type="datetime"
              v-model="formData.startTime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="formData.agentType != '1'">
          <el-form-item prop="endTime" :label="$t('workflow.label.agentEnd')">
            <el-date-picker
              type="datetime"
              v-model="formData.endTime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="agentReason" :label="$t('workflow.label.agentReason')">
            <el-input type="textarea" v-model="formData.agentReason" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="agentFiles" :label="$t('workflow.label.agentFile')">
            <template #label>
              <div>
                {{ $t('workflow.label.agentFile') }}
                <el-tooltip
                  content="请上传代理人同意代理的材料，例如微信截图、书面签字等"
                  placement="top"
                >
                  <i class="iconfont icon-help"></i>
                </el-tooltip>
              </div>
            </template>
            <el-upload
              :file-list="fileList"
              :action="ImageUpload.url"
              list-type="picture-card"
              :limit="uploadLimit"
              :multiple="true"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :before-upload="handleBeforeUpload"
            >
              <i class="iconfont icon-plus !text-4xl"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status!" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" :label="$t('label.remark')">
            <el-input
              v-model="formData.remark"
              :rows="2"
              type="textarea"
              :placeholder="$t('placeholder.remark')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
  <user-org-picker
    ref="userDeptPickerRef"
    type="user"
    title="选择人员"
    mode="form"
    @success="handleUserSuccess"
  />
  <el-dialog v-model="previewVisible" title="预览图片" :lock-scroll="false">
    <div class="image-preview">
      <img w-full :src="previewFile.url" :alt="previewFile.name" />
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { agentInfoApi, agentSaveApi } from '@/api/workflow/agent';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, UploadProps } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/stores/modules/user';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { ImageUpload } from '@/config/fileConfig';

  const { t } = useI18n();
  const userStore = useUserStore();

  const emits = defineEmits(['refresh']);

  /** 是否显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 注册组件 */
  const formDataRef = ref();
  const userDeptPickerRef = ref();
  /** 选人类型 */
  const selectType = ref<'agent' | 'delegator' | ''>('');
  /** 上传限制数量 */
  const uploadLimit = ref(3);
  /** 文件列表 */
  const fileList = ref<WorkForm.FileModel[]>([]);
  /** 显示预览 */
  const previewVisible = ref<boolean>(false);
  /** 预览图片url */
  const previewFile = ref<WorkForm.FileModel>({
    name: '',
    url: '',
  });
  /** 表单内容 */
  const formData = reactive<Agent.AgentInfo>({
    id: '',
    delegatorId: '',
    agentId: '',
    startTime: '',
    endTime: '',
    agentType: '',
    agentReason: '',
    agentFiles: [],
    status: '',
    remark: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      delegatorId: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      agentId: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      agentType: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      startTime: [
        { required: formData.agentType != '1', message: t('common.required'), trigger: 'blur' },
      ],
      endTime: [
        { required: formData.agentType != '1', message: t('common.required'), trigger: 'blur' },
      ],
      agentReason: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      agentFiles: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      status: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });

  /**
   * @description: 选择人员
   * @param {string} type
   * @return {*}
   */
  const handleSelectUser = (type: 'agent' | 'delegator') => {
    selectType.value = type;
    userDeptPickerRef.value.init([]);
  };

  /**
   * @description: 选择人员成功
   * @param {User.UserInfo} users
   * @return {*}
   */
  const handleUserSuccess = (users: User.UserInfo[]) => {
    if (selectType.value == 'agent') {
      formData.agentId = users[0].id;
      formData.agentName = users[0].realName || users[0].nickName || users[0].username;
    } else {
      formData.delegatorId = users[0].id;
      formData.delegatorName = users[0].realName || users[0].nickName || users[0].username;
    }
  };

  /**
   * @description: 超过限制数量时的操作
   * @return {*}
   */
  const handleExceed = () => {
    // 判断图片数量
    ElMessage.error('上传图片数量不能超过' + uploadLimit.value + '个');
    return;
  };

  /**
   * @description: 文件上传成功后的操作
   * @return {*}
   */
  const handleSuccess: UploadProps['onSuccess'] = (_response) => {
    if (_response.code == ResultEnum.SUCCESS) {
      const url = _response.data.url;
      formData.agentFiles?.push(url);
    } else {
      ElMessage.error(_response.message);
    }
  };

  /**
   * @description: 删除图片
   * @return {*}
   */
  const handleRemove: UploadProps['onRemove'] = (file: any) => {
    if (formData.agentFiles) {
      let i = formData.agentFiles.findIndex((v) => v == file.url);
      formData.agentFiles.splice(i, 1);
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

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
    formData.id = '';
    formData.delegatorName = '';
    formData.agentName = '';
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      getInfo(key);
    } else {
      fileList.value = [];
      formData.delegatorId = userStore.userInfo.id;
      formData.delegatorName =
        userStore.userInfo.realName || userStore.userInfo.nickName || userStore.userInfo.username;
    }
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getInfo = (key: string) => {
    agentInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
      if (data.agentFiles) {
        fileList.value = data.agentFiles.map((v) => {
          return {
            name: '',
            url: v,
          };
        });
      }
    });
  };

  /**
   * @description: 保存
   * @return {*}
   */
  const submit = () => {
    formDataRef.value.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }
      agentSaveApi(formData).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              visible.value = false;
              emits('refresh');
            },
          });
        }
      });
    });
  };

  defineExpose({
    init,
  });
</script>
<style lang="scss" scoped>
  .image-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
