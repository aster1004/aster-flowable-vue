<!--
 * @Author: lwj
 * @Date: 2024-05-17 09:53:47
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\user-dept-picker.vue
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
                <el-button type="primary" @click="handleQuery">
                  <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.search') }}
                </el-button>
                <el-button @click="resetQuery">
                  <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.reset') }}
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table-title" v-if="isMultiple">
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="isMultiple"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="realName"
            label="用户名称"
            width="120"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.realName">{{ scope.row.realName }}</span>
              <span v-else>{{ scope.row.nickName ? scope.row.nickName : '' }}</span>
            </template>
          </el-table-column>

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
          layout="total, sizes, prev, pager, next"
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
            prop="realName"
            label="用户名称"
            width="100"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.realName">{{ scope.row.realName }}</span>
              <span v-else>{{ scope.row.nickName ? scope.row.nickName : '' }}</span>
            </template>
          </el-table-column>

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
                <el-button type="primary" @click="handleQuery">
                  <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.search') }}
                </el-button>
                <el-button @click="resetQuery">
                  <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.reset') }}
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table-title" v-if="isMultiple">
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="isMultiple"
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
          layout="total, sizes, prev, pager, next"
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

    <!--  角色  -->
    <div class="main-box" v-else-if="type === 'sysRole' || type === 'flowRole'">
      <div class="table-box">
        <!--  搜索框  -->
        <div class="card">
          <el-form inline ref="queryForm" :model="queryRoleParams" @keyup.enter="handleQuery">
            <div class="search-box">
              <div class="search-left">
                <el-form-item label="" prop="roleName">
                  <el-input
                    v-model="queryRoleParams.roleName"
                    :placeholder="$t('placeholder.role.roleName')"
                    clearable
                  />
                </el-form-item>
              </div>
              <div class="search-right">
                <el-button type="primary" @click="handleQuery">
                  <i class="iconfont icon-sousuo pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.search') }}
                </el-button>
                <el-button @click="resetQuery">
                  <i class="iconfont icon-zhongzhi pr-5px" style="font-size: 12px"></i>
                  {{ $t('button.reset') }}
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
        <div class="table-title" v-if="props.multiple">
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
          :data="roleList"
          :border="true"
          row-key="id"
          style="width: 100%"
          @select-all="selectAll"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="props.multiple"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="roleName"
            align="center"
            :label="$t('label.role.roleName')"
            :show-overflow-tooltip="true"
            header-align="center"
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
          layout="total, sizes, prev, pager, next"
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
            prop="roleName"
            :label="$t('label.role.roleName')"
            :show-overflow-tooltip="true"
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
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { reactive, ref, PropType, computed } from 'vue';
  import { deptListApi } from '@/api/sys/dept';
  import TreeFilter from '@/components/tree/tree-filter.vue';
  import { selectUsersByDeptIdsApi, userPageApi, selectUsersByRoleIdsApi } from '@/api/sys/user';
  import { getDeptAndSubDeptById } from '@/api/sys/dept';
  import { ElMessage } from 'element-plus';
  import { rolePageApi } from '@/api/sys/role';
  import { isNotEmpty } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { memberByRoleIdsApi } from '@/api/workflow/auth';

  const emits = defineEmits(['success']);
  const props = defineProps({
    // 判断是否为设计模式，默认为form。
    mode: { type: String as PropType<'design' | 'form' | 'search' | 'table'>, default: 'form' },
    title: { type: String, default: '请选择' },
    type: {
      type: String,
      default: 'user', //user-选人  dept-选部门 sysRole-选系统角色 flowRole-选流程角色
    },
    formItem: { type: Object as PropType<WorkComponent.ComponentConfig>, default: {} },
    // 是否多选，优先级比formItem.props.multiple 高，如果为true，则都为多选
    multiple: { type: Boolean, default: false },
  });

  /** 显示组件 */
  const dialogVisible = ref(false);
  const queryForm = ref();

  // 定义一个联合类型
  type UserOrDept = User.UserInfo | Dept.DeptInfo | Role.RoleInfo;
  /** 已选择列表 */
  const selectedList = ref<UserOrDept[]>([]);
  /** 数据列表 */
  const dataList = ref<UserOrDept[]>([]);
  /** 总数 */
  const total = ref<number>(0);
  /** 角色列表 */
  const roleList = ref<Role.RoleInfo[]>([]);

  /** 要提交的列表 */
  const submitList = ref<UserOrDept[]>([]);
  const loading = ref(true);
  const tableRef = ref();
  const treeDataRef = ref();
  const userIds = ref<string[]>([]); //显示的用户

  /** 部门查询条件 */
  const queryDeptParams = reactive<Dept.DeptParams>({
    orgName: '',
    status: '',
    id: '',
    pageNum: 1,
    pageSize: 10,
  });

  /** 用户查询条件 */
  const queryParams = reactive<User.UserParams>({
    name: '',
    gender: '',
    status: '',
    orgId: '',
    pageNum: 1,
    pageSize: 10,
  });

  /** 角色查询条件 */
  const queryRoleParams = reactive<Role.RoleParams>({
    roleName: '',
    roleCode: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });

  const _canselected = computed(() => {
    return props.formItem.props?.canselected;
  });

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    if (props.type === 'user') {
      getUserList();
    } else if (props.type === 'dept') {
      getDeptList();
    } else if (props.type === 'sysRole') {
      getSysRoleList();
    } else if (props.type === 'flowRole') {
      handleQueryFlowRole();
    }
  };

  /**
   * 查询用户列表
   * @param type
   * @param ids
   */
  const getUserList = () => {
    userIds.value = [];
    const ids = _canselected.value?.ids;
    const type = _canselected.value?.type;
    // 判断ids是否有值，有则需要做权限筛选，获取需要过滤的用户id（userIds）
    if (ids && isNotEmpty(ids)) {
      switch (type) {
        case 'user':
          userIds.value = ids;
          break;
        case 'dept':
          // 通过部门id批量查询部门下的所有用户
          getUsersByDeptIdsApi(ids);
          break;
        case 'sysRole':
          // 通过角色id批量查询角色下的所有用户
          getUsersByRoleIdsApi(ids);
          break;
        case 'flowRole':
          getUsersByFlowRoleApi(ids);
          break;
        default:
          queryParams.orgId = '';
          break;
      }
    }
    userPageApi(queryParams).then(async ({ data }) => {
      // console.log('过滤用户id', userIds.value);
      dataList.value = [];
      // 如果是设计模式，则此限制不生效，任然显示全量数据，方便做配置
      if (userIds.value.length > 0 && props.mode !== 'design') {
        // 通过totalPages 计算总页码
        const totalPages = Math.ceil(data.total / queryParams.pageSize);
        //处理超过一页的情况，循环totalPages，获取每一页的数据，然后进行过滤
        for (let i = 1; i <= totalPages; i++) {
          queryParams.pageNum = i;
          await userPageApi(queryParams).then(({ data }) => {
            dataList.value = dataList.value.concat(data.list);
          });
        }
        // 过滤data.list属性id 在userIds数组中不存在的数据
        dataList.value = dataList.value.filter((item: User.UserInfo) => {
          return userIds.value.some((id: string) => {
            return item.id === id;
          });
        });
        total.value = dataList.value.length;
      } else {
        dataList.value = data.list;
        total.value = data.total;
      }
      loading.value = false;
    });
  };

  /**
   * @description: 根据部门id批量查询用户信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const getUsersByDeptIdsApi = async (ids: string[]) => {
    await selectUsersByDeptIdsApi(ids).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        const data = res.data;
        // 如果userIds.value 不存在id，则添加
        data.forEach((item: User.UserInfo) => {
          if (!userIds.value.includes(item.id)) {
            userIds.value.push(item.id);
          }
        });
      }
    });
  };

  /**
   * @description: 根据角色id批量查询用户信息
   * @param {*} ids 角色id集合
   * @return {*}
   */
  const getUsersByRoleIdsApi = async (ids: string[]) => {
    await selectUsersByRoleIdsApi(ids).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        const data = res.data;
        // 如果userIds.value 不存在id，则添加
        data.forEach((item: Role.RoleUserInfo) => {
          if (!userIds.value.includes(item.userId)) {
            userIds.value.push(item.userId);
          }
        });
      }
    });
  };

  /**
   * @description: 获取流程角色ID查询用户信息
   * @param {*} ids 角色id集合
   * @return {*}
   */
  const getUsersByFlowRoleApi = async (ids: string[]) => {
    await memberByRoleIdsApi(ids).then(({ data }) => {
      // limitUserIds.value 不存在id，则添加
      data.forEach((item: WorkAuth.MemberInfo) => {
        if (item.memberId && !userIds.value.includes(item.memberId)) {
          userIds.value.push(item.memberId);
        }
      });
    });
  };

  /**
   * 查询部门列表
   * @param type
   * @param ids
   */
  const getDeptList = () => {
    const ids = _canselected.value?.ids;
    dataList.value = [];
    getDeptAndSubDeptById(queryDeptParams).then(async ({ data }) => {
      // 如果是设计模式，则此限制不生效，任然显示全量数据，方便做配置
      if (ids && ids.length > 0 && props.mode !== 'design') {
        // 通过totalPages 计算总页码
        const totalPages = Math.ceil(data.total / queryDeptParams.pageSize);
        //处理超过一页的情况，循环totalPages，获取每一页的数据，然后进行过滤
        for (let i = 1; i <= totalPages; i++) {
          queryDeptParams.pageNum = i;
          await getDeptAndSubDeptById(queryDeptParams).then(({ data }) => {
            dataList.value = dataList.value.concat(...data.list);
          });
        }
        // 过滤data.list属性id 在userIds数组中不存在的数据
        dataList.value = dataList.value.filter((item: Dept.DeptInfo) => {
          return ids.some((id: string) => {
            return item.id === id;
          });
        });
        total.value = dataList.value.length;
      } else {
        dataList.value = data.list;
        total.value = data.total;
      }

      loading.value = false;
    });
  };

  /**
   * @description: 查询系统角色列表
   * @return {*}
   */
  const getSysRoleList = () => {
    rolePageApi(queryRoleParams).then(({ data }) => {
      roleList.value = data.list;
      total.value = data.total;
      loading.value = false;
    });
  };

  /**
   * @description: 查询流程角色列表
   * @return {*}
   */
  const handleQueryFlowRole = () => {
    // TODO 查询流程角色,后续补充
    roleList.value = [];
  };
  /**
   * @description: 改变树过滤条件
   * @param {string} val
   * @return {*}
   */
  const changeTreeFilter = (val: string) => {
    queryParams.orgId = val;
    queryDeptParams.id = val;
    queryParams.pageNum = 1;
    queryDeptParams.pageNum = 1;
    handleQuery();
  };

  /**
   * @description: 选择列
   * @param {*} val
   * @return {*}
   */
  const handleSelectionChange = (val: UserOrDept[]) => {
    selectedList.value = val;
  };

  // 判断是否为多选
  const isMultiple = computed(() => {
    return props.multiple || props.formItem?.props?.multiple;
  });
  /**
   * @description: 当用户手动勾选数据行的 Checkbox 时触发的事件
   * @param {*} selection
   * @return {*}
   */
  const selectAll = (selection) => {
    // 清除所有勾选项
    if (isMultiple.value) {
      selectedList.value = selection;
    } else {
      ElMessage.warning('当前为单选模式');
      tableRef.value.clearSelection();
      selectedList.value = [];
    }
  };

  /**
   * @description: 添加
   * @param {string} key
   * @return {*}
   */
  const handleAdd = (row?: any) => {
    let val: any = [];
    if (row && row.id) {
      val.push({
        id: row.id,
        type: props.type,
        realName: row.realName ? row.realName : '', // 用户名称
        nickName: row.nickName ? row.nickName : '', // 昵称
        orgName: row.orgName ? row.orgName : '', // 部门名称
        roleName: row.roleName ? row.roleName : '', // 角色名称
      });
    } else {
      console.log(selectedList.value);
      // 同时返回名称username
      val = selectedList.value?.map((item: any) => {
        const obj = { ...item };
        const realName = obj.realName ? obj.realName : '';
        const nickName = obj.nickName ? obj.nickName : '';
        const orgName = obj.orgName ? obj.orgName : '';
        const roleName = obj.roleName ? obj.roleName : '';

        return {
          id: item.id,
          type: props.type,
          realName: realName,
          nickName: nickName,
          orgName: orgName,
          roleName: roleName,
        };
      });
      if (!val || val.length == 0) {
        ElMessage.warning('请选择要添加的记录');
        return;
      }
    }
    // 将val 的值push到submitList，并且判断submitList里没有才加入
    // 使用 Set 来提高查找效率，避免重复元素
    const submitSet = new Set(submitList.value.map((item) => item.id));

    val.forEach((item: UserOrDept) => {
      if (!submitSet.has(item.id)) {
        if (isMultiple.value) {
          submitList.value.push(item);
        } else {
          // 如果不是多选，则清空submitList,并用当前的item替换
          submitList.value = [item];
        }
        submitSet.add(item.id);
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
    emits('success', Object.assign([], submitList.value));
    dialogVisible.value = false;
    resetRecode();
  };

  /**
   * @description: 重置
   * @return {*}
   */
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
    queryRoleParams.roleCode = '';
    queryRoleParams.pageNum = 1;
    queryRoleParams.pageSize = 10;
    selectedList.value = [];
    submitList.value = [];
  };

  /**
   * @description: 初始化
   * @param {*} selectedInfo
   * @return {*}
   */
  const init = async (selectedInfo: UserOrDept[]) => {
    dialogVisible.value = true;
    if (selectedInfo.length > 0) {
      submitList.value = JSON.parse(JSON.stringify(selectedInfo));
    } else {
      submitList.value = [];
    }
    handleQuery();
  };

  defineExpose({ init });
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
    width: 20%;
  }
  .main-box {
    display: flex;
    width: 100%;
    height: 550px;
    .table-box {
      // 这里减去的是 treeFilter 组件宽度
      width: 55%;
      margin-right: 10px;
    }
  }
  .main-right {
    width: 25%;
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
    .el-form-item--default {
      margin-bottom: 0px;
    }
    .el-form-item {
      margin-bottom: 0px;
    }
  }
</style>
