<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-22 15:18:00
 * @FilePath: \aster-flowable-vue\src\views\workflow\list\list-association.vue
 * @Description: 关联列表table
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box" v-show="visible">
    <!-- 查询条件 -->
    <div class="card table-search" v-show="showSearch">
      <el-form
        ref="listQueryFormRef"
        :model="queryParams.customParams"
        :inline="false"
        :label-position="_formInfo.labelPosition"
        :label-width="_formInfo.labelWidth"
      >
        <div class="grid-box">
          <div
            class="grid-column"
            v-for="(item, index) in _listSettings.queryItems"
            :key="index"
            v-show="index < 2 || !searchCollapsed"
          >
            <form-design-render
              v-model:value="queryParams.customParams[item.id]"
              :ref="item.id"
              mode="search"
              :formData="queryParams.customParams"
              :formItem="item"
            />
          </div>
          <div class="grid-operation">
            <el-form-item>
              <div class="search-operation">
                <el-button type="primary" @click="handleQuery">
                  <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.search') }}
                </el-button>
                <el-button @click="resetQuery">
                  <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.reset') }}
                </el-button>
                <el-button type="primary" link @click="searchCollapsed = !searchCollapsed">
                  {{ searchCollapsed ? $t('button.expand') : $t('button.merge') }}
                  <i
                    :class="searchCollapsed ? 'iconfont icon-xiangxia' : 'iconfont icon-xiangshang'"
                  ></i>
                </el-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 列表字段 -->
    <div class="card table-main">
      <!-- 表格头部 操作按钮 -->
      <div class="table-header">
        <div class="header-button-lf">
          <el-button type="primary" @click="handleAdd">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
        </div>
        <div class="header-button-ri">
          <el-tooltip
            v-for="(item, index) in _actions"
            :key="index"
            :content="item.title"
            effect="dark"
            placement="top"
          >
            <el-button
              v-if="item.click != 'handleShowColumns'"
              circle
              @click="handleClick(item.click)"
            >
              <i :class="item.icon"></i>
            </el-button>
            <el-button
              v-else
              ref="showColumnsRef"
              v-popover="popoverRef"
              circle
              v-click-outside="handleShowColumns"
            >
              <i :class="item.icon"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-table ref="listTableRef" :data="dataList" :border="true" row-key="id">
        <el-table-column fixed type="index" width="50" />
        <el-table-column
          prop="dataTitle"
          label="数据标题"
          fixed
          header-align="center"
          align="center"
          width="180"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-button class="flex" type="primary" link @click="handleDetail(scope.row)">
              <form-design-render
                v-for="(item, index) in _dataTitleFormItems"
                :key="index"
                :value="convertDataType(item, scope.row.dataTitle[index])"
                :form-data="{}"
                :form-item="item"
                :show-label="false"
                mode="table"
              />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          :prop="item.id"
          :label="item.title"
          header-align="center"
          align="center"
          width="180"
        >
          <template #default="scope">
            <div class="table-component">
              <span v-if="item.id == 'create_time'">
                {{ scope.row[item.id] }}
              </span>
              <form-design-render
                v-else
                :value="convertDataType(item, scope.row[item.id])"
                :form-data="{}"
                :form-item="item"
                :show-label="false"
                mode="table"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :background="true"
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 25, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增表单 -->
    <form-initiation ref="formInitiationRef" />

    <el-popover
      ref="popoverRef"
      trigger="click"
      placement="left-start"
      virtual-triggering
      persistent
      :width="240"
      :show-arrow="false"
    >
      <div class="popover-title" style="width: 100%">
        <span>列表字段</span>
        <div class="flex items-center justify-center">
          <span class="pr-10px">全选</span>
          <el-checkbox
            v-model="columnCheckAll"
            :indeterminate="columnIndeterminate"
            @change="handleColumnCheckAll"
          ></el-checkbox>
        </div>
      </div>
      <div class="popover-content">
        <el-checkbox-group
          v-model="columnCheckedIds"
          :style="{
            height: _listSettings.columns.length * 30 + 10 + 'px',
            overflow: 'auto',
          }"
          style="max-height: 500px"
          @change="handleColumnCheckChange"
        >
          <div class="popover-checkbox" v-for="(item, index) in _listSettings.columns" :key="index">
            <div class="popover-checkbox-title">
              {{ item.title }}
            </div>
            <div class="popover-checkbox-o">
              <el-checkbox :value="item.id" :label="item.id" />
            </div>
          </div>
        </el-checkbox-group>
      </div>
    </el-popover>

    <form-detail ref="formDetailRef" />
  </div>
</template>
<script setup lang="ts">
  import { computed, reactive, ref, unref } from 'vue';
  import FormDesignRender from '../form/form-design-render.vue';
  import FormInitiation from '../form/form-initiation.vue';
  import FormDetail from '../form/form-detail.vue';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { convertDataType, selectFormItemByFieldId } from '@/utils/workflow';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';
  import vClickOutside from 'element-plus/es/directives/click-outside/index';
  import { instancePageApi } from '@/api/workflow/instance';

  // 注册组件
  const formInitiationRef = ref();
  const listQueryFormRef = ref();
  const popoverRef = ref();
  const formDetailRef = ref();

  // 是否显示
  const visible = ref(false);
  // 表单编码
  const code = ref('');
  // 表单ID
  const formId = ref('');
  // 是否显示查询
  const showSearch = ref(false);
  // 是否合并查询
  const searchCollapsed = ref(true);
  // 是否只读
  const readonly = ref(false);
  // 表单信息
  const formInfo = ref<WorkForm.FormModel>({
    icon: 'iconfont icon-gengduo',
    iconColor: '',
    labelPosition: 'left',
    formName: '未命名表单',
    formItems: [],
    process: {},
    labelWidth: 80,
    listSettings: {
      queryItems: [],
      columns: [],
      sortBy: 'create_time',
      sortDirection: 'desc',
      actions: [],
    },
  });
  // 列表数据总数
  const total = ref(0);
  // 列表数据
  const dataList = ref<any[]>([]);
  // 查询条件
  const queryParams = reactive<Process.InstanceParams>({
    pageNum: 1,
    pageSize: 10,
    code: '',
    columns: [],
    customParams: {},
    customItems: [],
    associationParams: {
      associationCode: '',
      associationInstanceId: '',
    },
  });
  // 列表字段
  const tableColumns = ref<WorkComponent.ComponentConfig[]>([]);
  // 列表字段全选
  const columnCheckAll = ref(false);
  // 列表字段全选状态
  const columnIndeterminate = ref(false);
  // 已选中查询字段id
  const columnCheckedIds = ref<string[]>([]);

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = async () => {
    if (isNotEmpty(code.value) && !readonly.value) {
      queryParams.code = code.value;
      // 自定义查询配置
      if (_listSettings.value.queryItems.length > 0) {
        queryParams.customItems = _listSettings.value.queryItems;
      }
      // table列表字段
      if (_listSettings.value.columns.length > 0) {
        queryParams.columns = _listSettings.value.columns.map((c) => c.id);
      }
      await instancePageApi(queryParams).then((res) => {
        if (res.code === ResultEnum.SUCCESS) {
          dataList.value = res.data.list.map((item) => {
            if (_formInfo.value.dataTitle && _formInfo.value.dataTitle.length > 0) {
              let dataTitle: any[] = [];
              _formInfo.value.dataTitle.forEach((field) => {
                dataTitle.push(item[field]);
              });
              return { dataTitle, ...item };
            }
            return item;
          });
          total.value = res.data.total;
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  };

  /**
   * @description: 筛选
   * @return {*}
   */
  const handleShowQuery = () => {
    showSearch.value = !showSearch.value;
  };

  /**
   * @description: 导入
   * @return {*}
   */
  const handleImport = () => {
    //TODO 列表导入
    console.log('导入操作暂未开发(*^▽^*)');
  };

  /**
   * @description: 导出
   * @return {*}
   */
  const handleExport = () => {
    console.log('导出操作暂未开发(*^▽^*)');
  };

  /**
   * @description: 显示列
   * @return {*}
   */
  const handleShowColumns = () => {
    unref(popoverRef).popperRef?.delayHide?.();
  };

  /**
   * @description: 点击按钮
   * @param {string} funName 名称
   * @return {*}
   */
  const handleClick = (funName: string) => {
    if (funName === 'handleQuery') {
      handleQuery();
    } else if (funName === 'handleShowQuery') {
      handleShowQuery();
    } else if (funName === 'handleImport') {
      handleImport();
    } else if (funName === 'handleExport') {
      handleExport();
    } else if (funName === 'handleShowColumns') {
      handleShowColumns();
    }
  };

  /**
   * @description: 列表字段全选
   * @return {*}
   */
  const handleColumnCheckAll = (val: boolean) => {
    if (val) {
      // 避免queryItems的变动影响_formItem
      tableColumns.value = JSON.parse(JSON.stringify(_listSettings.value.columns));
      columnCheckedIds.value = tableColumns.value.map((item) => item.id);
    } else {
      tableColumns.value = [];
      columnCheckedIds.value = [];
    }
  };
  /**
   * @description: 列表字段选中操作
   * @param {*} value 已选中的列表字段id
   * @return {*}
   */
  const handleColumnCheckChange = (value: string[]) => {
    const checkedCount = value.length;
    columnCheckAll.value = checkedCount === _listSettings.value.columns.length;
    columnIndeterminate.value =
      checkedCount > 0 && checkedCount < _listSettings.value.columns.length;

    tableColumns.value = [];
    // 双重循环是为了保护已经排序的字段不受影响
    columnCheckedIds.value.forEach((id) => {
      _listSettings.value.columns.forEach((item) => {
        if (item.id == id) {
          tableColumns.value.push(item);
        }
      });
    });
  };

  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = async () => {
    listQueryFormRef.value.resetFields();
    queryParams.pageNum = 1;
    queryParams.code = '';
    queryParams.columns = [];
    queryParams.customItems = [];
    queryParams.customParams = {};

    await handleQuery();
  };

  /**
   * @description: 更改每页大小
   * @param {*} val
   * @return {*}
   */
  const handleSizeChange = (val: number) => {
    queryParams.pageNum = 1;
    queryParams.pageSize = val;
    handleQuery();
  };

  /**
   * @description: 更改页码
   * @param {*} val
   * @return {*}
   */
  const handleCurrentChange = (val: number) => {
    queryParams.pageNum = val;
    handleQuery();
  };

  /**
   * @description: 新增
   * @return {*}
   */
  const handleAdd = () => {
    if (isEmpty(code.value) || isEmpty(formId.value)) {
      ElMessage.warning('参数有误，请刷新后重试');
      return;
    }
    formInitiationRef.value.init(formId.value);
  };

  /**
   * @description: 详情
   * @param {*} row 行数据
   * @return {*}
   */
  const handleDetail = (row: any) => {
    const code = queryParams.code;
    const id = row.id;
    const procDefId = row.procDefId;
    formDetailRef.value.getInstanceInfo(id, code, procDefId);
  };

  // 列表设置内容
  const _listSettings = computed(() => {
    return formInfo.value.listSettings;
  });

  // 功能按钮
  const _actions = computed(() => {
    if (_listSettings.value.actions && _listSettings.value.actions.length > 0) {
      return _listSettings.value.actions;
    }
    return [];
  });

  // 表单基础信息
  const _formInfo = computed(() => {
    return {
      labelPosition: formInfo.value.labelPosition,
      labelWidth: formInfo.value.labelWidth,
      dataTitle: formInfo.value.dataTitle,
      formItems: formInfo.value.formItems,
    };
  });

  /**
   * @description: 表单标题表单项
   */
  const _dataTitleFormItems = computed(() => {
    let arr: WorkComponent.ComponentConfig[] = [];
    if (_formInfo.value.dataTitle && _formInfo.value.dataTitle.length > 0) {
      _formInfo.value.dataTitle.forEach((fieldId) => {
        const item = selectFormItemByFieldId(fieldId, _formInfo.value.formItems);
        if (item != null) {
          arr.push(item);
        }
      });
    }
    return arr;
  });

  /**
   * @description: 根据code获取最新表单信息
   * @param {*} code 表单code
   * @return {*}
   */
  const loadFormInfoByCode = async (code: string) => {
    await formInfoByCodeApi(code).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        formInfo.value = res.data;
        if (res.data.id) {
          formId.value = res.data.id;
        }
        // 如果表单没有配置列表设置，则默认配置
        if (res.data.listSettings == null) {
          formInfo.value.listSettings = {
            queryItems: [],
            columns: [],
            sortBy: 'create_time',
            sortDirection: 'desc',
            actions: [],
          };
          tableColumns.value = [];
          columnCheckedIds.value = [];
        } else {
          if (formInfo.value.listSettings.columns.length > 0) {
            tableColumns.value = JSON.parse(JSON.stringify(formInfo.value.listSettings.columns));
            columnCheckedIds.value = tableColumns.value.map((item) => item.id);
          } else {
            tableColumns.value = [];
            columnCheckedIds.value = [];
          }
        }
        // 查询
        await resetQuery();
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 初始化
   * @param {string} formCode 表单编码
   * @param {string} associationCode 关联编码
   * @param {string} associationInstanceId 关联实例编号
   * @return {*}
   */
  const init = (formCode: string, associationCode: string, associationInstanceId: string) => {
    if (isEmpty(formCode) || isEmpty(associationInstanceId) || isEmpty(associationCode)) {
      ElMessage.error('参数错误');
      return;
    }
    // 关联参数
    queryParams.associationParams = {
      associationCode: associationCode,
      associationInstanceId: associationInstanceId,
    };
    // 表单编码
    code.value = formCode;
    // 默认不显示查询条件并折叠
    showSearch.value = false;
    searchCollapsed.value = true;
    // 是否只读
    readonly.value = false;
    // 根据code获取表单信息
    loadFormInfoByCode(formCode);
    visible.value = true;
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  ::v-deep(.el-table .cell) {
    .el-form-item {
      margin-bottom: 0 !important;
    }
    .el-form-item--default {
      margin-bottom: 0 !important;
    }
  }

  ::v-deep(.table-component) {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form-item {
      margin-bottom: 0 !important;
      .el-form-item__label {
        height: 0px !important;
        line-height: 0 !important;
      }
    }
    .el-form-item--default {
      margin-bottom: 0 !important;
      .el-form-item__label {
        height: 0px !important;
        line-height: 0 !important;
      }
    }
  }

  .popover-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: var(--el-color-primary);
  }

  .popover-content {
    .popover-checkbox {
      height: 30px;
      line-height: 30px;
      display: flex;
      cursor: pointer;
      padding-left: 10px;
      box-sizing: border-box;
      border-radius: 2px;
    }

    .popover-checkbox-title {
      flex: 1;
      color: #303133;
      text-align: left;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-wrap: break-word;
    }

    .popover-checkbox-o {
      width: 30px;
      text-align: center;
    }

    .popover-checkbox:hover {
      background-color: var(--el-color-primary);
    }

    .popover-checkbox:hover .popover-checkbox-title {
      color: #ffffff;
    }

    ::v-deep(.el-checkbox__label) {
      display: none;
    }
  }
</style>
