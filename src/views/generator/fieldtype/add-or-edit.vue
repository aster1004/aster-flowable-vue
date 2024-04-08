<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-04 12:17:24
 * @FilePath: \aster-admin\src\views\generator\fieldtype\add-or-edit.vue
 * @Description: 字段类型新增/编辑
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
          <el-form-item prop="columnType" :label="$t('label.generator.columnType')">
            <el-input
              v-model="formData.columnType"
              :placeholder="$t('placeholder.generator.columnType')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="attrType" :label="$t('label.generator.attrType')">
            <el-input
              v-model="formData.attrType"
              :placeholder="$t('placeholder.generator.attrType')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="packageName" :label="$t('label.generator.fieldPackage')">
            <el-input
              v-model="formData.packageName"
              :placeholder="$t('placeholder.generator.fieldPackage')"
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
  import { fieldTypeApi, fieldTypeSubmitApi } from '@/api/gen/index';
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
  const formData = reactive<Generator.FieldTypeInfo>({
    id: '',
    columnType: '',
    attrType: '',
    packageName: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {};
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
    fieldTypeApi(key).then(({ data }) => {
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

      fieldTypeSubmitApi(formData).then((res) => {
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
