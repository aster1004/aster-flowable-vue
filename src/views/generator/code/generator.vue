<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-29 11:33:05
 * @FilePath: \aster-admin\src\views\generator\code\generator.vue
 * @Description: 生成配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="$t('button.generatorCode')"
    :close-on-click-modal="false"
    draggable
    :lock-scroll="false"
  >
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.tableName')" prop="tableName">
            <el-input
              v-model="dataForm.tableName"
              disabled
              :placeholder="$t('placeholder.generator.tableName')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.tableComment')" prop="tableComment">
            <el-input
              v-model="dataForm.tableComment"
              :placeholder="$t('placeholder.generator.tableComment')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.className')" prop="className">
            <el-input
              v-model="dataForm.className"
              :placeholder="$t('placeholder.generator.className')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="baseclassId" :label="$t('label.generator.extend')">
            <el-select
              v-model="dataForm.baseClassId"
              :placeholder="$t('placeholder.generator.extend')"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="(item, index) in baseClassList"
                :key="index"
                :label="item.code"
                :value="item.id ? item.id : ''"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.moduleName')" prop="moduleName">
            <el-input
              v-model="dataForm.moduleName"
              :placeholder="$t('placeholder.generator.moduleName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.moduleSimple')" prop="moduleSimple">
            <el-input
              v-model="dataForm.moduleSimple"
              :placeholder="$t('placeholder.generator.moduleSimple')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.functionName')" prop="functionName">
            <el-input
              v-model="dataForm.functionName"
              :placeholder="$t('placeholder.generator.functionName')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.packageName')" prop="packageName">
            <el-input
              v-model="dataForm.packageName"
              :placeholder="$t('placeholder.generator.packageName')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.author')" prop="author">
            <el-input
              v-model="dataForm.author"
              :placeholder="$t('placeholder.generator.author')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.email')" prop="email">
            <el-input
              v-model="dataForm.email"
              :placeholder="$t('placeholder.generator.email')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.version')" prop="version">
            <el-input
              v-model="dataForm.version"
              :placeholder="$t('placeholder.generator.version')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('label.generator.formLayout')" prop="formLayout">
            <el-radio-group v-model="dataForm.formLayout">
              <el-radio :label="1">{{ $t('label.generator.oneCol') }}</el-radio>
              <el-radio :label="2">{{ $t('label.generator.twoCol') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('label.generator.generatorType')" prop="generatorType">
            <el-radio-group v-model="dataForm.generatorType">
              <el-radio :label="0">{{ $t('label.generator.zipPath') }}</el-radio>
              <el-radio :label="1">{{ $t('label.generator.customPath') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        v-if="dataForm.generatorType === 1"
        :label="$t('label.generator.backendPath')"
        prop="backendPath"
      >
        <el-input
          v-model="dataForm.backendPath"
          :placeholder="$t('placeholder.generator.backendPath')"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.generatorType === 1"
        :label="$t('label.generator.frontendPath')"
        prop="frontendPath"
      >
        <el-input
          v-model="dataForm.frontendPath"
          :placeholder="$t('placeholder.generator.frontendPath')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="submitHandle()">{{ $t('button.confirm') }}</el-button>
      <el-button type="danger" @click="generatorHandle()">
        {{ $t('button.generatorCode') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus/es';
  import {
    generatorApi,
    downloadApi,
    tableApi,
    tableSubmitApi,
    baseClassListApi,
  } from '@/api/gen/index';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emit = defineEmits(['refreshDataList']);

  const visible = ref(false);
  const dataFormRef = ref();
  const baseClassList = ref<Generator.BaseClassInfo[]>([]);
  const dataForm = reactive<Generator.TableInfo>({
    id: '',
    baseClassId: '',
    generatorType: 0,
    formLayout: 1,
    backendPath: '',
    frontendPath: '',
    packageName: '',
    email: '',
    author: '',
    version: '',
    moduleName: '',
    moduleSimple: '',
    functionName: '',
    className: '',
    tableComment: '',
    tableName: '',
  });

  const init = (id: string) => {
    visible.value = true;
    dataForm.id = '';

    // 重置表单数据
    if (dataFormRef.value) {
      dataFormRef.value.resetFields();
    }

    getBaseClassList();
    getTable(id);
  };

  const getBaseClassList = () => {
    baseClassListApi().then((res) => {
      baseClassList.value = res.data;
    });
  };

  const getTable = (id: string) => {
    tableApi(id).then((res) => {
      Object.assign(dataForm, res.data);
    });
  };

  const dataRules = ref({
    tableName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    tableComment: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    className: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    packageName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    author: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    moduleName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    functionName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    generatorType: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    formLayout: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    backendPath: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    frontendPath: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  });

  // 保存
  const submitHandle = () => {
    dataFormRef.value.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }

      tableSubmitApi(dataForm).then(() => {
        ElMessage.success({
          message: t('common.success'),
          duration: 500,
          onClose: () => {
            visible.value = false;
            emit('refreshDataList');
          },
        });
      });
    });
  };

  // 生成代码
  const generatorHandle = () => {
    dataFormRef.value.validate(async (valid: boolean) => {
      if (!valid) {
        return false;
      }
      const tableId = dataForm.id ? dataForm.id : '';
      // 先保存
      await tableSubmitApi(dataForm);

      // 生成代码，zip压缩包
      if (dataForm.generatorType === 0) {
        downloadApi([tableId]);
        visible.value = false;
        return;
      }

      // 生成代码，自定义路径
      generatorApi([tableId]).then(() => {
        ElMessage.success({
          message: t('common.success'),
          duration: 500,
          onClose: () => {
            visible.value = false;
            emit('refreshDataList');
          },
        });
      });
    });
  };

  defineExpose({
    init,
  });
</script>

<style lang="scss" scoped>
  .generator-code .el-dialog__body {
    padding: 15px 30px 0 20px;
  }
</style>
