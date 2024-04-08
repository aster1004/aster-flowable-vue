<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-24 18:11:43
 * @FilePath: \aster-admin\src\views\system\dict\index.vue
 * @Description: 数据字典
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.dict.dictType')" prop="dictType">
              <el-input
                v-model="queryParams.dictType"
                :placeholder="$t('placeholder.dict.dictType')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.dict.dictName')" prop="dictName">
              <el-input
                v-model="queryParams.dictName"
                :placeholder="$t('placeholder.dict.dictName')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="$t('label.dict.status')" prop="status">
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
          <el-button type="primary" v-hasPerm="['sys:dict:add']" @click="handleAdd">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
          <el-button type="danger" v-hasPerm="['sys:dict:delete']" @click="handleDelete()">
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
          prop="dictType"
          :label="$t('label.dict.dictType')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="dictName"
          :label="$t('label.dict.dictName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="status"
          width="100"
          :label="$t('label.dict.status')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :label="$t('label.remark')"
          show-overflow-tooltip
          header-align="center"
          align="center"
        />
        <el-table-column
          :label="$t('label.operate')"
          width="250"
          align="center"
          class-name="operation"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === '0'"
              size="small"
              link
              type="primary"
              @click="handleDictData(scope.row)"
            >
              <i class="iconfont icon-xinzeng"></i>{{ $t('button.configDict') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleEdit(scope.row.id)"
              v-hasPerm="['sys:dict:edit']"
            >
              <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleDelete(scope.row.id)"
              v-hasPerm="['sys:dict:delete']"
            >
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
    <type-add-or-edit ref="typeAddOrEditRef" @refresh="handleQuery" />
    <!-- 字典配置 -->
    <el-drawer
      v-if="dictDataVisible"
      v-model="dictDataVisible"
      :title="dictDataTitle"
      :size="800"
      :close-on-press-escape="false"
    >
      <dict-data :dict-type-id="dictTypeId" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { dictTypePageApi, dictTypeDeleteApi } from '@/api/sys/dict';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, reactive, onMounted } from 'vue';
  import TypeAddOrEdit from './type-add-or-edit.vue';
  import DictData from './data.vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const queryForm = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Dict.DictTypeParams>({
    dictType: '',
    dictName: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 字典类型列表 */
  const dataList = ref<Dict.DictType[]>();
  /** 字典总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<Dict.DictType[]>();
  const loading = ref(true);

  const typeAddOrEditRef = ref();
  /** 显示字典数据 */
  const dictDataVisible = ref(false);
  /** 字典modal标题 */
  const dictDataTitle = ref();
  const dictTypeId = ref();

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
    dictTypePageApi(queryParams).then(({ data }) => {
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
  const handleSelectionChange = (val: Dict.DictType[]) => {
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
    typeAddOrEditRef.value.init();
  };

  /**
   * @description: 修改
   * @param {string} key
   * @return {*}
   */
  const handleEdit = (key: string) => {
    typeAddOrEditRef.value.init(key);
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
        dictTypeDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 配置字典
   * @param {string} key
   * @return {*}
   */
  const handleDictData = (row: Dict.DictType) => {
    dictDataVisible.value = true;
    dictTypeId.value = row.id;
    dictDataTitle.value = t('label.dict.config') + ' - ' + row.dictType;
  };
</script>
<style lang="scss" scoped></style>
