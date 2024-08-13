<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 11:05:49
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\range.vue
 * @Description: 评分
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog v-model="visible" :title="props.title" @closed="closeRange">
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
            &nbsp;{{ tagItem.name }}
          </el-tag>
          <!-- <el-tag type="danger" class="select-tag" closable><i class="iconfont icon-yonghu"></i>&nbsp;张三</el-tag>
          <el-tag type="danger" class="select-tag" closable><i class="iconfont icon-jigou1"></i>&nbsp;经管中心</el-tag> -->
        </el-card>
      </div>
      <div class="tab-container">
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户" name="user">
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
                        <el-checkbox :label="userItem.realName" :value="userItem.id" />
                      </div>
                    </el-scrollbar>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="单位" name="dept">
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
                  @check="handleDeptCheck"
                />
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="角色" name="role">
            <div class="select-card"> </div>
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
  import { ref, onMounted } from 'vue';
  import { deptListApi } from '@/api/sys/dept';
  import { selectUsersByDeptIdsApi } from '@/api/sys/user';
  import { isNotEmpty } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { valueEquals } from 'element-plus';
  // 回调函数
  const emit = defineEmits(['closeRange', 'submit']);
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
  });
  // 是否展示
  const visible = ref(false);
  // 部门树ref
  const deptTreeRef = ref();
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
  // 默认展开的部门
  const defaultExpandedDept = ref<string[]>([]);
  // 默认选中的部门
  const defaultCheckedDept = ref<string[]>([]);
  // 选中的人员
  const checkedUsers = ref<Array<any>>([]);
  // 所有人员
  const userList = ref<Array<User.UserInfo>>([]);

  /**
   * 查询部门树数据
   */
  const queryDeptTree = async () => {
    deptListApi({ status: '0', pageNum: 1, pageSize: 500 }).then((res) => {
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
  const handleDeptClick = (e: any) => {
    getUsersByDeptIds([e.id]);
  };

  /**
   * 点击部门tab栏中的部门树
   */
  const handleDeptCheck = () => {
    let checkedNodes = deptTreeRef.value.getCheckedNodes();
    // 处理选中的部门
    handleTags(checkedNodes);
  };

  /**
   * 处理选中的单位
   * @param checkedNodes 所有选中的单位
   */
  const handleTags = (checkedNodes: Array<any>) => {
    let tagIds = selectedTags.value.map((tagItem) => {
      if (tagItem.type == 'dept') {
        return tagItem.id;
      }
    });
    for (let i = 0; i < checkedNodes.length; i++) {
      if (tagIds.indexOf(checkedNodes[i].id) == -1) {
        selectedTags.value.push({
          id: checkedNodes[i].id,
          name: checkedNodes[i].orgName,
          type: 'dept',
        });
      }
    }

    let nodeIdList = checkedNodes.map((nodeItem) => {
      return nodeItem.id;
    });

    selectedTags.value.forEach((item, index) => {
      if (item.type === 'dept' && nodeIdList.indexOf(item.id) == -1) {
        selectedTags.value.splice(index, 1);
      }
    });
  };

  /**
   * 删除已选择
   */
  const removeTag = (tag: any) => {
    console.info('tag：', tag);
  };

  /**
   * 关闭
   */
  const closeRange = () => {
    emit('closeRange');
  };

  /**
   * 处理人员选中
   * @param values 所有选中的人员id集合
   */
  const handleUserCheckChange = (values: any) => {
    if (isNotEmpty(values)) {
      let userTagIds = selectedTags.value.map((tagItem) => {
        if (tagItem.type === 'user') {
          return tagItem.id;
        }
      });
      values.forEach((userId) => {
        userList.value.forEach((userItem) => {
          if (userItem.id === userId && userTagIds.indexOf(userItem.id) == -1) {
            selectedTags.value.push({
              id: userItem.id,
              name: userItem.realName,
              type: 'user',
            });
          }
        });
      });

      selectedTags.value.forEach((item, index) => {
        if (item.type === 'user' && values.indexOf(item.id) == -1) {
          selectedTags.value.splice(index, 1);
        }
      });
    }
  };

  const submit = () => {
    emit('submit', selectedTags.value);
    visible.value = false;
  };

  onMounted(async () => {
    await queryDeptTree();
    users.value = [];
    depts.value = [];
    if (isNotEmpty(props.value)) {
      selectedTags.value = props.value;
      selectedTags.value.forEach((item) => {
        if (item.type === 'user') {
          users.value.push(item.id);
        } else if (item.type === 'dept') {
          depts.value.push(item.id);
        }
      });
    }
    visible.value = true;
  });

  defineExpose({});
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
