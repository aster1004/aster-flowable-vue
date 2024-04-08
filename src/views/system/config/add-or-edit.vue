<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-01-30 11:29:42
 * @FilePath: \aster-flowable-vue\src\views\system\config\add-or-edit.vue
 * @Description: 系统配置新增/编辑
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
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
          <el-form-item prop="configName" :label="$t('label.config.configName')">
            <el-input
              v-model="formData.configName"
              :placeholder="$t('placeholder.config.configName')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="configKey" :label="$t('label.config.configKey')">
            <el-input
              v-model="formData.configKey"
              :placeholder="$t('placeholder.config.configKey')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="configValue" :label="$t('label.config.configValue')">
            <el-input
              v-model="formData.configValue"
              :placeholder="$t('placeholder.config.configValue')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="configType" :label="$t('label.config.configType')">
            <dict-radio v-model="formData.configType" dict-type="whether" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
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
  import { configInfoApi, configSaveApi } from '@/api/sys/config';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { useI18n } from 'vue-i18n';

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
  const formData = reactive<Config.ConfigInfo>({
    id: '',
    configName: '',
    configKey: '',
    configValue: '',
    configType: '0',
    status: '0',
    remark: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      configName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      configKey: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      configValue: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      configType: [{ required: true, message: t('common.required'), trigger: 'blur' }],
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
    configInfoApi(key).then(({ data }) => {
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

      configSaveApi(formData).then((res) => {
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
