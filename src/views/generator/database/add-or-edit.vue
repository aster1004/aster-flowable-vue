<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-04 11:02:35
 * @FilePath: \aster-admin\src\views\generator\database\add-or-edit.vue
 * @Description: 数据源新增/编辑
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
      label-width="100px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="dbType" :label="$t('label.generator.dbType')">
            <el-select
              v-model="formData.dbType"
              clearable
              :placeholder="$t('placeholder.generator.dbType')"
              style="width: 100%"
            >
              <el-option value="MySQL" label="MySQL"></el-option>
              <el-option value="Oracle" label="Oracle"></el-option>
              <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
              <el-option value="SQLServer" label="SQLServer"></el-option>
              <el-option value="DM" label="达梦8"></el-option>
              <el-option value="KingBase" label="人大金仓"></el-option>
              <el-option value="Clickhouse" label="Clickhouse"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="connName" :label="$t('label.generator.connName')">
            <el-input
              v-model="formData.connName"
              :placeholder="$t('placeholder.generator.connName')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="connUrl" :label="$t('label.generator.connUrl')">
            <el-input
              v-model="formData.connUrl"
              :placeholder="$t('placeholder.generator.connUrl')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="username" :label="$t('label.generator.username')">
            <el-input
              v-model="formData.username"
              :placeholder="$t('placeholder.generator.username')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="password" :label="$t('label.generator.password')">
            <el-input
              v-model="formData.password"
              :placeholder="$t('placeholder.generator.password')"
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
  import { dataSourceInfoApi, dataSourceSubmitApi } from '@/api/gen/index';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
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
  const formData = reactive<Generator.DatasourceInfo>({
    id: '',
    dbType: '',
    connName: '',
    connUrl: '',
    username: '',
    password: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      dbType: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      connName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      connUrl: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      username: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      password: [{ required: true, message: t('common.required'), trigger: 'blur' }],
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
    dataSourceInfoApi(key).then(({ data }) => {
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

      dataSourceSubmitApi(formData).then((res) => {
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
