<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-26 09:44:19
 * @FilePath: \aster-admin\src\views\system\dict\data.vue
 * @Description: 字典数据
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" v-hasPerm="['sys:dict:add']" @click="handleAddOrEdit()">
          <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="dataTableRef"
      :data="dataList"
      :border="true"
      row-key="id"
      :default-sort="{ prop: 'sort', order: 'descending' }"
    >
      <el-table-column
        prop="dictValue"
        :label="$t('label.dict.dictValue')"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="dictLabel"
        :label="$t('label.dict.dictLabel')"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.labelClass"
            :type="scope.row.labelClass === 'primary' ? '' : scope.row.labelClass"
          >
            {{ scope.row.dictLabel }}
          </el-tag>
          <span v-else>
            {{ scope.row.dictLabel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        :label="$t('label.sort')"
        sortable
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="createTime"
        :label="$t('label.createTime')"
        header-align="center"
        align="center"
        width="180"
      />
      <el-table-column
        :label="$t('label.operate')"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            v-hasPerm="['sys:dict:edit']"
            @click="handleAddOrEdit(scope.row.id)"
          >
            <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
          </el-button>
          <el-button
            type="primary"
            link
            v-hasPerm="['sys:dict:delete']"
            @click="handleDelete(scope.row.id)"
          >
            <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      :page-sizes="[10, 25, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增 / 修改 -->
    <add-or-edit ref="addOrEditRef" @refresh="handleQuery" />
  </el-card>
</template>

<script setup lang="ts">
  import { dictDataDeleteApi, dictDataPageApi } from '@/api/sys/dict';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { onMounted, reactive, ref } from 'vue';
  import AddOrEdit from './data-add-or-edit.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps({
    dictTypeId: {
      type: String,
      required: true,
    },
  });

  const dataList = ref<Dict.DictData[]>();
  const total = ref<number>(0);
  const loading = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Dict.DictDataParams>({
    dictTypeId: props.dictTypeId,
    pageNum: 1,
    pageSize: 10,
  });
  const addOrEditRef = ref();

  onMounted(() => {
    handleQuery();
  });

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    dictDataPageApi(queryParams).then(({ data }) => {
      dataList.value = data.list;
      total.value = data.total;
      loading.value = false;
    });
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
   * @description: 新增/编辑
   * @return {*}
   */
  const handleAddOrEdit = (key?: string) => {
    addOrEditRef.value.init(props.dictTypeId, key);
  };

  /**
   * @description: 删除
   * @param {string} key
   * @return {*}
   */
  const handleDelete = (key: string) => {
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        dictDataDeleteApi(key).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };
</script>
