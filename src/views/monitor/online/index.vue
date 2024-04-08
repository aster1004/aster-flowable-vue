<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-02-01 17:20:22
 * @FilePath: \aster-flowable-vue\src\views\monitor\online\index.vue
 * @Description: 在线用户
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 表格 -->
    <div class="card table-main">
      <el-table ref="tableRef" :data="dataList" :border="true" row-key="tokenId">
        <el-table-column
          prop="tokenId"
          :label="$t('label.online.tokenId')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="username"
          :label="$t('label.online.username')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="gender"
          :label="$t('label.online.gender')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="gender" :value="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          :label="$t('label.online.mobile')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="email"
          :label="$t('label.online.email')"
          header-align="center"
          align="center"
        />
        <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handleForce(scope.row.tokenId)"
              v-hasPerm="['monitor:online:force']"
            >
              <i class="iconfont icon-shanchu"></i>{{ $t('button.force') }}
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
  </div>
</template>
<script setup lang="ts">
  import { onlineForceApi, onlinePageApi } from '@/api/monitor/online';
  import { ResultEnum } from '@/enums/httpEnum';
  import { UserOnline } from '@/types/monitor';
  import { isEmpty } from '@/utils';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  /** 查询条件 */
  const queryParams = reactive<Page.ReqPage>({
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<UserOnline[]>();
  /** 总数 */
  const total = ref<number>(0);
  const loading = ref(true);

  const handleQuery = () => {
    loading.value = true;
    onlinePageApi(queryParams).then(({ data }) => {
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
   * @description: 强退
   * @param {string} key
   * @return {*}
   */
  const handleForce = (tokenId: string) => {
    if (isEmpty(tokenId)) {
      ElMessage.warning(t('label.online.empty'));
      return;
    }

    ElMessageBox.confirm(t('label.online.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        onlineForceApi(tokenId).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('common.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  onMounted(() => {
    handleQuery();
  });
</script>
<style scoped lang="scss">
  page {
    padding: 0 20rpx;
  }
</style>
