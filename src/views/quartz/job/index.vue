<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-03-07 14:05:38
 * @FilePath: \aster-flowable-vue\src\views\quartz\job\index.vue
 * @Description: 任务调度页面
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.quartz.jobName')" prop="jobName">
              <el-input
                v-model="queryParams.jobName"
                :placeholder="$t('placeholder.quartz.jobName')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.quartz.jobGroup')" prop="jobGroup">
              <dict-select
                v-model="queryParams.jobGroup"
                dict-type="schedule_group"
                clearable
                :placeholder="$t('placeholder.quartz.jobGroup')"
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
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
          <el-button type="primary" v-hasPerm="['quartz:job:add']" @click="handleAdd">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
          <el-button type="danger" v-hasPerm="['quartz:job:delete']" @click="handleDelete()">
            <i class="iconfont icon-shanchu pr-5px"></i>{{ $t('button.delete') }}
          </el-button>
          <el-button type="success" v-hasPerm="['quartz:log:list']" @click="handleLog()">
            <i class="iconfont icon-zhankai pr-5px"></i>{{ $t('button.log') }}
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
          :label="$t('label.quartz.invokeTarget')"
          header-align="center"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column
          prop="cronExpression"
          :label="$t('label.quartz.cronExpression')"
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
        <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handleRun(scope.row)"
              v-hasPerm="['quartz:job:run']"
            >
              <i class="iconfont icon-bianji"></i>{{ $t('button.execute') }}
            </el-button>
            <el-button
              v-if="scope.row.status === '0'"
              v-hasPerm="['quartz:job:edit']"
              size="small"
              link
              type="primary"
              @click="handleStatus(scope.row, '1')"
            >
              {{ $t('button.suspend') }}
            </el-button>
            <el-button
              v-if="scope.row.status === '1'"
              v-hasPerm="['quartz:job:edit']"
              size="small"
              link
              type="primary"
              @click="handleStatus(scope.row, '0')"
            >
              {{ $t('button.restore') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleEdit(scope.row.id)"
              v-hasPerm="['quartz:job:edit']"
            >
              <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleDelete(scope.row.id)"
              v-hasPerm="['quartz:job:delete']"
            >
              <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleLog(scope.row.id)"
              v-hasPerm="['quartz:log:list']"
            >
              <i class="iconfont icon-rizhi"></i>{{ $t('button.log') }}
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
    <add-or-edit ref="addOrEditRef" @refresh="handleQuery" />
  </div>
</template>
<script setup lang="ts">
  import { jobPageApi, jobDeleteApi, jobRunApi, jobChangeStatusApi } from '@/api/quartz/job';
  import { onMounted, reactive, ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { ResultEnum } from '@/enums/httpEnum';
  import AddOrEdit from './add-or-edit.vue';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();

  /** 加载中 */
  const loading = ref(true);
  /** 注册组件 */
  const queryForm = ref();
  const addOrEditRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  const searchCollapsed = ref(true);
  /** 数据列表 */
  const dataList = ref<Quartz.JobInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<Quartz.JobInfo[]>();
  /** 查询条件 */
  const queryParams = reactive<Quartz.JobParams>({
    jobName: '',
    jobGroup: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    jobPageApi(queryParams).then(({ data }) => {
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
  const handleSelectionChange = (val: Quartz.JobInfo[]) => {
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
        jobDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 任务日志
   * @return {*}
   */
  const handleLog = (id?: string) => {
    const jobId = id ? id : '';
    router.push({ path: '/quartz/log', query: { jobId: jobId } });
  };

  /**
   * @description: 执行任务
   * @param {*} row 任务
   * @return {*}
   */
  const handleRun = (row: Quartz.JobInfo) => {
    ElMessageBox.confirm(t('label.quartz.immediateMessage'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        jobRunApi(row).then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
          });
        });
      })
      .catch(() => {});
  };

  const handleStatus = (row: Quartz.JobInfo, status: string) => {
    const opt =
      status === '0' ? t('label.quartz.restoreMessage') : t('label.quartz.suspendMessage');
    ElMessageBox.confirm(opt, t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        row.status = status;
        jobChangeStatusApi(row).then(() => {
          ElMessage.success({
            message: t('common.success'),
            duration: 500,
          });
        });
      })
      .catch(() => {});
  };

  onMounted(() => {
    handleQuery();
  });
</script>
<style lang="scss" scoped></style>
