<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-22 16:11:38
 * @FilePath: \aster-flowable-vue\src\views\workflow\workbench\ccme-list.vue
 * @Description: 我发起的
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="t('workflow.label.belongForm')" prop="appId">
              <el-cascader
                v-model="selectedNode"
                :options="treeNodes"
                :show-all-levels="false"
                clearable
                filterable
                placeholder="请选择所属表单"
                @change="handleNodeChange"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="t('workflow.label.formName')" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入表单名称" clearable />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item prop="status" :label="$t('label.status')">
              <dict-select
                dict-type="task_end_status"
                v-model="queryParams.status"
                placeholder="请选择任务状态"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="t('workflow.label.dateRange')" prop="startTime">
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
        <div class="header-button-lf"> </div>
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
      <el-table ref="tableRef" :data="dataList" :border="true" row-key="id">
        <el-table-column fixed type="index" width="50" header-align="center" align="center" />
        <el-table-column
          prop="dataTitle"
          :label="t('workflow.label.dataTitle')"
          fixed
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
          prop="formStatus"
          :label="t('workflow.label.formStatus')"
          fixed
          header-align="center"
          align="center"
          min-width="100"
        >
          <template #default="scope">
            <dict-tag dict-type="task_end_status" :value="scope.row.formStatus" />
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
          prop="nodeName"
          :label="t('workflow.label.currentNode')"
          header-align="center"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="startTime"
          :label="t('workflow.label.startTime')"
          header-align="center"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="endTime"
          :label="t('workflow.label.endTime')"
          header-align="center"
          align="center"
          min-width="120"
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
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { getCcMeApi } from '@/api/workflow/task';
  import { appFormTreeApi } from '@/api/workflow/app';
  import FormDetail from '../form/form-detail.vue';
  import { isNotEmpty, parseTime } from '@/utils';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictTag from '@/components/dict/dict-tag.vue';

  const { t } = useI18n();

  /** 注册组件 */
  const queryForm = ref();
  const formDetailRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<WorkTask.TaskQuery>({
    title: '',
    userId: '',
    appId: '',
    formCode: '',
    startTime: '',
    endTime: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<WorkTask.MyStartedModel[]>();
  /** 总数 */
  const total = ref<number>(0);
  const loading = ref(true);
  /** 日期时间 */
  const dateValue = ref('');
  // 表单树
  const treeNodes = ref<WorkComponent.TreeNode[]>([]);
  const selectedNode = ref<string[]>([]);

  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = () => {
    queryForm.value.resetFields();
    queryParams.pageNum = 1;
    selectedNode.value = [];
    queryParams.formCode = '';
    dateValue.value = '';
    queryParams.startTime = '';
    queryParams.endTime = '';
    handleQuery();
  };

  /**
   * @description: 查询
   * @return {*}
   *
   */
  const handleQuery = () => {
    loading.value = true;
    getCcMeApi(queryParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        dataList.value = res.data.list;
        total.value = res.data.total;
      } else {
        ElMessage.error(res.message);
      }
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
   * @description: 详情
   * @param {*} row 行数据
   * @return {*}
   */
  const handleDetail = (row: WorkTask.MyStartedModel) => {
    const code = row.formCode;
    const procInstId = row.procInstId;
    formDetailRef.value.getInstanceInfoByInstanceId(code, procInstId);
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
   * @description: 显示应用表单树
   * @return {*}
   */
  const getTreeData = () => {
    appFormTreeApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        treeNodes.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 级联选中值变化
   * @param {string[]} val 选中的值
   * @return {*}
   */
  const handleNodeChange = (val: string[]) => {
    if (val && isNotEmpty(val) && val.length === 2) {
      queryParams.appId = val[0];
      queryParams.formCode = val[1];
    } else {
      // 值置空时, 需清空所有数据
      queryParams.appId = '';
      queryParams.formCode = '';
    }
  };

  onMounted(() => {
    getTreeData();
    handleQuery();
  });
</script>
<style lang="scss" scoped></style>
