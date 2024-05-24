<!--
 * @Author: lwj
 * @Date: 2024-05-17 09:53:47
 * @FilePath: \aster-flowable-vue\src\components\userOrgPicker\user-dept-picker.vue
 * @Description: 用户、部门选择组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.title"
    :destroy-on-close="true"
    width="65%"
    draggable
    :lock-scroll="false"
  >
    <div class="main-box" v-if="type === 'user'">
      <tree-filter
        ref="treeDataRef"
        class="main-left"
        :title="$t('label.user.orgList')"
        label="orgName"
        :request-api="deptListApi"
        :multiple="false"
        @change="changeTreeFilter"
      />
      <div class="table-box">
        <!--  搜索框  -->
        <div class="card">
          <el-form inline ref="queryForm" :model="queryParams" @keyup.enter="handleQuery()">
            <div class="search-box">
              <div class="search-left">
                <el-form-item label="" prop="name">
                  <el-input
                    v-model="queryParams.name"
                    :placeholder="$t('placeholder.user.name')"
                    clearable
                  />
                </el-form-item>
              </div>
              <div class="search-right">
                <el-form-item>
                  <el-button type="primary" @click="handleQuery">
                    <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                    {{ $t('button.search') }}
                  </el-button>
                  <el-button @click="resetQuery">
                    <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                    {{ $t('button.reset') }}
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table-title" v-if="props.formItem.props.multiple">
          <div>
            <span v-if="selectedList.length > 0">已选择 {{ selectedList.length }} 条</span>
          </div>

          <el-button plain type="primary" size="small" @click="handleAdd()" style="float: right">
            <i class="iconfont icon-tianjia pr-5px" style="font-size: 14px"></i>批量添加
          </el-button>
        </div>
        <!-- 表格 -->
        <el-table
          ref="tableRef"
          :data="dataList"
          :border="true"
          row-key="id"
          style="width: 100%"
          @select-all="selectAll"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="props.formItem.props.multiple"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="username"
            :label="$t('label.user.username')"
            width="120"
            header-align="center"
            align="center"
          />

          <el-table-column
            prop="mobile"
            :label="$t('label.user.mobile')"
            width="120"
            header-align="center"
            align="center"
          />
          <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click.stop="handleAdd(scope.row)">
                <i class="iconfont icon-tianjia pr-5px" style="font-size: 12px"></i>添加
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
      <!--  右侧内容    -->
      <div class="main-right card">
        <div class="table-title">
          <div>
            <span>已选择: {{ submitList.length }}</span>
          </div>
          <el-button plain type="danger" size="small" @click="handleDelete()" style="float: right">
            <i class="iconfont icon-shanchu pr-5px" style="font-size: 14px"></i>全部移除
          </el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="submitList" :border="true" row-key="id" style="width: 100%">
          <el-table-column
            prop="username"
            :label="$t('label.user.username')"
            width="100"
            header-align="center"
            align="center"
          />

          <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
            <template #default="scope">
              <el-button size="small" type="danger" plain @click="handleDelete(scope.row.id)">
                <i class="iconfont icon-shanchu pr-5px" style="font-size: 12px"></i>移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 部门 -->
    <div class="main-box" v-else-if="type === 'dept'">
      <tree-filter
        ref="treeDataRef"
        class="main-left"
        :title="$t('label.user.orgList')"
        label="orgName"
        :request-api="deptListApi"
        :multiple="false"
        @change="changeTreeFilter"
      />
      <div class="table-box">
        <!--  搜索框  -->
        <div class="card">
          <el-form inline ref="queryForm" :model="queryParams" @keyup.enter="handleQuery()">
            <div class="search-box">
              <div class="search-left">
                <el-form-item label="" prop="orgName">
                  <el-input
                    v-model="queryDeptParams.orgName"
                    :placeholder="$t('placeholder.dept.orgName')"
                    clearable
                  />
                </el-form-item>
              </div>
              <div class="search-right">
                <el-form-item>
                  <el-button type="primary" @click="handleQuery">
                    <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                    {{ $t('button.search') }}
                  </el-button>
                  <el-button @click="resetQuery">
                    <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                    {{ $t('button.reset') }}
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table-title" v-if="props.formItem.props.multiple">
          <div>
            <span v-if="selectedList.length > 0">已选择 {{ selectedList.length }} 条</span>
          </div>

          <el-button plain type="primary" size="small" @click="handleAdd()" style="float: right">
            <i class="iconfont icon-tianjia pr-5px" style="font-size: 14px"></i>批量添加
          </el-button>
        </div>
        <!-- 表格 -->
        <el-table
          ref="tableRef"
          :data="dataList"
          :border="true"
          row-key="id"
          style="width: 100%"
          @select-all="selectAll"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="props.formItem.props.multiple"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="orgName"
            :label="$t('label.dept.orgName')"
            :show-overflow-tooltip="true"
            header-align="center"
            width="160"
          />
          <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
            <template #default="scope">
              <el-button size="small" type="primary" plain @click.stop="handleAdd(scope.row)">
                <i class="iconfont icon-tianjia pr-5px" style="font-size: 12px"></i>添加
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :background="true"
          v-model:current-page="queryDeptParams.pageNum"
          v-model:page-size="queryDeptParams.pageSize"
          :page-sizes="[10, 25, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!--  右侧内容    -->
      <div class="main-right card">
        <div class="table-title">
          <div>
            <span>已选择: {{ submitList.length }}</span>
          </div>
          <el-button plain type="danger" size="small" @click="handleDelete()" style="float: right">
            <i class="iconfont icon-shanchu pr-5px" style="font-size: 14px"></i>全部移除
          </el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="submitList" :border="true" row-key="id" style="width: 100%">
          <el-table-column
            prop="orgName"
            :label="$t('label.dept.orgName')"
            :show-overflow-tooltip="true"
            header-align="center"
            width="160"
          />
          <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
            <template #default="scope">
              <el-button size="small" type="danger" plain @click="handleDelete(scope.row.id)">
                <i class="iconfont icon-shanchu pr-5px" style="font-size: 12px"></i>移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  // dialog状态
  import { reactive, ref, PropType, watchEffect } from 'vue';
  import { deptListApi } from '@/api/sys/dept';
  import TreeFilter from '@/components/tree/tree-filter.vue';
  import { userPageApi } from '@/api/sys/user';
  import { getDeptAndSubDeptById } from '@/api/sys/dept';
  import { ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const dialogVisible = ref(false);
  const emits = defineEmits(['selectOk']);
  const props = defineProps({
    mode: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '请选择',
    },
    type: {
      type: String,
      default: 'user', //user-选人  dept-选部门 role-选角色
    },

    selected: {
      type: Array,
      default: () => {
        return [];
      },
    },
    formItem: {
      type: Object as PropType<WorkComponent.ComponentConfig>,
      default: {},
    },
  });

  const queryForm = ref();
  /** 数据列表 */
  const dataList = ref<User.UserInfo[]>([]);
  /** 总数 */
  const total = ref<number>(0);

  // 定义一个联合类型
  type UserOrDept = User.UserInfo | Dept.DeptInfo;
  // 使用联合类型作为ref的类型
  /** 已选择列表 */
  const selectedList = ref<UserOrDept[]>([]);

  /** 要提交的列表 */
  const submitList = ref<UserOrDept[]>([]);
  const loading = ref(true);

  const tableRef = ref();

  const treeDataRef = ref();
  /** treeFilter */
  const changeTreeFilter = (val: string) => {
    queryParams.orgId = val;
    queryDeptParams.id = val;
    queryParams.pageNum = 1;
    queryDeptParams.pageNum = 1;
    handleQuery();
  };
  /** 部门查询条件 */
  const queryDeptParams = reactive<Dept.DeptParams>({
    orgName: '',
    status: '',
    id: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 查询条件 */
  const queryParams = reactive<User.UserParams>({
    name: '',
    gender: '',
    status: '',
    orgId: '',
    pageNum: 1,
    pageSize: 10,
  });
  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    if (props.type === 'user') {
      userPageApi(queryParams).then(({ data }) => {
        dataList.value = data.list;
        total.value = data.total;
        loading.value = false;
      });
    } else if (props.type === 'dept') {
      getDeptAndSubDeptById(queryDeptParams).then(({ data }) => {
        dataList.value = data.list;
        total.value = data.total;
        loading.value = false;
      });
    }
  };

  /**
   * @description: 选择列
   * @param {*} val
   * @return {*}
   */
  const handleSelectionChange = (val: UserOrDept[]) => {
    selectedList.value = val;
  };

  /**
   * 	当用户手动勾选数据行的 Checkbox 时触发的事件
   * @param selection
   */
  const selectAll = (selection) => {
    // 清除 所有勾选项
    if (props.formItem.props.multiple) {
      selectedList.value = selection;
    } else {
      ElMessage.warning('当前为单选模式');
      tableRef.value.clearSelection();
      selectedList.value = [];
    }
  };
  const handleRowClick = (row) => {
    //如果是多选
    if (props.formItem.props.multiple) {
      const selected = selectedList.value.some((item) => item.id === row.id);
      if (!selected) {
        tableRef.value.toggleRowSelection(row, true);
      } else {
        const weightListNew = selectedList.value.filter((item) => {
          return item.id !== row.id;
        });
        selectedList.value = weightListNew;
        tableRef.value.toggleRowSelection(row, false);
      }
    } else {
      const selectData = selectedList.value;
      tableRef.value.clearSelection();
      if (selectData.length > 0) {
        selectData.forEach((item) => {
          // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
          if (item.id == row.id) {
            tableRef.value.toggleRowSelection(row, false);
          } else {
            // 不然就让当前的一行勾选
            tableRef.value.toggleRowSelection(row, true);
          }
        });
      } else {
        tableRef.value.toggleRowSelection(row, true);
      }
    }
  };
  /**
   * @description: 添加
   * @param {string} key
   * @return {*}
   */
  const handleAdd = (row: any) => {
    let val: any = [];
    if (row && row.id) {
      val.push({
        id: row.id,
        username: row.username,
        orgName: row.orgName,
      });
    } else {
      // 同时返回名称username
      val = selectedList.value?.map((item) => {
        return {
          id: item.id,
          username: item.username,
          orgName: item.orgName,
        };
      });
      if (!val || val.length == 0) {
        ElMessage.warning('请选择要添加的记录');
        return;
      }
    }
    //将val 的值push到submitList，并且判断submitList里没有才加入
    val.forEach((item: UserOrDept) => {
      if (!submitList.value.some((val) => val.id == item.id)) {
        if (props.formItem.props.multiple) {
          submitList.value.push(item);
        } else {
          // 如果不是多选，则清空submitList,并用当前的item替换
          submitList.value = [item];
        }
      } else {
        ElMessage.warning('该记录已添加');
        return;
      }
    });
  };

  /**
   * @description: 删除
   * @param {string} key
   * @return {*}
   */
  const handleDelete = (key?: string) => {
    if (key) {
      // 通过key移除数组submitlist的值
      submitList.value = submitList.value.filter((item) => item.id != key);
    } else {
      submitList.value = [];
    }
  };
  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = () => {
    queryForm.value.resetFields();
    queryParams.pageNum = 1;
    queryDeptParams.pageNum = 1;
    handleQuery();
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
    queryDeptParams.pageNum = val;
    handleQuery();
  };

  /**
   * @description: 提交
   * @return {*}
   */
  const submit = () => {
    emits('selectOk', Object.assign([], submitList.value));
    dialogVisible.value = false;
    resetRecode();
  };
  const resetRecode = () => {
    queryParams.name = '';
    queryParams.gender = '';
    queryParams.status = '';
    queryParams.orgId = '';
    queryParams.pageNum = 1;
    queryParams.pageSize = 10;
    queryDeptParams.id = '';
    queryDeptParams.pageNum = 1;
    queryDeptParams.pageSize = 10;
    selectedList.value = [];
    submitList.value = [];
  };
  /** 初始化 */
  const init = async (selectedInfo: UserOrDept[]) => {
    dialogVisible.value = true;
    if (selectedInfo.length > 0) {
      submitList.value = JSON.parse(JSON.stringify(selectedInfo));
    } else {
      submitList.value = [];
    }
    handleQuery();
  };
  defineExpose({
    init,
  });
</script>

<style scoped lang="scss">
  .table-title {
    display: flex;
    margin-top: 5px;
    padding: 10px 15px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    justify-content: space-between;
  }
  .card {
    padding: 10px 15px;
  }
  .main-left {
    width: 25%;
  }
  .main-box {
    display: flex;
    width: 100%;
    height: 550px;
    .table-box {
      // 这里减去的是 treeFilter 组件宽度
      width: 45%;
      margin-right: 10px;
    }
  }
  .main-right {
    width: 30%;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
    .el-form-item {
      margin-right: 0px;
    }
    .search-left {
      display: flex;
    }
    .search-right {
      display: flex;
    }
  }
</style>
