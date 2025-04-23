<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('workflow.label.agentAllName')" prop="name">
              <el-input v-model="queryParams.name" clearable />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="$t('workflow.label.agentTime')" prop="agentTime">
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
      <el-table
        ref="tableRef"
        :data="dataList"
        :border="true"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" align="center" width="50" />
        <el-table-column
          prop="delegatorName"
          :label="$t('workflow.label.delegatorName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="agentName"
          :label="$t('workflow.label.agentName')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="dataTitle"
          :label="t('workflow.label.dataTitle')"
          header-align="center"
          align="center"
          min-width="180"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-button class="flex" type="primary" link @click="handleDetail(scope.row)">
              {{ scope.row.dataTitle }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="formName"
          :label="t('workflow.label.belongForm')"
          header-align="center"
          align="center"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="formStatus"
          :label="t('workflow.label.formStatus')"
          header-align="center"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <dict-tag dict-type="form_status" :value="scope.row.formStatus" />
          </template>
        </el-table-column>
        <el-table-column
          prop="nodeName"
          :label="$t('workflow.label.nodeName')"
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

    <form-detail ref="formDetailRef" @resetQuery="resetQuery" />
  </div>
</template>
<script setup lang="ts">
  import { agentLogPageApi } from '@/api/workflow/agentLog';
  import { ref, reactive, onMounted } from 'vue';
  import FormDetail from '../form/form-detail.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { useI18n } from 'vue-i18n';
  import { parseTime } from '@/utils';

  const { t } = useI18n();

  /** 注册组件 */
  const queryForm = ref();
  const formDetailRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<AgentLog.AgentLogParams>({
    name: '',
    startTime: '',
    endTime: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<AgentLog.AgentLogInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<AgentLog.AgentLogInfo[]>();
  /** 日期时间 */
  const dateValue = ref('');

  const loading = ref(true);

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
    agentLogPageApi(queryParams).then(({ data }) => {
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
  const handleSelectionChange = (val: AgentLog.AgentLogInfo[]) => {
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
   * @param {*} row 行数据
   * @return {*}
   */
  const handleDetail = (row: AgentLog.AgentLogInfo) => {
    const code = row.formCode;
    const procInstId = row.procInstId;
    formDetailRef.value.getInstanceInfoByInstanceId(code, procInstId);
  };

  onMounted(() => {
    handleQuery();
  });
</script>
<style lang="scss" scoped></style>
