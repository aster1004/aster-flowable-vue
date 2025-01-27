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
      label-width="100px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="name" :label="$t('workflow.label.appName')">
            <el-input v-model="formData.name" :placeholder="$t('workflow.label.appName')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="icon" :label="$t('workflow.label.appIcon')">
            <icon-select ref="iconSelectRef" v-model:icon="formData.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="iconColor" :label="$t('workflow.label.appIconColor')">
            <el-color-picker v-model="formData.iconColor" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('workflow.label.appIconView')">
            <i :class="formData.icon" :style="[iconStyle]" v-show="isNotEmpty(formData.icon)"></i>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="sort" :label="$t('label.sort')">
            <el-input-number
              v-model="formData.sort"
              controls-position="right"
              :min="0"
              :placeholder="$t('label.sort')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
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
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { appInfoApi, appSaveApi } from '@/api/workflow/app';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { useI18n } from 'vue-i18n';
  import IconSelect from '@/components/icon/icon-select.vue';

  const { t } = useI18n();

  const emits = defineEmits(['refresh']);

  /** 是否显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 注册组件 */
  const formDataRef = ref();
  /** 表单内容 */
  const formData = reactive<WorkApp.AppInfo>({
    id: '',
    name: '',
    icon: '',
    iconColor: '#409EFF',
    sort: 0,
    status: '0',
    remark: '',
  });

  const iconStyle = computed(() => {
    return {
      width: '35px',
      height: '35px',
      fontSize: '20px',
      color: '#ffffff',
      lineHeight: '35px',
      textAlign: 'center',
      borderRadius: '5px',
      background: formData.iconColor,
    };
  });

  const iconSelectRef = ref();

  /** 表单规则 */
  const formRules = computed(() => {
    return {
      name: [{ required: true, message: t('workflow.rule.appName'), trigger: 'blur' }],
      icon: [{ required: true, message: t('workflow.rule.appIcon'), trigger: 'blur' }],
      iconColor: [{ required: true, message: t('workflow.rule.appIconColor'), trigger: 'blur' }],
      sort: [{ required: true, message: t('workflow.rule.appSort'), trigger: 'blur' }],
      status: [{ required: true, message: t('workflow.rule.appStatus'), trigger: 'blur' }],
    };
  });

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
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
    appInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
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

      appSaveApi(formData).then((res) => {
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
<style lang="scss" scoped></style>
