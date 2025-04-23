<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-27 16:39:25
 * @FilePath: \aster-flowable-vue\src\views\auth\user\index.vue
 * @Description: 用户管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="main-box" v-loading="syncLoading">
    <tree-filter
      ref="treeFilterRef"
      :title="$t('label.user.orgList')"
      label="orgName"
      :request-api="deptListApi"
      :default-value="queryParams.orgId"
      @change="changeTreeFilter"
    />
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
            <div class="grid-column">
              <el-form-item :label="$t('label.user.gender')" prop="gender">
                <dict-select
                  v-model="queryParams.gender"
                  dict-type="gender"
                  clearable
                  :placeholder="$t('placeholder.user.gender')"
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
                  <el-button @click="syncUser">
                    <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                    {{ $t('button.sync') }}
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
            <el-button type="success" v-hasPerm="['sys:user:reset']" @click="resetPassword()">
              <i class="iconfont icon-psw-reset pr-5px"></i>{{ $t('label.user.resetPassword') }}
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
            <el-tooltip effect="dark" :content="$t('button.import')" placement="top">
              <el-button circle @click="upload" v-hasPerm="['sys:user:import']">
                <i class="iconfont icon-shangchuan"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('button.export')" placement="top">
              <el-button circle @click="download" v-hasPerm="['sys:user:export']">
                <i class="iconfont icon-xiazai"></i>
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
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50" />

          <el-table-column
            prop="avatar"
            :label="$t('label.user.avatar')"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <el-avatar
                :size="40"
                :src="isEmpty(scope.row.avatar) ? AVATAR_URL : scope.row.avatar"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            :label="$t('label.user.username')"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="nickName"
            :label="$t('label.user.nickName')"
            width="100"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="gender"
            :label="$t('label.user.gender')"
            width="100"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <dict-tag dict-type="gender" :value="scope.row.gender" />
            </template>
          </el-table-column>
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
            prop="mobile"
            :label="$t('label.user.mobile')"
            width="120"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="birthday"
            :label="$t('label.user.birthday')"
            width="120"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="signature"
            :label="$t('label.user.signature')"
            width="160"
            header-align="center"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('label.operate')"
            fixed="right"
            width="260"
            align="center"
            class-name="operation"
          >
            <template #default="scope">
              <el-button
                size="small"
                link
                type="primary"
                @click="handleEdit(scope.row.id)"
                v-hasPerm="['sys:user:edit']"
              >
                <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
              </el-button>
              <el-button
                size="small"
                link
                type="primary"
                @click="handleDelete(scope.row.id)"
                v-hasPerm="['sys:user:delete']"
              >
                <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
              </el-button>
              <el-button
                size="small"
                link
                type="primary"
                v-hasPerm="['sys:user:reset']"
                @click="resetPassword(scope.row.id)"
              >
                <i class="iconfont icon-psw-reset"></i>{{ $t('label.user.resetPassword') }}
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
    <add-or-edit ref="addOrEditRef" @refresh="handleQuery" />
    <upload-excel ref="uploadExcelRef" />
  </div>
</template>
<script setup lang="ts">
  import TreeFilter from '@/components/tree/tree-filter.vue';
  import { deptListApi } from '@/api/sys/dept';
  import { onMounted, reactive, ref } from 'vue';
  import { userPageApi, userDeleteApi, userExportApi, userBatchSaveApi } from '@/api/sys/user';
  import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';
  import AddOrEdit from './add-or-edit.vue';
  import uploadExcel from '@/components/upload/upload-excel.vue';
  import { downloadFile } from '@/utils/fileUtils';
  import { useI18n } from 'vue-i18n';
  import { isEmpty } from '@/utils';
  import { userResetPwdApi } from '@/api/login';
  import { AVATAR_URL } from '@/config';
  import { dingSyncApi } from '@/api/sys/ding';

  const { t } = useI18n();
  /** 树组件ref */
  const treeFilterRef = ref();
  /** 注册组件 */
  const queryForm = ref();
  const addOrEditRef = ref();
  const uploadExcelRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<User.UserParams>({
    name: '',
    gender: '',
    status: '',
    orgId: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<User.UserInfo[]>([]);
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<User.UserInfo[]>([]);
  /** 查询loading */
  const loading = ref(true);

  /** 同步loading */
  const syncLoading = ref(false);

  /** treeFilter */
  const changeTreeFilter = (val: string) => {
    queryParams.orgId = val;
    queryParams.pageNum = 1;
    handleQuery();
  };

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
    userPageApi(queryParams).then(({ data }) => {
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
  const handleSelectionChange = (val: User.UserInfo[]) => {
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
        userDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 重置密码
   * @param {string} key
   * @return {*}
   */
  const resetPassword = (key?: string) => {
    let keys = [] as any[];
    if (key) {
      keys = [key];
    } else {
      keys = selectedList.value?.map((item) => item.id);
    }
    if (isEmpty(keys)) {
      ElMessage.warning(t('common.selectOne'));
      return;
    }
    ElMessageBox.confirm(t('label.user.resetPwdConfirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        userResetPwdApi(keys).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElNotification({
              title: t('label.user.resetPassword'),
              message: t('common.success'),
              type: 'success',
              duration: 3000,
            });
          } else {
            ElNotification({
              title: t('label.user.resetPassword'),
              message: t('common.failed'),
              type: 'error',
              duration: 3000,
            });
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 导入
   * @return {*}
   */
  const upload = () => {
    const params = {
      title: '用户',
      tempApi: userExportApi,
      importApi: userBatchSaveApi,
      getTableList: handleQuery(),
    };
    uploadExcelRef.value.init(params);
  };

  /**
   * @description: 导出
   * @return {*}
   */
  const download = () => {
    ElMessageBox.confirm(t('label.user.exportConfirm'), t('common.tips'), {
      type: 'warning',
      lockScroll: false,
    }).then(() => downloadFile(userExportApi, t('label.user.userList'), queryParams));
  };

  /**
   * @description: 同步用户
   * @return {*}
   */
  const syncUser = () => {
    syncLoading.value = true;
    dingSyncApi()
      .then((res) => {
        syncLoading.value = false;
        if (res.code == ResultEnum.SUCCESS) {
          ElMessage.success(t('common.success'));
          treeFilterRef.value.reload();
          handleQuery();
        } else {
          ElMessage.error(t('common.failed'));
        }
      })
      .catch(() => {
        syncLoading.value = false;
        ElMessage.error(t('common.failed'));
      });
  };
</script>
