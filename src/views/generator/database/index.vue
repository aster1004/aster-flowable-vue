<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-29 14:43:53
 * @FilePath: \aster-admin\src\views\generator\database\index.vue
 * @Description: 数据源管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.generator.connName')" prop="connName">
              <el-input
                v-model="queryParams.connName"
                :placeholder="$t('placeholder.generator.connName')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-select
              v-model="queryParams.dbType"
              clearable
              :placeholder="$t('placeholder.generator.dbType')"
            >
              <el-option value="" label="全部类型"></el-option>
              <el-option value="MySQL" label="MySQL"></el-option>
              <el-option value="Oracle" label="Oracle"></el-option>
              <el-option value="PostgreSQL" label="PostgreSQL"></el-option>
              <el-option value="SQLServer" label="SQLServer"></el-option>
              <el-option value="DM" label="达梦8"></el-option>
            </el-select>
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

    <!-- 表格 -->
    <div class="card table-main">
      <!-- 表格头部 操作按钮 -->
      <div class="table-header">
        <div class="header-button-lf">
          <el-button type="primary" @click="handleAdd">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
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
          prop="connName"
          :label="$t('label.generator.connName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="dbType"
          :label="$t('label.generator.dbType')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="connUrl"
          :label="$t('label.generator.connUrl')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="username"
          :label="$t('label.generator.username')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="password"
          :label="$t('label.generator.password')"
          header-align="center"
          align="center"
        />
        <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
          <template #default="scope">
            <el-button size="small" link type="primary" @click="handleTest(scope.row.id)">
              <i class="iconfont icon-ceshilianjie"></i>{{ $t('button.test') }}
            </el-button>
            <el-button size="small" link type="primary" @click="handleEdit(scope.row.id)">
              <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
            </el-button>
            <el-button size="small" link type="primary" @click="handleDelete(scope.row.id)">
              <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
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
    <add-or-edit ref="addOrEditRef" @refresh="handleQuery" />
  </div>
</template>
<script setup lang="ts">
  import { dataSourcePageApi, dataSourceDeleteApi, dataSourceTestApi } from '@/api/gen/index';
  import AddOrEdit from './add-or-edit.vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  /** 注册组件 */
  const queryForm = ref();
  const addOrEditRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Generator.DatasourceParams>({
    connName: '',
    dbType: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<Generator.DatasourceInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<Generator.DatasourceInfo[]>();
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
    dataSourcePageApi(queryParams).then(({ data }) => {
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
   * @description: 新增
   * @return {*}
   */
  const handleAdd = () => {
    addOrEditRef.value.init();
  };

  /**
   * @description: 修改
   * @param {string} key
   * @return {*}
   */
  const handleEdit = (key: string) => {
    addOrEditRef.value.init(key);
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
        dataSourceDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * 测试连接
   * @param id 数据源id
   */
  const handleTest = (id: string) => {
    dataSourceTestApi(id).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        ElMessage.success(res.data);
        handleQuery();
      }
    });
  };
</script>
<style lang="scss" scoped></style>
