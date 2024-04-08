<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-25 17:28:42
 * @FilePath: \aster-admin\src\views\system\dict\type-add-or-edit.vue
 * @Description: 字典类型新增/编辑
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
          <el-form-item prop="dictType" :label="$t('label.dict.dictType')">
            <el-input v-model="formData.dictType" :placeholder="$t('placeholder.dict.dictType')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="dictName" :label="$t('label.dict.dictName')">
            <el-input v-model="formData.dictName" :placeholder="$t('placeholder.dict.dictName')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="sort" :label="$t('label.sort')">
            <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.dict.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" :label="$t('label.remark')">
            <el-input v-model="formData.remark" :placeholder="$t('placeholder.remark')" />
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
  import { dictTypeApi, dictTypeSaveApi } from '@/api/sys/dict';
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
  const formData = reactive<Dict.DictType>({
    id: '',
    dictType: '',
    dictName: '',
    remark: '',
    sort: 0,
    status: '0',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      dictType: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      dictName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
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
    dictTypeApi(key).then(({ data }) => {
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

      dictTypeSaveApi(formData).then((res) => {
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
