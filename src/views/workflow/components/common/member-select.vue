<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 11:05:49
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\member-select.vue
 * @Description: 人员部门角色选择
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog v-model="visible" :title="props.title" :lock-scroll="false" @closed="closeSelect">
    <div class="rang-container">
      <div class="tag-container">
        <el-card shadow="never" style="min-height: 100px">
          <el-tag
            v-for="(tagItem, tagIndex) in selectedTags"
            :key="tagIndex"
            closable
            type="primary"
            @close="removeTag(tagItem)"
          >
            <i class="iconfont icon-yonghu icon-primary" v-if="tagItem.type == 'user'"></i>
            <i class="iconfont icon-jigou1 icon-primary" v-if="tagItem.type == 'dept'"></i>
            <i class="iconfont icon-zaixianyonghu icon-primary" v-if="tagItem.type == 'role'"></i>
            <i class="iconfont icon-jiemianguanli icon-primary" v-if="tagItem.type == 'form'"></i>
            &nbsp;{{ tagItem[nodeLabel] }}
          </el-tag>
        </el-card>
      </div>
      <div class="tab-container">
        <el-tabs v-model="activeName">
          <el-tab-pane
            :label="t('workflow.process.user')"
            name="user"
            v-if="type.indexOf('user') != -1"
          >
            <div class="select-card">
              <el-row>
                <el-col :span="18">
                  <el-scrollbar>
                    <el-tree
                      v-model="users"
                      node-key="id"
                      :data="userTreeData"
                      :render-after-expand="false"
                      :expand-on-click-node="false"
                      :default-expanded-keys="defaultExpandedUser"
                      :props="{ label: 'orgName', children: 'children' }"
                      @node-click="handleDeptClick"
                    />
                  </el-scrollbar>
                </el-col>
                <el-col :span="6">
                  <el-checkbox-group v-model="checkedUsers" @change="handleUserCheckChange">
                    <el-scrollbar height="260px">
                      <div v-for="userItem in userList" :key="userItem.id">
                        <el-checkbox
                          :label="
                            isNotEmpty(userItem.realName) ? userItem.realName : userItem.nickName
                          "
                          :value="userItem.id"
                        />
                      </div>
                    </el-scrollbar>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="t('workflow.process.dept')"
            name="dept"
            v-if="type.indexOf('dept') != -1"
          >
            <div class="select-card">
              <el-scrollbar>
                <el-tree
                  ref="deptTreeRef"
                  v-model="depts"
                  node-key="id"
                  :data="deptTreeData"
                  :render-after-expand="false"
                  :expand-on-click-node="false"
                  :check-strictly="true"
                  :default-expanded-keys="defaultExpandedDept"
                  :default-checked-keys="defaultCheckedDept"
                  show-checkbox
                  :props="{ label: 'orgName', children: 'children' }"
                  @check-change="handleDeptCheck"
                />
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="t('workflow.process.role')"
            name="role"
            v-if="type.indexOf('role') != -1"
          >
            <div class="select-card">
              <el-tree
                ref="roleTreeRef"
                node-key="id"
                v-model="roles"
                show-checkbox
                :data="roleTreeList"
                :expand-on-click-node="true"
                :render-after-expand="false"
                :default-expanded-keys="defaultExpandedRole"
                :default-checked-keys="defaultCheckedRole"
                :props="{
                  label: 'name',
                  children: 'children',
                }"
                @check-change="handleRoleCheck"
              >
              </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="t('workflow.process.form')" name="form">
            <div class="select-card" style="padding-left: 10px">
              <el-checkbox-group v-model="forms" @change="handleFormCheckChange">
                <el-checkbox
                  :key="formItem.id"
                  :label="formItem.title"
                  :value="formItem.id"
                  v-for="formItem in _flatFormItems"
                />
              </el-checkbox-group>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { deptListApi } from '@/api/sys/dept';
  import { selectUsersByDeptIdsApi } from '@/api/sys/user';
  import { roleTreeListApi } from '@/api/workflow/auth';
  import { isNotEmpty } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { useI18n } from 'vue-i18n';
  import { flatFormItems } from '@/utils/workflow';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { title } from 'process';

  // 国际化
  const { t } = useI18n();
  // 回调函数
  const emits = defineEmits(['submit', 'close']);
  // 属性
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Array<String>,
      default: ['user', 'dept', 'role'],
    },
    nodeKey: {
      type: String,
      default: 'id',
    },
    nodeLabel: {
      type: String,
      default: 'name',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  });
  // 是否展示
  const visible = ref(false);
  // 部门树ref
  const deptTreeRef = ref();
  // 角色数ref
  const roleTreeRef = ref();
  // tab选中
  const activeName = ref<string>('user');
  // 选中的标签
  const selectedTags = ref<Array<any>>([]);
  // 人员的值
  const users = ref<Array<any>>([]);
  // 人员树数据
  const userTreeData = ref<Dept.DeptInfo[]>([]);
  // 默认展开的人员
  const defaultExpandedUser = ref<string[]>([]);
  // 部门树数据
  const deptTreeData = ref<Dept.DeptInfo[]>([]);
  // 选中的部门
  const depts = ref<Array<any>>([]);
  // 选中的角色
  const roles = ref<Array<any>>([]);
  // 默认展开的部门
  const defaultExpandedDept = ref<string[]>([]);
  // 默认选中的部门
  const defaultCheckedDept = ref<string[]>([]);
  // 默认选中的角色
  const defaultCheckedRole = ref<string[]>([]);
  // 默认展开的角色分组
  const defaultExpandedRole = ref<string[]>([]);
  // 选中的人员
  const checkedUsers = ref<Array<any>>([]);
  // 所有人员
  const userList = ref<Array<User.UserInfo>>([]);
  // 角色树
  const roleTreeList = ref<WorkAuth.RoleInfo[]>([]);
  // 表单组件
  const forms = ref<Array<any>>([]);

  // 工作流store
  const workFlowStore = useWorkFlowStore();

  // 获取选人组件
  const _flatFormItems = computed(() => {
    const items = flatFormItems(workFlowStore.design.formItems);
    let formItems = items.filter((item: any) => {
      return item.name == 'UserPicker';
    });
    formItems.unshift({ id: 'owner', title: '发起人' });
    return formItems;
  });

  /**
   * 查询部门树数据
   */
  const queryDeptTree = async () => {
    await deptListApi({ status: '0', pageNum: 1, pageSize: 5000 }).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        let deptData = res.data;
        // 部门树数据
        deptTreeData.value = deptData;
        // 用户部门树数据
        userTreeData.value = deptData;
        defaultExpandedDept.value = [];
        defaultExpandedUser.value = [];
        if (isNotEmpty(deptData)) {
          // 循环设置默认展开
          deptData.forEach((deptItem) => {
            if (deptItem.id) {
              // 部门默认展开
              defaultExpandedDept.value.push(deptItem.id);
              // 用户默认展开
              defaultExpandedUser.value.push(deptItem.id);
            }
          });
        }
      }
    });
  };

  /**
   * @description: 根据部门id批量查询用户信息
   * @param {*} ids 部门id集合
   * @return {*}
   */
  const getUsersByDeptIds = async (ids: string[]) => {
    await selectUsersByDeptIdsApi(ids).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        const userData = res.data;
        userList.value = userData;
      }
    });
  };

  /**
   * 点击用户tab栏中的部门树
   */
  const handleDeptClick = async (e: any) => {
    await getUsersByDeptIds([e.id]);
  };

  /**
   * 点击部门tab栏中的部门树
   */
  const handleDeptCheck = (value: any, checked: boolean) => {
    let checkedNodes = deptTreeRef.value.getCheckedNodes();
    // console.info('handleDeptCheck', checkedNodes);
    if (isNotEmpty(checkedNodes)) {
      if (!props.multiple) {
        if (checked) {
          selectedTags.value = [];
          deptTreeRef.value.setCheckedKeys([value.id]);
        }
        checkedNodes = [checkedNodes[checkedNodes.length - 1]];
      }
    }
    // 处理选中的部门
    handleTags(checkedNodes);
  };

  /**
   * 处理角色树选中
   * @param value 选中的对象
   * @param checked 是否选中
   */
  const handleRoleCheck = (value: any, checked: boolean) => {
    // let checkedNodes = roleTreeRef.value.getCheckedNodes();
    if (checked && value.pid != 0) {
      let node = {};
      node[props.nodeKey] = value.id;
      node[props.nodeLabel] = value.name;
      node['type'] = 'role';
      selectedTags.value.push(node);
    } else {
      selectedTags.value.forEach((item, index) => {
        if (item.type === 'role' && item[props.nodeKey] == value.id) {
          selectedTags.value.splice(index, 1);
        }
      });
    }
  };

  /**
   * 处理选中的单位
   * @param checkedNodes 所有选中的单位
   */
  const handleTags = (checkedNodes: Array<any>) => {
    let tagIds = selectedTags.value.map((tagItem) => {
      if (tagItem.type == 'dept') {
        return tagItem[props.nodeKey];
      }
    });
    for (let i = 0; i < checkedNodes.length; i++) {
      if (tagIds.indexOf(checkedNodes[i].id) == -1) {
        let node = {};
        node[props.nodeKey] = checkedNodes[i].id;
        node[props.nodeLabel] = checkedNodes[i].orgName;
        node['type'] = 'dept';
        selectedTags.value.push(node);
      }
    }

    let nodeIdList = checkedNodes.map((nodeItem) => {
      return nodeItem.id;
    });

    selectedTags.value.forEach((item, index) => {
      if (item.type === 'dept' && nodeIdList.indexOf(item[props.nodeKey]) == -1) {
        selectedTags.value.splice(index, 1);
      }
    });
  };

  /**
   * 处理人员选中
   * @param values 所有选中的人员id集合
   */
  const handleUserCheckChange = (values: any) => {
    if (isNotEmpty(values)) {
      if (!props.multiple) {
        selectedTags.value = [];
        let multipleValue = [values[values.length - 1]];
        checkedUsers.value = multipleValue;
        values = multipleValue;
      }
      let userTagIds = selectedTags.value.map((tagItem) => {
        if (tagItem.type === 'user') {
          return tagItem[props.nodeKey];
        }
      });
      values.forEach((userId: string) => {
        userList.value.forEach((userItem) => {
          if (userItem.id === userId && userTagIds.indexOf(userItem.id) == -1) {
            let node = {};
            node[props.nodeKey] = userItem.id;
            node[props.nodeLabel] = isNotEmpty(userItem.realName)
              ? userItem.realName
              : userItem.nickName;
            node['type'] = 'user';
            selectedTags.value.push(node);
          }
        });
      });

      selectedTags.value.forEach((item, index) => {
        if (item.type === 'user' && values.indexOf(item[props.nodeKey]) == -1) {
          selectedTags.value.splice(index, 1);
        }
      });
    }
  };

  /**
   * 加载角色树
   */
  const loadRoleTreeList = async () => {
    roleTreeList.value = [];
    await roleTreeListApi({}).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        roleTreeList.value = res.data;
      }
    });
  };

  /**
   * 删除已选择
   */
  const removeTag = (tag: any) => {
    if (tag.type === 'user') {
      if (checkedUsers.value.indexOf(tag.id) != -1) {
        checkedUsers.value.splice(checkedUsers.value.indexOf(tag.id), 1);
      }
    } else if (tag.type === 'dept') {
      deptTreeRef.value.setChecked(tag.id, false, false);
    } else if (tag.type === 'role') {
      roleTreeRef.value.setChecked(tag.id, false, false);
    } else if (tag.type === 'form') {
      if (forms.value.indexOf(tag.id) != -1) {
        forms.value.splice(forms.value.indexOf(tag.id), 1);
      }
    }
    selectedTags.value = selectedTags.value.filter(
      (item) => item[props.nodeKey] !== tag[props.nodeKey],
    );
  };

  /**
   * 提交
   */
  const submit = () => {
    emits('submit', selectedTags.value);
    visible.value = false;
  };

  const closeSelect = () => {
    emits('close');
    visible.value = false;
  };

  /**
   * 处理点击表单组件
   * @param value
   */
  const handleFormCheckChange = (value: any) => {
    // 获取当前已选择的标签
    let currentSelectTags = selectedTags.value;
    // 获取当前已选择的表单标签id
    let itemIdList = currentSelectTags
      .filter((item: any) => {
        return item.type === 'form';
      })
      .map((item: any) => {
        return item.id;
      });

    // 去掉未选择的表单标签
    selectedTags.value = currentSelectTags.filter((item: any) => {
      // 当前标签是表单类型并且当前id被选择
      return item.type != 'form' || (item.type == 'form' && value.indexOf(item.id) != -1);
    });

    value.forEach((fieldId: string) => {
      // 说明当前已选标签中没有
      if (itemIdList.indexOf(fieldId) == -1) {
        let formComponents = _flatFormItems.value.filter((item: any) => {
          return item.id == fieldId;
        });
        if (isNotEmpty(formComponents)) {
          let formFiled = formComponents[0];
          let node = {};
          node['id'] = formFiled.id;
          node['name'] = formFiled.title;
          node['type'] = 'form';
          selectedTags.value.push(node);
        }
      }
    });
  };

  /**
   * 初始化
   */
  const init = async () => {
    await queryDeptTree();
    await loadRoleTreeList();
    selectedTags.value = [];
    users.value = [];
    depts.value = [];
    forms.value = [];
    // roleTreeList.value = [];
    checkedUsers.value = [];
    defaultCheckedDept.value = [];
    defaultCheckedRole.value = [];
    if (props.value && isNotEmpty(props.value)) {
      selectedTags.value = props.value;
      // console.info(selectedTags.value);
      selectedTags.value.forEach((item) => {
        if (item.type === 'user') {
          users.value.push(item[props.nodeKey]);
          checkedUsers.value.push(item[props.nodeKey]);
        } else if (item.type === 'dept') {
          depts.value.push(item[props.nodeKey]);
          defaultCheckedDept.value.push(item[props.nodeKey]);
        } else if (item.type === 'role') {
          defaultCheckedRole.value.push(item[props.nodeKey]);
        } else if (item.type === 'form') {
          forms.value.push(item.id);
        }
      });
    }
    visible.value = true;
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .tab-container {
    margin-top: 20px;
  }

  ::v-deep(.tag-container .el-card__body) {
    padding: 7px !important;
    padding-left: 0px !important;
  }

  .select-card {
    height: 260px;
    border: 1px solid #e4e7ed;
    border-radius: 3px;
  }

  .select-user {
    width: 200px;
  }

  ::v-deep(.el-tag) {
    margin-left: 8px;
    margin-bottom: 8px;
  }
</style>
