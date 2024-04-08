<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-17 10:10:19
 * @FilePath: \aster-admin\src\views\system\menu\index.vue
 * @Description: 菜单管理
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.menu.name')" prop="name">
              <el-input
                v-model="queryParams.name"
                :placeholder="$t('placeholder.menu.name')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.menu.status')" prop="status">
              <dict-select
                v-model="queryParams.status"
                dict-type="status"
                clearable
                :placeholder="$t('placeholder.status')"
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="$t('label.menu.path')" prop="path">
              <el-input
                v-model="queryParams.path"
                :placeholder="$t('placeholder.menu.path')"
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
        <div class="header-button-lf">
          <el-button type="primary" v-hasPerm="['sys:menu:add']" @click="handleAdd()">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
        </div>
        <div v-if="toolButton" class="header-button-ri">
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
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="name"
          :label="$t('label.menu.name')"
          :show-overflow-tooltip="true"
          header-align="center"
          width="160"
        />
        <el-table-column
          prop="icon"
          :label="$t('label.menu.icon')"
          header-align="center"
          align="center"
          width="80"
        >
          <template #default="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          :label="$t('label.menu.type')"
          header-align="center"
          align="center"
          width="80"
        >
          <template #default="scope">
            <dict-tag dict-type="menu_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          :label="$t('label.sort')"
          header-align="center"
          align="center"
          width="60"
        />
        <el-table-column
          prop="perms"
          :label="$t('label.menu.perms')"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="component"
          :label="$t('label.menu.component')"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="status" :label="$t('label.status')" align="center" width="80">
          <template #default="scope">
            <dict-tag dict-type="status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('label.createTime')"
          align="center"
          prop="createTime"
          width="180"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('label.operate')"
          width="180"
          align="center"
          class-name="operation"
        >
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handleEdit(scope.row)"
              v-hasPerm="['sys:menu:edit']"
            >
              <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleAdd(scope.row)"
              v-hasPerm="['sys:menu:add']"
              ><i class="iconfont icon-xinzeng"></i>{{ $t('button.add') }}</el-button
            >
            <el-button
              size="small"
              link
              type="primary"
              @click="handleDelete(scope.row)"
              v-hasPerm="['sys:menu:delete']"
              ><i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-or-edit ref="addOrEditRef" @refresh="handleQuery" />
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { menuListApi, menuDeleteApi } from '@/api/sys/menu';
  import { parseTime } from '@/utils';
  import AddOrEdit from './add-or-edit.vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const queryForm = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Menu.MenuParams>({
    name: '',
    path: '',
    status: '',
  });
  /** 菜单列表 */
  const menuList = ref<Menu.MenuOptions[]>();
  /** 重新渲染表格状态 */
  const refreshTable = ref(true);
  const loading = ref(true);
  /** 是否展开，默认全部折叠 */
  const isExpandAll = ref(false);
  /** 是否显示功能菜单 */
  const toolButton = ref(true);

  const addOrEditRef = ref();

  onMounted(() => {
    handleQuery();
  });

  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = () => {
    queryForm.value.resetFields();
    handleQuery();
  };

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    loading.value = true;
    menuListApi(queryParams).then(({ data }) => {
      menuList.value = data;
      loading.value = false;
    });
  };

  /**
   * @description: 修改
   * @return {*}
   */
  const handleEdit = (menu: Menu.MenuOptions) => {
    addOrEditRef.value.init('edit', menu);
  };

  /**
   * @description: 添加
   * @return {*}
   */
  const handleAdd = (menu?: Menu.MenuOptions) => {
    addOrEditRef.value.init('add', menu ? menu : null);
  };

  /**
   * @description: 删除
   * @return {*}
   */
  const handleDelete = (menu: Menu.MenuOptions) => {
    ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
      confirmButtonText: t('button.confirm'),
      cancelButtonText: t('button.cancel'),
      type: 'warning',
      lockScroll: false,
    })
      .then(() => {
        menuDeleteApi(menu.id).then(() => {
          ElMessage.success(t('delete.success'));
          handleQuery();
        });
      })
      .catch(() => {});
  };
</script>
<style lang="scss" scoped>
  :deep(.operation .cell) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
  }
  :deep(.operation .el-button--small) {
    padding: 5px;

    i {
      font-size: 12px;
    }
  }
</style>
