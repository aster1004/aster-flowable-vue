<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-29 10:59:51
 * @FilePath: \aster-flowable-vue\src\views\generator\code\edit.vue
 * @Description: 生成配置
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-drawer v-model="visible" title="编辑" :size="1200" :with-header="false" :lock-scroll="false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="属性设置" name="field">
        <vxe-table
          ref="fieldTable"
          border
          :row-config="{ useKey: true }"
          class="sortable-row-gen"
          :data="fieldList"
          :checkbox-config="{ checkStrictly: true }"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column width="60" title="拖动">
            <template #default>
              <span class="drag-btn">
                <i class="vxe-icon-sort"></i>
              </span>
            </template>
            <template #header>
              <el-tooltip
                class="item"
                effect="dark"
                content="按住后可以上下拖动排序"
                placement="top-start"
              >
                <i class="vxe-icon-question-circle-fill"></i>
              </el-tooltip>
            </template>
          </vxe-column>
          <vxe-column field="fieldName" title="字段名"></vxe-column>
          <vxe-column
            field="fieldComment"
            title="说明"
            :edit-render="{ name: 'input' }"
          ></vxe-column>
          <vxe-column field="fieldType" title="字段类型"></vxe-column>
          <vxe-column field="attrName" title="属性名" :edit-render="{ name: 'input' }"></vxe-column>
          <vxe-column field="attrType" title="属性类型">
            <template #default="{ row }">
              <el-select v-model="row.attrType">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="autoFill" title="自动填充">
            <template #default="{ row }">
              <el-select v-model="row.autoFill">
                <el-option
                  v-for="item in fillList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="primaryPk" title="主键">
            <template #default="{ row }">
              <el-checkbox v-model="row.primaryPk"></el-checkbox>
            </template>
          </vxe-column>
        </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="表单配置" name="form">
        <vxe-table
          ref="formTable"
          border
          :row-config="{ useKey: true }"
          :data="fieldList"
          :checkbox-config="{ checkStrictly: true }"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="attrName" title="属性名"></vxe-column>
          <vxe-column field="fieldComment" title="说明"></vxe-column>
          <vxe-column field="formItem" title="表单显示">
            <template #default="{ row }">
              <el-checkbox v-model="row.formItem"></el-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="formRequired" title="表单必填">
            <template #default="{ row }">
              <el-checkbox v-model="row.formRequired"></el-checkbox>
            </template>
          </vxe-column>
          <vxe-column
            field="formValidator"
            title="表单效验"
            :edit-render="{ name: 'input' }"
          ></vxe-column>
          <vxe-column field="formType" title="表单类型">
            <template #default="{ row }">
              <el-select v-model="row.formType">
                <el-option
                  v-for="item in formTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </vxe-column>
          <vxe-column
            field="formDict"
            title="表单字典类型"
            :edit-render="{ name: 'input' }"
          ></vxe-column>
        </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="列表配置" name="grid">
        <vxe-table
          ref="gridTable"
          border
          :row-config="{ useKey: true }"
          :data="fieldList"
          :checkbox-config="{ checkStrictly: true }"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="attrName" title="属性名"></vxe-column>
          <vxe-column field="fieldComment" title="说明"></vxe-column>
          <vxe-column field="gridItem" title="列表显示">
            <template #default="{ row }">
              <el-checkbox v-model="row.gridItem"></el-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="gridSort" title="列表排序">
            <template #default="{ row }">
              <el-checkbox v-model="row.gridSort"></el-checkbox>
            </template>
          </vxe-column>
        </vxe-table>
      </el-tab-pane>
      <el-tab-pane label="查询配置" name="query">
        <vxe-table
          ref="queryTable"
          border
          :row-config="{ useKey: true }"
          :data="fieldList"
          :checkbox-config="{ checkStrictly: true }"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
        >
          <vxe-column field="attrName" title="属性名"></vxe-column>
          <vxe-column field="fieldComment" title="说明"></vxe-column>
          <vxe-column field="queryItem" title="查询显示">
            <template #default="{ row }">
              <el-checkbox v-model="row.queryItem"></el-checkbox>
            </template>
          </vxe-column>
          <vxe-column field="queryType" title="查询方式">
            <template #default="{ row }">
              <el-select v-model="row.queryType">
                <el-option
                  v-for="item in queryList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="queryFormType" title="查询表单类型">
            <template #default="{ row }">
              <el-select v-model="row.queryFormType">
                <el-option
                  v-for="item in formTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </template>
          </vxe-column>
        </vxe-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
  import { nextTick, reactive, ref } from 'vue';
  import { ElMessage, TabsPaneContext } from 'element-plus/es';
  import Sortable from 'sortablejs';
  import { tableApi, tableFieldSubmitApi, fieldTypeListApi } from '@/api/gen/index';
  import { VxeTableInstance } from 'vxe-table';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const activeName = ref();
  const fieldTable = ref<VxeTableInstance>();
  const formTable = ref<VxeTableInstance>();
  const gridTable = ref<VxeTableInstance>();
  const queryTable = ref<VxeTableInstance>();

  const handleClick = (tab: TabsPaneContext) => {
    if (tab.paneName !== 'field') {
      formTable.value?.loadData(fieldList.value);
      gridTable.value?.loadData(fieldList.value);
      queryTable.value?.loadData(fieldList.value);
    }
  };

  const emit = defineEmits(['refreshDataList']);
  const visible = ref(false);
  const dataFormRef = ref();

  const sortable = ref() as any;

  const typeList = ref([]) as any;
  const tableId = ref();
  const fieldList = ref<Generator.TableFieldInfo[]>([]);
  const fillList = reactive([
    { label: 'DEFAULT', value: 'DEFAULT' },
    { label: 'INSERT', value: 'INSERT' },
    { label: 'UPDATE', value: 'UPDATE' },
    { label: 'INSERT_UPDATE', value: 'INSERT_UPDATE' },
  ]);

  const queryList = reactive([
    { label: '=', value: '=' },
    { label: '!=', value: '!=' },
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: 'like', value: 'like' },
    { label: 'left like', value: 'left like' },
    { label: 'right like', value: 'right like' },
  ]);

  const formTypeList = reactive([
    { label: '单行文本', value: 'text' },
    { label: '多行文本', value: 'textarea' },
    { label: '富文本编辑器', value: 'editor' },
    { label: '下拉框', value: 'select' },
    { label: '单选按钮', value: 'radio' },
    { label: '复选框', value: 'checkbox' },
    { label: '日期', value: 'date' },
    { label: '日期时间', value: 'datetime' },
  ]);

  const init = (id: string) => {
    visible.value = true;
    tableId.value = id;

    // 重置表单数据
    if (dataFormRef.value) {
      dataFormRef.value.resetFields();
    }

    activeName.value = 'field';

    rowDrop();
    getTable(id);
    getFieldTypeList();
  };

  const rowDrop = () => {
    nextTick(() => {
      const el: any = window.document.querySelector('.body--wrapper>.vxe-table--body tbody');
      sortable.value = Sortable.create(el, {
        handle: '.drag-btn',
        onEnd: (e: any) => {
          const { newIndex, oldIndex } = e;
          const currRow = fieldList.value.splice(oldIndex, 1)[0];
          fieldList.value.splice(newIndex, 0, currRow);
        },
      });
    });
  };

  const getTable = (id: string) => {
    tableApi(id).then((res) => {
      fieldList.value = res.data.fieldList ? res.data.fieldList : [];
    });
  };

  const getFieldTypeList = async () => {
    typeList.value = [];

    // 获取数据
    const { data } = await fieldTypeListApi();
    // 设置属性类型值
    data.forEach((item: any) => typeList.value.push({ label: item, value: item }));
    // 增加Object类型
    typeList.value.push({ label: 'Object', value: 'Object' });
  };

  // 表单提交
  const submitHandle = () => {
    tableFieldSubmitApi(tableId.value, fieldList.value).then(() => {
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

<style lang="scss">
  .sortable-row-gen .drag-btn {
    cursor: move;
    font-size: 12px;
  }

  .sortable-row-gen .vxe-body--row.sortable-ghost,
  .sortable-row-gen .vxe-body--row.sortable-chosen {
    background-color: #dfecfb;
  }
</style>
