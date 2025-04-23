<!--.
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-09-04 16:38:51
 * @FilePath: \aster-flowable-vue\src\views\workflow\auth\user-perm.vue
 * @Description: 用户权限
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card table-main">
    <div class="tabs-button">
      <el-button v-if="activeTab === 'auth'" type="primary" size="small" @click="handleSubmit">
        保存
      </el-button>
    </div>
    <el-tabs v-model="activeTab" class="right-tabs" style="height: 100%">
      <el-tab-pane
        label="角色权限设置"
        name="auth"
        v-if="roleType != 'leader'"
        style="height: 100%"
      >
        <el-scrollbar>
          <table class="table-list">
            <thead>
              <tr>
                <th>应用权限</th>
                <th>
                  <el-checkbox
                    v-model="formCheckedAll"
                    :indeterminate="formIndeterminate"
                    @change="handleCheckAllForm"
                  >
                    <span>全选</span>
                  </el-checkbox>
                </th>
                <th>表单权限</th>
                <th>列表权限</th>
                <th>数据权限</th>
              </tr>
            </thead>
            <tbody style="overflow-y: auto">
              <tr v-for="(item, index) in formList" :key="index">
                <td
                  :rowspan="formList.length"
                  v-if="index === 0"
                  style="padding: 5px; vertical-align: text-top"
                >
                  <div class="app-container">
                    <div
                      :class="['app-content', app.value == activeApp ? 'active' : '']"
                      v-for="(app, i) in appTreeList"
                      :key="i"
                      @click="handleAppClick(app)"
                    >
                      <div class="app-icon">
                        <i v-if="app.checked" class="iconfont icon-duihao !text-sm"></i>
                      </div>
                      <div class="app-label">{{ app.label }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <el-checkbox
                    v-model="item.checked"
                    :label="item.formName"
                    @change="handleCheckedForm(item)"
                  />
                </td>
                <td>
                  <el-checkbox-group v-model="item.formPerms" :disabled="!item.checked">
                    <el-checkbox
                      v-for="(perm, i) in formPerms"
                      :key="i"
                      :label="perm.label"
                      :value="perm.value"
                    />
                  </el-checkbox-group>
                </td>
                <td>
                  <el-checkbox
                    v-model="listCheckedAll[index]"
                    :indeterminate="listIndeterminate[index]"
                    @change="handleCheckAllList(index)"
                    :disabled="!item.checked"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-model="item.listPerms"
                    :disabled="!item.checked"
                    @change="handleCheckedList(index)"
                  >
                    <el-checkbox
                      v-for="(perm, i) in listPerms"
                      :key="i"
                      :label="perm.label"
                      :value="perm.value"
                    />
                  </el-checkbox-group>
                </td>
                <td>
                  <el-radio-group v-model="item.dataPerm" :disabled="!item.checked">
                    <el-radio v-for="(perm, i) in dataPerms" :key="i" :value="perm.value">
                      {{ perm.label }}
                    </el-radio>
                  </el-radio-group>
                </td>
              </tr>
            </tbody>
          </table>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane
        v-if="roleType === 'custom' || roleType === 'leader'"
        label="角色成员管理"
        name="member"
      >
        <!-- 表格头部 操作按钮 -->
        <div class="table-header">
          <div class="header-button-lf">
            <el-button type="primary" v-hasPerm="['wf:member:add']" @click="handleAddMember">
              <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
            </el-button>
            <el-button type="danger" v-hasPerm="['wf:member:delete']" @click="handleDeleteMember()">
              <i class="iconfont icon-shanchu pr-5px"></i>{{ $t('button.delete') }}
            </el-button>
          </div>
          <div class="header-button-ri">
            <el-input v-model="memberParams.name" placeholder="请输入成员名称" clearable>
              <template #append>
                <el-button type="primary" @click="getMemberList(roleId)" class="member-search">
                  <i class="iconfont icon-sousuo"></i>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
        <el-table
          ref="memberTableRef"
          :data="memberList"
          :border="true"
          row-key="id"
          @selection-change="handleSelectionMember"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50" />
          <el-table-column
            prop="memberName"
            label="成员名称"
            header-align="center"
            align="center"
          />
          <el-table-column prop="type" label="成员类型" header-align="center" align="center">
            <template #default="scope">
              <dict-tag dict-type="role_member_type" :value="scope.row.type" />
            </template>
          </el-table-column>
          <el-table-column
            prop="serviceOrgName"
            label="服务部门"
            header-align="center"
            align="center"
          />
          <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
            <template #default="scope">
              <el-button
                size="small"
                link
                type="primary"
                @click="showServiceOrg(scope.row)"
                v-hasPerm="['wf:member:edit']"
              >
                <i class="iconfont icon-bianji"></i>设置服务部门
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <member-select
      v-if="activeTab === 'member'"
      ref="memberSelectRef"
      title="添加成员"
      :type="['user', 'dept']"
      :value="memberList"
      node-key="memberId"
      node-label="memberName"
      @submit="handleSaveMember"
    />

    <el-dialog
      v-model="serviceVisible"
      width="30%"
      title="服务部门"
      append-to-body
      :lock-scroll="false"
    >
      <el-tree-select
        v-model="memberInfo.serviceOrgId"
        :data="deptList"
        value-key="id"
        check-strictly
        :render-after-expand="false"
        :props="{ label: 'orgName', children: 'children' }"
        style="width: 100%"
      />

      <template #footer>
        <el-button type="primary" @click="handleEditMember">{{ $t('button.confirm') }}</el-button>
        <el-button @click="serviceVisible = false">{{ $t('button.cancel') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import MemberSelect from '../components/common/member-select.vue';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { appFormTreeApi } from '@/api/workflow/app';
  import {
    permListApi,
    permSaveApi,
    permDeleteApi,
    memberListApi,
    memberDeleteApi,
    memberSaveApi,
    memberEditApi,
  } from '@/api/workflow/auth';
  import { deptListApi } from '@/api/sys/dept';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { isNotEmpty } from '@/utils';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps({
    roleId: {
      type: String,
      default: '',
    },
    roleType: {
      type: String,
      default: '',
    },
  });

  // 活动标签
  const activeTab = ref<'auth' | 'member'>('auth');
  // 应用列表
  const appTreeList = ref<WorkComponent.TreeNode[]>([]);
  // 应用加载状态
  const appLoading = ref<boolean>(false);
  // 表单列表
  const formList = ref<WorkAuth.RolePermission[]>([]);
  // 权限列表
  const permissionList = ref<WorkAuth.RolePermission[]>([]);
  // 权限加载状态
  const permissionLoading = ref<boolean>(false);
  // 应用权限
  const checkedApps = ref<string[]>([]);
  // 选中应用
  const activeApp = ref<string>('');

  // 表单全选标记
  const formCheckedAll = ref(false);
  const formIndeterminate = ref(false);
  // 列表权限全选标记
  const listCheckedAll = ref<boolean[]>([]);
  const listIndeterminate = ref<boolean[]>([]);
  // 成员列表
  const memberList = ref<WorkAuth.MemberInfo[]>([]);
  // 选中的成员
  const memberSelected = ref<string[]>([]);
  // 当前选中的成员
  const memberInfo = ref<WorkAuth.MemberInfo>({});
  // 注册组件
  const memberSelectRef = ref();
  // 显示服务部门
  const serviceVisible = ref(false);
  // 部门列表
  const deptList = ref<Dept.DeptInfo[]>([]);
  // 查询参数
  const memberParams = reactive<WorkAuth.MemberParams>({
    roleId: '',
    name: '',
  });

  // 表单权限列表
  const formPerms = ref<WorkForm.FunctionButton[]>([
    { label: '新增', value: 'add', icon: 'iconfont icon-xinzeng', click: 'handleAdd' },
  ]);

  // 列表权限列表
  const listPerms = ref<WorkForm.FunctionButton[]>([
    { label: '刷新', value: 'refresh', icon: 'iconfont icon-shuaxin', click: 'handleQuery' },
    { label: '筛选', value: 'search', icon: 'iconfont icon-sousuo', click: 'handleShowQuery' },
    { label: '导入', value: 'import', icon: 'iconfont icon-shangchuan', click: 'handleImport' },
    { label: '导出', value: 'export', icon: 'iconfont icon-xiazai', click: 'handleExport' },
    { label: '显示', value: 'column', icon: 'iconfont icon-liebiao', click: 'handleShowColumns' },
  ]);

  // 数据权限列表
  const dataPerms = ref<WorkComponent.TreeNode[]>([
    { label: '本人', value: 'user' },
    { label: '服务部门', value: 'dept' },
    { label: '全部', value: 'all' },
  ]);

  /**
   * @description: 应用点击事件
   * @param {*} appInfo 应用
   * @param {*} index 下标
   * @return {*}
   */
  const handleAppClick = (appInfo: WorkComponent.TreeNode) => {
    activeApp.value = appInfo.value;
    getFormList(appInfo);
  };

  /**
   * @description: 表单全选
   */
  const handleCheckAllForm = (val: boolean) => {
    formList.value.forEach((item) => {
      item.checked = val;
    });
  };

  /**
   * @description: 表单选中
   */
  const handleCheckedForm = (perm: WorkAuth.RolePermission) => {
    const checkedCount = formList.value.filter((item) => item.checked).length;
    formCheckedAll.value = formList.value.length == checkedCount;
    formIndeterminate.value = checkedCount > 0 && checkedCount < formList.value.length;
    // 默认选中表单权限
    if (perm.checked) {
      perm.formPerms = formPerms.value.map((item) => item.value);
    } else {
      perm.formPerms = [];
    }
  };

  /**
   * @description: 列表权限全选
   */
  const handleCheckAllList = (index: number) => {
    if (listCheckedAll.value[index]) {
      formList.value[index].listPerms = listPerms.value.map((item) => item.value);
    } else {
      formList.value[index].listPerms = [];
    }
    listIndeterminate.value[index] = false;
  };

  /**
   * @description: 列表权限选中
   */
  const handleCheckedList = (index: number) => {
    const perms = formList.value[index].listPerms;
    if (perms) {
      listCheckedAll.value[index] = perms.length === listPerms.value.length;
      listIndeterminate.value[index] = perms.length > 0 && perms.length < listPerms.value.length;
    }
  };

  /**
   * @description: 保存
   */
  const handleSubmit = () => {
    const perms = formList.value.filter((form) => form.appId === activeApp.value && form.checked);
    if (perms.length > 0) {
      permSaveApi(perms).then((res) => {
        if (res.code === ResultEnum.SUCCESS) {
          appTreeList.value.forEach((app) => {
            if (app.value === activeApp.value) {
              app.checked = true;
            }
          });
          ElMessage.success('保存成功');
        } else {
          ElMessage.error('保存失败');
        }
      });
    } else {
      const perm = {
        roleId: props.roleId,
        appId: activeApp.value,
      };
      permDeleteApi(perm).then((res) => {
        if (res.code === ResultEnum.SUCCESS) {
          appTreeList.value.forEach((app) => {
            if (app.value === activeApp.value) {
              app.checked = false;
            }
          });
          ElMessage.success('保存成功');
        } else {
          ElMessage.error('保存失败');
        }
      });
    }
  };

  /**
   * @description: 获取表单列表
   * @param {WorkComponent.TreeNode} appInfo
   * @return {*}
   */
  const getFormList = (appInfo: WorkComponent.TreeNode | undefined) => {
    if (appInfo && appInfo.children && appInfo.children.length > 0) {
      formList.value = appInfo.children.map((f) => {
        const checkedForm = permissionList.value.find((p) => p.formId === f.value);
        if (checkedForm && checkedForm.id && isNotEmpty(checkedForm.id)) {
          return {
            ...checkedForm,
            formId: f.value,
            formName: f.label,
            checked: true,
          };
        } else {
          return {
            roleId: props.roleId,
            appId: appInfo.value,
            formId: f.value,
            formName: f.label,
            checked: false,
            listPerms: [],
            dataPerm: '',
          };
        }
      });
    } else {
      formList.value = [];
    }
  };

  /**
   * @description: 设置默认选中
   */
  const setDefaultValue = () => {
    // 若权限列表不为空，则展示权限列表的第一个应用
    let appInfo: WorkComponent.TreeNode | undefined;
    if (checkedApps.value && checkedApps.value.length > 0) {
      appInfo = appTreeList.value.find((item) => item.value === checkedApps.value[0]);
      appTreeList.value.forEach((app) => {
        if (checkedApps.value.indexOf(app.value) != -1) {
          app.checked = true;
        }
      });
    } else {
      // 若权限列表为空则展示第一个应用
      appInfo = appTreeList.value[0];
    }
    // 设置默认选中应用
    if (appInfo) {
      activeApp.value = appInfo.value;
    }
    // 获取表单列表
    getFormList(appInfo);
  };

  /**
   * @description: 获取应用表单树形列表
   */
  const getAppTreeList = async () => {
    appLoading.value = false;
    await appFormTreeApi().then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        appTreeList.value = res.data;
        appLoading.value = true;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 获取权限列表
   * @param {string} roleId 角色ID
   */
  const getPermList = async (roleId: string) => {
    permissionLoading.value = false;
    await permListApi(roleId).then(async (res) => {
      if (res.code == ResultEnum.SUCCESS) {
        permissionList.value = res.data;
        // 找出不重复的appId
        if (permissionList.value && permissionList.value.length > 0) {
          const uniqueApps = new Set<string>();
          permissionList.value.forEach((item) => {
            if (item.appId) {
              uniqueApps.add(item.appId);
            }
          });
          checkedApps.value = Array.from(uniqueApps);
        }
        permissionLoading.value = true;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 选中成员
   * @param {WorkAuth.MemberInfo[]} val
   * @return {*}
   */
  const handleSelectionMember = (val: WorkAuth.MemberInfo[]) => {
    if (val && val.length > 0) {
      val.forEach((m) => {
        if (m.id) {
          memberSelected.value.push(m.id);
        }
      });
    } else {
      memberSelected.value = [];
    }
  };

  /**
   * @description: 添加成员
   */
  const handleAddMember = () => {
    memberSelectRef.value.init();
  };

  /**
   * @description: 保存人员
   */
  const handleSaveMember = async (members: WorkAuth.MemberInfo[]) => {
    await memberSaveApi(props.roleId, members).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        ElMessage.success(t('common.success'));
        getMemberList(props.roleId);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 删除成员
   */
  const handleDeleteMember = () => {
    if (memberSelected.value && memberSelected.value.length > 0) {
      ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {
          memberDeleteApi(memberSelected.value).then((res) => {
            if (res.code === ResultEnum.SUCCESS) {
              ElMessage.success(t('delete.success'));
              getMemberList(props.roleId);
            } else {
              ElMessage.error(res.message);
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessage.warning(t('delete.empty'));
    }
  };

  /**
   * @description: 展示服务部门
   * @param {WorkAuth.MemberInfo} member
   * @return {*}
   */
  const showServiceOrg = (member: WorkAuth.MemberInfo) => {
    memberInfo.value = member;
    serviceVisible.value = true;
  };

  /**
   * @description: 编辑服务部门
   */
  const handleEditMember = () => {
    memberEditApi(memberInfo.value).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        ElMessage.success('编辑成功');
        getMemberList(props.roleId);
        serviceVisible.value = false;
      } else {
        ElMessage.error('编辑失败');
      }
    });
  };

  /**
   * @description: 获取成员列表
   * @param {string} roleId 角色ID
   */
  const getMemberList = (roleId: string) => {
    memberParams.roleId = roleId;
    memberListApi(memberParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        memberList.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 获取部门
   * @return {*}
   */
  const getDeptList = async () => {
    return await deptListApi().then(({ data }) => {
      deptList.value = data;
    });
  };

  /**
   * @description: 监听角色id变化
   */
  watch(
    () => props.roleId,
    async (val) => {
      if (val && isNotEmpty(val)) {
        // 初始化页签
        activeTab.value = 'auth';
        // 获取角色权限列表
        getPermList(val);
        // 获取应用表单列表
        getAppTreeList();
        // 获取角色成员列表
        getMemberList(val);
      }
    },
    { immediate: true, deep: true },
  );

  /**
   * @description: 监听接口加载状态
   */
  watch(
    () => [appLoading.value, permissionLoading.value],
    (val) => {
      if (val && val.length == 2 && val[0] && val[1]) {
        setDefaultValue();
      }
    },
    { immediate: true, deep: true },
  );

  watch(
    () => props.roleType,
    (nval) => {
      activeTab.value = nval === 'leader' ? 'member' : 'auth';
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    // 获取部门列表
    getDeptList();
  });
</script>
<style scoped lang="scss">
  .tabs-button {
    position: absolute;
    top: 125px;
    right: 25px;
    z-index: 1000;
  }

  .table-list {
    width: 100%;
    table,
    td,
    th {
      border: 1px solid var(--el-border-color);
    }
    td {
      text-align: center;
    }
  }

  .app-container {
    width: 100%;
    min-height: 300px;
    margin-bottom: 10px;

    .app-content {
      width: 100%;
      padding: 8px 0px;
      line-height: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: var(--el-text-color-regular);

      .app-icon {
        width: 30px;
      }
      .app-label {
        font-size: 14px;
      }
    }

    .app-content:hover {
      cursor: pointer;
      background-color: var(--el-fill-color-light);
    }

    .active {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }

  .member-search {
    margin-bottom: 0 !important;
    background-color: var(--el-color-primary) !important;
    color: var(--el-button-text-color) !important;
    border-color: var(--el-button-border-color) !important;
  }

  ::v-deep(.el-tabs__header) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 去掉tabs标签栏下的下划线 */
  ::v-deep(.el-tabs__nav-wrap::after) {
    position: static !important;
  }
</style>
