<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-03 15:28:06
 * @FilePath: \aster-flowable-vue\src\views\log\access\index.vue
 * @Description: 登录日志
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.access.username')" prop="username">
              <el-input
                v-model="queryParams.username"
                :placeholder="$t('placeholder.access.username')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.access.status')" prop="status">
              <dict-select
                v-model="queryParams.status"
                dict-type="success_fail"
                clearable
                :placeholder="$t('placeholder.access.status')"
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="$t('label.access.loginTime')" prop="startTime">
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                :range-separator="$t('common.dateRange.separator')"
                :start-placeholder="$t('common.dateRange.start')"
                :end-placeholder="$t('common.dateRange.end')"
                format="YYYY-MM-DD HH:mm:ss"
                @calendar-change="calendarChange"
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
          <el-tooltip effect="dark" :content="$t('button.export')" placement="top">
            <el-button circle @click="download" v-hasPerm="['sys:access:export']">
              <i class="iconfont icon-xiazai"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-table ref="tableRef" :data="dataList" :border="true" row-key="id">
        <el-table-column
          prop="username"
          :label="$t('label.access.username')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="ipAddress"
          :label="$t('label.access.ipAddress')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="loginLocation"
          :label="$t('label.access.location')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="userAgent"
          label="User Agent"
          show-overflow-tooltip
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="operation"
          :label="$t('label.access.operation')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="login_operation" :value="scope.row.operation" />
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('label.status')"
          width="80"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="success_fail" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('label.access.loginTime')"
          width="180"
          align="center"
          prop="loginTime"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.loginTime) }}</span>
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
  import { ref, reactive, onMounted } from 'vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { logAccessExportApi, logAccessPageApi } from '@/api/sys/log';
  import { parseTime } from '@/utils';
  import { downloadFile } from '@/utils/fileUtils';
  import { ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  /** 注册组件 */
  const queryForm = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Log.AccessParams>({
    username: '',
    startTime: '',
    endTime: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<Log.AccessInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  const loading = ref(true);
  /** 日期时间 */
  const dateValue = ref('');

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
    dateValue.value = '';
    queryParams.startTime = '';
    queryParams.endTime = '';
    handleQuery();
  };

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    logAccessPageApi(queryParams).then(({ data }) => {
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
   * @description: 时间控件change
   * @param {*} val
   * @return {*}
   */
  const calendarChange = (val: [Date, Date]) => {
    queryParams.startTime = parseTime(val[0]);
    queryParams.endTime = parseTime(val[1]);
  };

  /**
   * @description: 导出
   * @return {*}
   */
  const download = () => {
    ElMessageBox.confirm(t('label.access.exportConfirm'), t('common.tips'), {
      type: 'warning',
      lockScroll: false,
    }).then(() => downloadFile(logAccessExportApi, t('label.access.log'), queryParams));
  };
</script>
<style lang="scss" scoped></style>
