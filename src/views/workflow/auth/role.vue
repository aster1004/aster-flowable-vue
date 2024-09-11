<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-08-30 10:56:55
 * @FilePath: \aster-flowable-vue\src\views\workflow\auth\role.vue
 * @Description: 流程角色管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card filter">
    <div class="card-header">
      <el-button type="primary" size="small" @click="addRole"> 新建角色 </el-button>
      <el-button type="primary" size="small" @click="addRoleGroup"> 新建角色组 </el-button>
    </div>
    <div class="card-body">
      <el-input class="pb-10px" v-model="filterText" placeholder="输入关键字进行过滤" clearable />
      <el-scrollbar style="height: calc(100% - 52px)">
        <el-tree
          ref="treeRef"
          node-key="id"
          :data="roleTreeList"
          :current-node-key="selectedRole"
          :accordion="true"
          :check-on-click-node="true"
          :highlight-current="true"
          :expand-on-click-node="true"
          :filter-node-method="filterRole"
          :draggable="true"
          :props="{
            label: 'name',
            children: 'children',
          }"
          :allow-drag="handleAllowDrag"
          :allow-drop="handleAllowDrop"
          @node-drop="handleDrop"
        >
          <template #default="{ data }">
            <div class="card-label">
              <span
                @click="handleRoleClick(data)"
                :style="{ width: data.type != 'default' ? '70%' : '100%' }"
              >
                {{ data.name }}
              </span>
              <span class="card-operation" v-if="data.type != 'default'">
                <i class="iconfont icon-shezhi !text-sm pr-10px" @click="handleEdit(data)"></i>
                <i class="iconfont icon-shanchu !text-sm" @click="handleDelete(data)"></i>
              </span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>

    <el-dialog v-model="visible" :title="title" width="30%" :lock-scroll="false">
      <el-form ref="formRef" :model="roleInfo" :rules="rules" label-width="80px">
        <template v-if="type === 'role'">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleInfo.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="所属分组" prop="pid">
            <el-select v-model="roleInfo.pid" placeholder="请选择所属分组">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="roleInfo.name" placeholder="请输入分组名称" />
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
        <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { nextTick, onBeforeMount, reactive, ref, watch } from 'vue';
  import {
    roleGroupApi,
    roleTreeListApi,
    roleSaveApi,
    roleDeleteApi,
    roleSortApi,
  } from '@/api/workflow/auth';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { isNotEmpty } from '@/utils';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emits = defineEmits(['change']);

  // 注册组件
  const treeRef = ref();
  const formRef = ref();
  // 角色树
  const roleTreeList = ref<WorkAuth.RoleInfo[]>([]);
  // 角色分组
  const groupList = ref<WorkAuth.RoleInfo[]>([]);
  // 选中的角色
  const selectedRole = ref<string>('');
  // 过滤条件
  const filterText = ref('');
  // 角色信息
  const roleInfo = ref<WorkAuth.RoleInfo>({
    name: '',
  });
  // 显示弹窗
  const visible = ref(false);
  // 弹窗标题
  const title = ref('新增角色');
  // 弹窗类型
  const type = ref<'role' | 'group'>('role');
  // 校验规则
  const rules = reactive({
    name: [
      {
        required: true,
        message: '请输入角色名称',
        trigger: 'blur',
      },
    ],
    pid: [
      {
        required: true,
        message: '请选择所属分组',
        trigger: 'change',
      },
    ],
  });

  /**
   * @description: 新增角色
   * @return {*}
   */
  const addRole = () => {
    title.value = '新增角色';
    type.value = 'role';
    roleInfo.value = {
      name: '',
    };
    visible.value = true;
  };

  /**
   * @description: 新增角色组
   * @return {*}
   */
  const addRoleGroup = () => {
    title.value = '新增角色组';
    type.value = 'group';
    roleInfo.value = {
      name: '',
    };
    visible.value = true;
  };

  /**
   * @description: 编辑角色或角色组
   * @param {WorkAuth.RoleInfo} node
   * @return {*}
   */
  const handleEdit = (node: WorkAuth.RoleInfo) => {
    roleInfo.value = { ...node };
    if (node.pid && node.pid != '0') {
      title.value = '编辑角色';
      type.value = 'role';
    } else {
      title.value = '编辑角色组';
      type.value = 'group';
    }
    visible.value = true;
  };

  /**
   * @description: 删除角色或角色组
   * @param {WorkAuth.RoleInfo} node
   * @return {*}
   */
  const handleDelete = (node: WorkAuth.RoleInfo) => {
    if (!node.id) {
      return ElMessage.error('请选择要删除的角色或角色组');
    }
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        const ids = [node.id];
        roleDeleteApi(ids).then((res) => {
          if (res.code === ResultEnum.SUCCESS) {
            ElMessage.success('操作成功');
            // 重新加载角色树
            loadTreeList();
            // 加载角色分组
            loadGroupList();
          } else {
            ElMessage.error('操作失败');
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 排序
   * @return {*}
   */
  const handleSort = async (sorts: WorkAuth.RoleInfo[]) => {
    if (!sorts || sorts.length === 0) {
      return;
    }
    await roleSortApi(sorts).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        ElMessage.success('操作成功');
      } else {
        ElMessage.error('操作失败');
      }
    });
  };

  /**
   * @description: 提交表单
   * @return {*}
   */
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        roleSaveApi(roleInfo.value).then((res) => {
          if (res.code === ResultEnum.SUCCESS) {
            ElMessage.success('操作成功');
            // 重新加载角色树
            loadTreeList();
            // 加载角色分组
            loadGroupList();
          } else {
            ElMessage.error('操作失败');
          }
          visible.value = false;
        });
      } else {
        ElMessage.error('校验失败');
      }
    });
  };

  /**
   * @description: 过滤角色
   * @param {string} value
   * @param {*} data
   * @param {*} node
   * @return {*}
   */
  const filterRole = (value: string, _data: { [key: string]: any }, node: any) => {
    if (!value) return true;
    let parentNode = node.parent,
      labels = [node.label],
      level = 1;
    while (level < node.level) {
      labels = [...labels, parentNode.label];
      parentNode = parentNode.parent;
      level++;
    }
    return labels.some((label) => label.indexOf(value) !== -1);
  };

  /**
   * @description: 点击角色
   * @param {*}
   * @return {*}
   */
  const handleRoleClick = (node: WorkAuth.RoleInfo) => {
    if (node.pid && node.pid != '0' && node.id && isNotEmpty(node.id)) {
      emits('change', node);
    }
  };

  /**
   * @description: 判断节点是否可拖拽
   * @param {*}
   * @return {*}
   */
  const handleAllowDrag = () => {
    return true;
  };

  /**
   * @description: 判断节点是否可放置
   * @param {*}
   * @return {*}
   */
  const handleAllowDrop = (draggingNode: any, dropNode: any, type: string) => {
    if (type === 'inner') {
      return false;
    }
    if (draggingNode.data.pid === dropNode.data.pid) {
      return true;
    }
    return false;
  };

  /**
   * @description: 拖拽结束
   * @param {*}
   * @return {*}
   */
  const handleDrop = async (draggingNode: any, dropNode: any, type: string) => {
    console.log(draggingNode, dropNode, type);
    let sorts: WorkAuth.RoleInfo[] = [];
    // 若是分组顺序调整
    if (draggingNode.data.pid === '0') {
      sorts = roleTreeList.value.map((item: WorkAuth.RoleInfo, index: number) => {
        return { id: item.id, name: item.name, sort: index + 1 };
      });
    } else {
      // 若是角色顺序调整
      const parentNode = dropNode.parent.data;
      if (parentNode && isNotEmpty(parentNode.id)) {
        sorts = parentNode.children.map((item: WorkAuth.RoleInfo, index: number) => {
          return { id: item.id, name: item.name, sort: index + 1 };
        });
      } else {
        sorts = roleTreeList.value
          .filter((item: WorkAuth.RoleInfo) => item.pid != '0')
          .map((item: WorkAuth.RoleInfo, index: number) => {
            return { id: item.id, name: item.name, sort: index + 1 };
          });
      }
    }
    await handleSort(sorts);
  };

  /**
   * @description: 加载角色树
   * @return {*}
   */
  const loadTreeList = async () => {
    await roleTreeListApi({}).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        roleTreeList.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 加载角色分组
   * @return {*}
   */
  const loadGroupList = async () => {
    await roleGroupApi().then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        groupList.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  onBeforeMount(() => {
    // 加载角色树
    loadTreeList();
    // 加载角色分组
    loadGroupList();
  });

  watch(
    () => roleTreeList.value,
    (val) => {
      if (val && val.length > 0) {
        nextTick(() => {
          // 设置默认选中
          const currentNode = roleTreeList.value[0].children
            ? roleTreeList.value[0].children[0]
            : { id: '', name: '' };
          if (currentNode && currentNode.id) {
            selectedRole.value = currentNode.id;
            // 触发点击事件
            handleRoleClick(currentNode);
          }
        });
      }
    },
  );

  /**
   * @description: 监听过滤条件
   * @return {*}
   */
  watch(filterText, (val) => {
    treeRef.value!.filter(val);
  });
</script>
<style scoped lang="scss">
  .filter {
    box-sizing: border-box;
    width: 220px;
    height: 100%;
    padding: 20px 18px 10px;
    margin-right: 10px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 15px;
  }

  .card-body {
    height: calc(100% - 40px);

    .card-label {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 12px;

      .card-operation {
        display: none;
      }
    }

    .el-tree-node__content:hover .card-operation {
      display: inline-block;
    }
  }
</style>
