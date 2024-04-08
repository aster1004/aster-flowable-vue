<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-28 16:24:17
 * @FilePath: \aster-admin\src\views\generator\code\import.vue
 * @Description: 导入数据源表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="$t('label.generator.importTable')"
    :close-on-click-modal="false"
    draggable
    :lock-scroll="false"
  >
    <el-form ref="dataFormRef" :model="dataForm">
      <el-form-item :label="$t('label.generator.importDatasource')" prop="datasourceId">
        <el-select
          v-model="dataForm.datasourceId"
          style="width: 100%"
          :placeholder="$t('placeholder.generator.importDatasource')"
          @change="getTableList"
        >
          <el-option :label="$t('label.default')" value="0"></el-option>
          <el-option
            v-for="(ds, index) in dataForm.datasourceList"
            :key="index"
            :label="ds.connName"
            :value="ds.id ? ds.id : ''"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-table
        :data="dataForm.tableList"
        border
        style="width: 100%"
        :max-height="400"
        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="tableName"
          :label="$t('label.generator.tableName')"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="tableComment"
          :label="$t('label.generator.tableComment')"
          header-align="center"
          align="center"
        ></el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="submitHandle()">{{ $t('button.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus/es';
  import { dataSourceListApi, tableImportSubmitApi, dataSourceTableListApi } from '@/api/gen/index';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const emit = defineEmits(['refreshDataList']);

  const visible = ref(false);
  const dataFormRef = ref();

  const dataForm = reactive({
    id: '',
    tableNameListSelections: [] as any,
    datasourceId: '',
    datasourceList: [] as Generator.DatasourceInfo[],
    tableList: [] as any,
    table: {
      tableName: '',
    },
  });

  // 多选
  const selectionChangeHandle = (selections: any[]) => {
    dataForm.tableNameListSelections = selections.map((item: any) => item['tableName']);
  };

  const init = () => {
    visible.value = true;
    dataForm.id = '';

    // 重置表单数据
    if (dataFormRef.value) {
      dataFormRef.value.resetFields();
    }

    dataForm.tableList = [];

    getDataSourceList();
  };

  const getDataSourceList = () => {
    dataSourceListApi().then((res) => {
      dataForm.datasourceList = res.data;
    });
  };

  const getTableList = () => {
    dataForm.table.tableName = '';
    dataSourceTableListApi(dataForm.datasourceId).then((res) => {
      dataForm.tableList = res.data;
    });
  };

  // 表单提交
  const submitHandle = () => {
    const tableNameList = dataForm.tableNameListSelections ? dataForm.tableNameListSelections : [];
    if (tableNameList.length === 0) {
      ElMessage.warning(t('common.selectOne'));
      return;
    }

    tableImportSubmitApi(dataForm.datasourceId, tableNameList).then(() => {
      ElMessage.success({
        message: t('common.success'),
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit('refreshDataList');
        },
      });
    });
  };

  defineExpose({
    init,
  });
</script>
