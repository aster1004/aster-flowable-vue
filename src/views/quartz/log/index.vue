<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-07 15:50:25
 * @FilePath: \aster-admin\src\views\quartz\log\index.vue
 * @Description: 日志列表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.quartz.jobId')" prop="jobId">
              <el-input
                v-model="queryParams.jobId"
                :placeholder="$t('placeholder.quartz.jobId')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.quartz.jobName')" prop="jobName">
              <el-input
                v-model="queryParams.jobName"
                :placeholder="$t('placeholder.quartz.jobName')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="$t('label.quartz.jobGroup')" prop="jobGroup">
              <dict-select
                v-model="queryParams.jobGroup"
                dict-type="schedule_group"
                clearable
                :placeholder="$t('placeholder.quartz.jobGroup')"
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
          <el-button type="danger" v-hasPerm="['quartz:log:delete']" @click="handleDelete()">
            <i class="iconfont icon-shanchu pr-5px"></i>{{ $t('button.delete') }}
          </el-button>
          <el-button type="info" v-hasPerm="['quartz:log:clear']" @click="handleClear()">
            <i class="iconfont icon-shanchu pr-5px"></i>{{ $t('button.clear') }}
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
        <el-table-column prop="id" label="id" header-align="center" align="center" />
        <el-table-column
          prop="jobName"
          :label="$t('label.quartz.jobName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="jobGroup"
          :label="$t('label.quartz.jobGroup')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="schedule_group" :value="scope.row.jobGroup" />
          </template>
        </el-table-column>
        <el-table-column
          prop="invokeTarget"
          :label="$t('label.quartz.jobGroup')"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="jobMessage"
          :label="$t('label.quartz.jobMessage')"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />

        <el-table-column
          prop="status"
          :label="$t('label.status')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('label.createTime')"
          header-align="center"
          align="center"
          width="180"
        />
        <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handleInfo(scope.row)"
              v-hasPerm="['quartz:log:info']"
            >
              <i class="iconfont icon-xiangqing"></i>{{ $t('button.detail') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleDelete(scope.row.id)"
              v-hasPerm="['quartz:log:delete']"
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
    <log-detail ref="detailRef" />
  </div>
</template>
<script setup lang="ts">
  import { logPageApi, logDeleteApi, logClearApi } from '@/api/quartz/job';
  import { onMounted, reactive, ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { ResultEnum } from '@/enums/httpEnum';
  import LogDetail from './detail.vue';
  import { useRoute } from 'vue-router';

  const { t } = useI18n();
  const route = useRoute();

  /** 加载中 */
  const loading = ref(true);
  /** 注册组件 */
  const queryForm = ref();
  const detailRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  const searchCollapsed = ref(true);
  /** 数据列表 */
  const dataList = ref<Quartz.LogInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<Quartz.LogInfo[]>();
  /** 查询条件 */
  const queryParams = reactive<Quartz.LogParams>({
    jobId: '',
    jobName: '',
    jobGroup: '',
    pageNum: 1,
    pageSize: 10,
  });

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    logPageApi(queryParams).then(({ data }) => {
      dataList.value = data.list;
      total.value = data.total;
      loading.value = false;
    });
  };

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
   * @description: 选择列
   * @param {*} val
   * @return {*}
   */
  const handleSelectionChange = (val: Quartz.LogInfo[]) => {
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
   * @description: 详情
   * @return {*}
   */
  const handleInfo = (row: Quartz.LogInfo) => {
    detailRef.value.init(row);
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
        logDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * 清空
   */
  const handleClear = () => {
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        logClearApi().then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  onMounted(() => {
    queryParams.jobId = route.query.jobId as string;
    handleQuery();
  });
</script>
<style lang="scss" scoped></style>
