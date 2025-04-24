<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-18 17:04:28
 * @FilePath: \aster-flowable-vue\src\views\generator\code\index.vue
 * @Description: 代码生成
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.generator.tableName')" prop="tableName">
              <el-input
                v-model="queryParams.tableName"
                :placeholder="$t('placeholder.generator.tableName')"
                clearable
              />
            </el-form-item>
          </div>

          <div class="grid-operation">
            <el-form-item>
              <div class="search-operation">
                <el-button type="primary" @click="handleQuery">
                  <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.search') }}
                </el-button>
                <el-button type="primary" @click="importHandle()">
                  {{ $t('button.import') }}
                </el-button>
                <el-button type="success" @click="downloadBatchHandle()">
                  {{ $t('button.generatorCode') }}
                </el-button>
                <el-button @click="resetQuery">
                  <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.reset') }}
                </el-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="card table-main">
      <!-- 表格头部 操作按钮 -->
      <div class="table-header">
        <div class="header-button-lf">
          <el-button type="danger" @click="handleDelete()">
            <i class="iconfont icon-shanchu pr-5px"></i>{{ $t('button.delete') }}
          </el-button>
        </div>
        <div class="header-button-ri">
          <el-tooltip effect="dark" :content="$t('button.refresh')" placement="top">
            <el-button circle @click="handleQuery">
              <i class="iconfont icon-shuaxin"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="showSearch ? $t('button.hideSearch') : $t('button.showSearch')"
            placement="top"
          >
            <el-button circle @click="showSearch = !showSearch">
              <i class="iconfont icon-sousuo"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-table
        ref="tableRef"
        :data="dataList"
        :border="true"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50" />
        <el-table-column
          prop="tableName"
          :label="$t('label.generator.tableName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="tableComment"
          :label="$t('label.generator.tableComment')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="className"
          :label="$t('label.generator.className')"
          header-align="center"
          align="center"
        />
        <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="handleEdit(scope.row.id)">
              <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
            </el-button>
            <el-button size="small" link type="primary" @click="previewHandle(scope.row.id)">
              <i class="iconfont icon-bianji"></i>{{ $t('button.preview') }}
            </el-button>
            <el-button size="small" link type="primary" @click="generatorHandle(scope.row.id)">
              <i class="iconfont icon-bianji"></i>{{ $t('button.generatorCode') }}
            </el-button>
            <el-button size="small" link type="primary" @click="handleDelete(scope.row.id)">
              <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
            </el-button>
            <el-button size="small" link type="primary" @click="syncHandle(scope.row)">
              <i class="iconfont icon-shuaxin"></i>{{ $t('button.sync') }}
            </el-button>
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
    <!-- 新增/编辑 -->
    <edit ref="editRef" @refresh-data-list="handleQuery" />
    <import ref="importRef" @refresh-data-list="handleQuery" />
    <preview ref="previewRef" @refresh-data-list="handleQuery" />
    <generator ref="generatorRef" @refresh-data-list="handleQuery" />
  </div>
</template>
<script setup lang="ts">
  import { tablePageApi, tableDeleteApi, downloadApi, tableSyncApi } from '@/api/gen/index';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, reactive, onMounted } from 'vue';
  import Edit from './edit.vue';
  import Import from './import.vue';
  import Preview from './preview.vue';
  import Generator from './generator.vue';
  import { useI18n } from 'vue-i18n';
  import { isEmpty } from '@/utils';

  const { t } = useI18n();

  /** 注册组件 */
  const queryForm = ref();
  const editRef = ref();
  const importRef = ref();
  const previewRef = ref();
  const generatorRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Generator.GeneratorParams>({
    tableName: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<Generator.TableInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<Generator.TableInfo[]>();
  const loading = ref(true);

  onMounted(() => {
    handleQuery();
  });

  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = () => {
    queryForm.value.resetFields();
    queryParams.pageNum = 1;
    handleQuery();
  };

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    tablePageApi(queryParams).then(({ data }) => {
      dataList.value = data.list;
      total.value = data.total;
      loading.value = false;
    });
  };

  /**
   * @description: 选择列
   * @param {*} val
   * @return {*}
   */
  const handleSelectionChange = (val: Post.PostInfo[]) => {
    selectedList.value = val;
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
   * @description: 修改
   * @param {string} key
   * @return {*}
   */
  const handleEdit = (key: string) => {
    editRef.value.init(key);
  };

  /**
   * @description: 导入
   * @param {string} key
   * @return {*}
   */
  const importHandle = (key?: string) => {
    importRef.value.init(key);
  };

  // 预览
  const previewHandle = (tableId?: string) => {
    previewRef.value.init(tableId);
  };
  // 生成代码
  const generatorHandle = (id?: string) => {
    generatorRef.value.init(id);
  };
  // 生成代码
  const downloadBatchHandle = () => {
    const tableIds = selectedList.value?.map((item) => item.id);
    if (isEmpty(tableIds)) {
      ElMessage.warning(t('label.generator.genMessage'));
      return;
    }

    downloadApi(tableIds);
  };
  // 同步
  const syncHandle = (row: Generator.TableInfo) => {
    ElMessageBox.confirm(`${row.tableName}` + t('label.generator.syncMessage'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        if (!row.id) {
          ElMessage.warning(t('label.generator.tableIdEmpty'));
        } else {
          tableSyncApi(row.id).then(() => {
            ElMessage.success(t('common.success'));
          });
        }
      })
      .catch(() => {});
  };

  /**
   * @description: 删除
   * @param {string} key
   * @return {*}
   */
  const handleDelete = (key?: string) => {
    let val: any = [];
    if (key) {
      val.push(key);
    } else {
      val = selectedList.value?.map((item) => item.id);
      if (!val || val.length == 0) {
        ElMessage.warning(t('delete.empty'));
        return;
      }
    }
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        tableDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };
</script>
<style lang="scss" scoped></style>
