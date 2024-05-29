<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-22 16:11:38
 * @FilePath: \aster-flowable-vue\src\views\workflow\workbench\process-instance-list.vue
 * @Description: 流程实例列表
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="main-box">
    <form-tree-filter title="应用信息" @change="changeForm" />
    <div class="table-box">
      <div class="card table-search" v-show="showSearch">
        <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
          <div class="grid-box">
            <div class="grid-column">
              <el-form-item :label="$t('label.user.name')" prop="name">
                <el-input
                  v-model="queryParams.name"
                  :placeholder="$t('placeholder.user.name')"
                  clearable
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
                      :class="
                        searchCollapsed ? 'iconfont icon-xiangxia' : 'iconfont icon-xiangshang'
                      "
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
            <el-button type="primary" v-hasPerm="['sys:user:add']" @click="handleAdd">
              <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
            </el-button>
            <el-button type="danger" v-hasPerm="['sys:user:delete']" @click="handleDelete()">
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
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column prop="formName" label="表单名称" header-align="center" align="center" />
          <el-table-column
            prop="icon"
            label="图标"
            header-align="center"
            align="center"
            width="120"
          >
            <template #default="scope">
              <i
                :class="[scope.row.icon, 'iconStyle']"
                :style="{ background: scope.row.iconColor }"
                v-show="isNotEmpty(scope.row.icon)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="version"
            label="版本号"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="status"
            :label="$t('label.status')"
            width="100"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <dict-tag dict-type="status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('label.operate')"
            width="200"
            align="center"
            class-name="operation"
          >
            <template #default="scope">
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
    </div>
    <form-initiation ref="formInitiationRef" />
  </div>
</template>
<script setup lang="ts">
  import FormTreeFilter from '../app/form-tree-filter.vue';
  import FormInitiation from '../form/form-initiation.vue';
  import { reactive, ref } from 'vue';
  import { formPageApi, formDeleteApi, deploymentApi } from '@/api/workflow/form';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useI18n } from 'vue-i18n';
  import { isEmpty, isNotEmpty } from '@/utils';

  const { t } = useI18n();
  /** 注册组件 */
  const queryForm = ref();
  const formInitiationRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 选中的表单ID */
  const formId = ref('');
  /** 查询条件 */
  const queryParams = reactive<WorkForm.FormParams>({
    code: '',
    appId: '',
    formName: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<WorkForm.FormModel[]>([]);
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<WorkForm.FormModel[]>([]);

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
    formPageApi(queryParams).then(({ data }) => {
      dataList.value = data.list;
      total.value = data.total;
    });
  };

  /**
   * @description: 选择列
   * @param {*} val
   * @return {*}
   */
  const handleSelectionChange = (val: WorkForm.FormModel[]) => {
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
    if (isEmpty(formId.value)) {
      ElMessage.warning('请先选择左侧表单');
      return;
    }
    formInitiationRef.value.init(formId.value);
  };

  /**
   * @description: 修改
   * @param {string} key
   * @return {*}
   */
  const handleEdit = (key: string) => {};

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
        formDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 切换表单
   * @param {WorkForm.FormModel} formInfo 选中的表单
   * @return {*}
   */
  const changeForm = (params: WorkForm.QueryParams) => {
    console.log('changeForm', params);
    queryParams.appId = params.appId;
    queryParams.code = params.code;
    if (params.id) {
      formId.value = params.id;
    }
    handleQuery();
  };

  /**
   * @description: 部署
   * @param {*} id 表单id
   * @return {*}
   */
  const handleDeployment = (id: String) => {
    deploymentApi(id).then((res) => {
      console.info('部署：', res);
    });
  };
</script>
<style lang="scss" scoped>
  .iconStyle {
    width: 35px;
    height: 35px;
    font-size: 20px;
    color: #ffffff;
    line-height: 35px;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
  }
</style>
