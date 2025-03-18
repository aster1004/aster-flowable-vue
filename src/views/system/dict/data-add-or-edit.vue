<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 09:51:14
 * @FilePath: \aster-admin\src\views\system\dict\data-add-or-edit.vue
 * @Description: 字典数据新增/编辑
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
          <el-form-item prop="dictLabel" :label="$t('label.dict.dictLabel')">
            <el-input
              v-model="formData.dictLabel"
              :placeholder="$t('placeholder.dict.dictLabel')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="dictValue" :label="$t('label.dict.dictValue')">
            <el-input
              v-model="formData.dictValue"
              :placeholder="$t('placeholder.dict.dictValue')"
            />
          </el-form-item>
        </el-col>
        <el-form-item prop="labelClass" :label="$t('label.dict.labelClass')">
          <el-select v-model="formData.labelClass" style="min-width: 150px" clearable>
            <el-option
              v-for="item in tagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag style="width: 100%" :type="item.value">{{ item.label }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        <el-col :span="24">
          <el-form-item prop="sort" :label="$t('label.sort')">
            <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="status" :label="$t('label.status')">
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
  import { dictDataApi, dictDataSaveApi } from '@/api/sys/dict';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import type { EpPropMergeType } from 'element-plus/es/utils/vue/props/types';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { useAppStore } from '@/stores/modules/app';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const appStore = useAppStore();

  const emits = defineEmits(['refresh']);
  /** 是否显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  const formDataRef = ref();
  /** 表单内容 */
  const formData = reactive<Dict.DictData>({
    id: '',
    dictTypeId: '',
    dictLabel: '',
    dictValue: '',
    remark: '',
    sort: 0,
    status: '0',
    labelClass: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      dictLabel: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      dictValue: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });

  /** 标签样式 */
  interface TagModel {
    label: string;
    value: EpPropMergeType<
      StringConstructor,
      'primary' | 'success' | 'warning' | 'info' | 'danger',
      unknown
    >;
  }

  const tagList = ref<TagModel[]>([
    { value: 'primary', label: 'primary' },
    { value: 'success', label: 'success' },
    { value: 'info', label: 'info' },
    { value: 'warning', label: 'warning' },
    { value: 'danger', label: 'danger' },
  ]);

  /** 初始化 */
  const init = async (typeId: string, key?: string) => {
    visible.value = true;
    formData.id = '';
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    formData.dictTypeId = typeId;
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
    dictDataApi(key).then(({ data }) => {
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
      dictDataSaveApi(formData).then((res) => {
        if (res.code == ResultEnum.SUCCESS) {
          // 重新缓存字典
          appStore.setDictList();
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

  defineExpose({ init });
</script>
<style lang="scss" scoped></style>
