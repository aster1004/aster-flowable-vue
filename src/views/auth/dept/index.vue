<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 15:14:06
 * @FilePath: \aster-flowable-vue\src\views\auth\dept\index.vue
 * @Description: 部门管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.dept.orgName')" prop="orgName">
              <el-input
                v-model="queryParams.orgName"
                :placeholder="$t('placeholder.dept.orgName')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.status')" prop="status">
              <dict-select
                v-model="queryParams.status"
                dict-type="status"
                clearable
                :placeholder="$t('placeholder.status')"
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
          <el-button type="primary" v-hasPerm="['sys:org:add']" @click="handleAdd()">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
          <el-button type="danger" v-hasPerm="['sys:org:delete']" @click="handleDelete()">
            <i class="iconfont icon-shanchu pr-5px"></i>{{ $t('button.delete') }}
          </el-button>
        </div>
        <div v-if="toolButton" class="header-button-ri">
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
        v-if="refreshTable"
        v-loading="loading"
        :data="dataList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50" />
        <el-table-column
          prop="orgName"
          :label="$t('label.dept.orgName')"
          :show-overflow-tooltip="true"
          header-align="center"
          width="160"
        />
        <el-table-column
          prop="sort"
          :label="$t('label.sort')"
          header-align="center"
          align="center"
          width="60"
        />
        <el-table-column
          prop="status"
          :label="$t('label.status')"
          header-align="center"
          align="center"
          width="80"
        >
          <template #default="scope">
            <dict-tag dict-type="status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('label.createTime')"
          header-align="center"
          align="center"
          prop="createTime"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('label.operate')"
          header-align="center"
          align="center"
          class-name="operation"
        >
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handleEdit(scope.row)"
              v-hasPerm="['sys:org:edit']"
              ><i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}</el-button
            >
            <el-button
              size="small"
              link
              type="primary"
              @click="handleAdd(scope.row)"
              v-hasPerm="['sys:org:add']"
              ><i class="iconfont icon-xinzeng"></i>{{ $t('button.add') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleDelete(scope.row.id)"
              v-hasPerm="['sys:org:delete']"
              ><i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-or-edit ref="addOrEditRef" @refresh="handleQuery" />
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { deptListApi, deptDeleteApi } from '@/api/sys/dept';
  import { parseTime } from '@/utils';
  import AddOrEdit from './add-or-edit.vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';
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
  const queryParams = reactive<Dept.DeptParams>({
    orgName: '',
    status: '',
  });
  /** 列表 */
  const dataList = ref<Dept.DeptInfo[]>();
  /** 重新渲染表格状态 */
  const refreshTable = ref(true);
  const loading = ref(true);
  /** 是否展开，默认全部折叠 */
  const isExpandAll = ref(false);
  /** 是否显示功能菜单 */
  const toolButton = ref(true);
  /** 已选择行 */
  const selectedList = ref<Dept.DeptInfo[]>();

  onMounted(() => {
    handleQuery();
  });

  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = () => {
    queryForm.value.resetFields();
    handleQuery();
  };

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    deptListApi(queryParams).then(({ data }) => {
      dataList.value = data;
      loading.value = false;
    });
  };

  /**
   * @description: 修改
   * @return {*}
   */
  const handleEdit = (row: Dept.DeptInfo) => {
    addOrEditRef.value.init('edit', row);
  };

  /**
   * @description: 添加
   * @return {*}
   */
  const handleAdd = (row?: Dept.DeptInfo) => {
    addOrEditRef.value.init('add', row ? row : null);
  };

  /**
   * @description: 删除
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
        deptDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 选择列
   * @param {*} val
   * @return {*}
   */
  const handleSelectionChange = (val: Dept.DeptInfo[]) => {
    selectedList.value = val;
  };
</script>
<style lang="scss" scoped>
  :deep(.operation .cell) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
  }
  :deep(.operation .el-button--small) {
    padding: 5px;

    i {
      font-size: 12px;
    }
  }
</style>
