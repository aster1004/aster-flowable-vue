<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :lock-scroll="false"
    @close="close"
    width="60%"
    draggable
  >
    <el-form ref="formDataRef" :model="formData" :rules="formRules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="title" :label="$t('label.notice.title')">
            <el-input v-model="formData.title" :placeholder="$t('placeholder.notice.title')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="type" :label="$t('label.notice.type')">
            <dict-select
              v-model="formData.type"
              dict-type="notice_type"
              clearable
              :placeholder="$t('placeholder.notice.type')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="content" :label="$t('label.notice.content')">
            <WangEditor v-model:value="formData.content" height="300px" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" :label="$t('label.remark')">
            <el-input type="textarea" v-model="formData.remark" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="close">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { noticeInfoApi, noticeSaveApi } from '@/api/sys/notice';
  import WangEditor from '@/components/wangEditor/index.vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emits = defineEmits(['refresh', 'close']);

  /** 是否显示 */
  const visible = ref(true);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 注册组件 */
  const formDataRef = ref();
  /** 表单内容 */
  const formData = reactive<Notice.NoticeInfo>({
    id: '',
    title: '',
    type: '',
    content: '',
    status: '',
    remark: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      title: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      type: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });

  /** 初始化 */
  const init = async (key?: string) => {
    formData.id = '';
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      getInfo(key);
    }
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getInfo = (key: string) => {
    noticeInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
    });
  };

  /**
   * 关闭弹窗
   */
  const close = () => {
    emits('close');
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

      noticeSaveApi(formData).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
            onClose: () => {
              emits('close');
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
<style lang="scss" scoped></style>
