<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-05-23 11:05:49
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\render\range.vue
 * @Description: 评分
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog v-model="props.visible" :title="props.title" @closed="closeRange">
    <div class="rang-container">
      <div class="tag-container">
        <el-card shadow="never" style="min-height: 100px">
          <el-tag type="danger" style="margin-left: 8px">张三</el-tag>
          <el-tag type="danger" style="margin-left: 8px">经管中心</el-tag>
          <el-tag type="danger" style="margin-left: 8px">管理员</el-tag>
        </el-card>
      </div>
      <div class="tab-container">
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户" name="user">
            <el-card class="select-card" shadow="never">
              <el-tree
                v-model="users"
                :data="userTreeData"
                :render-after-expand="false"
                show-checkbox
                :props="{ label: 'orgName', children: 'children' }"
              />
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="单位" name="dept">
            <el-card class="select-card" shadow="never">
              <el-tree
                v-model="users"
                :data="userTreeData"
                :render-after-expand="false"
                show-checkbox
              />
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="角色" name="role">
            <el-card class="select-card" shadow="never">
              <el-tree
                v-model="users"
                :data="userTreeData"
                :render-after-expand="false"
                show-checkbox
              />
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { deptListApi } from '@/api/sys/dept';

  const emit = defineEmits(['closeRange']);
  const props = defineProps({
    visible: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
  });

  const activeName = ref<string>('user');

  const users = ref<Array<any>>([]);

  const userTreeData = ref<Dept.DeptInfo[]>([]);

  const queryDeptTree = () => {
    deptListApi({ status: '0', pageNum: 1, pageSize: 500 }).then((res) => {
      console.info('部门：', res);
      // userTreeData.value = res;
    });
  };

  const closeRange = () => {
    emit('closeRange');
  };

  onMounted(() => {
    queryDeptTree();
  });

  defineExpose({});
</script>
<style scoped lang="scss">
  .tab-container {
    margin-top: 20px;
  }

  ::v-deep .tag-container .el-card__body {
    padding: 7px !important;
    padding-left: 0px !important;
  }

  .select-card {
    height: 260px;
  }
</style>
