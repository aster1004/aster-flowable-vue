<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-06-05 10:24:57
 * @FilePath: \aster-flowable-vue\src\views\workflow\list\list-render.vue
 * @Description: 列表渲染
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="table-box">
    <!-- 查询条件 -->
    <div class="card table-search" v-show="showSearch">
      <el-form
        ref="listQueryFormRef"
        :model="queryFormData"
        :inline="false"
        :label-position="_formInfo.labelPosition"
        :label-width="_formInfo.labelWidth"
      >
        <div class="grid-box">
          <div
            class="grid-column"
            v-for="(item, index) in _listSettings.queryItems"
            :key="index"
            v-show="index < 2 || !searchCollapsed"
          >
            <form-design-render
              v-model:value="queryFormData[item.id]"
              :ref="item.id"
              mode="search"
              :formData="queryFormData"
              :formItem="item"
            />
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
    <!-- 列表字段 -->
    <div class="card table-main">
      <!-- 表格头部 操作按钮 -->
      <div class="table-header">
        <div class="header-button-lf">
          <el-button type="primary" @click="handleAdd">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
          <el-button type="danger" @click="handleDelete()">
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
      <el-table ref="listTableRef" :data="dataList" :border="true" row-key="id">
        <el-table-column
          v-for="(item, index) in _listSettings.columns"
          :key="index"
          :prop="item.id"
          :label="item.title"
          header-align="center"
          align="center"
        />
      </el-table>
      <el-pagination
        :background="true"
        v-model:current-page="queryFormData.pageNum"
        v-model:page-size="queryFormData.pageSize"
        :page-sizes="[10, 25, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <form-initiation ref="formInitiationRef" />
  </div>
</template>
<script setup lang="ts">
  import { computed, PropType, reactive, ref, watch } from 'vue';
  import FormDesignRender from '../form/form-design-render.vue';
  import FormInitiation from '../form/form-initiation.vue';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { formInfoByCodeApi } from '@/api/workflow/form';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const props = defineProps({
    type: {
      type: String as PropType<'design' | 'list'>,
      default: () => 'design',
    },
    code: {
      type: String,
      default: () => '',
    },
    formId: {
      type: String,
      default: () => '',
    },
  });

  // 工作流store
  const workFlowStore = useWorkFlowStore();
  // 注册组件
  const formInitiationRef = ref();
  const listQueryFormRef = ref();

  // 是否显示查询
  const showSearch = ref(true);
  // 是否合并查询
  const searchCollapsed = ref(true);
  // 是否只读
  const readonly = ref(false);
  // 列表数据总数
  const total = ref(0);
  // 列表数据
  const dataList = ref<any[]>([]);
  // 查询条件
  const queryFormData = reactive<WorkForm.FormParams>({
    pageNum: 1,
    pageSize: 10,
  });

  /**
   * @description: 查询
   * @return {*}
   */
  const handleQuery = () => {
    if (isNotEmpty(props.code) && !readonly) {
    }
  };

  /**
   * @description: 重置查询
   * @return {*}
   */
  const resetQuery = () => {
    listQueryFormRef.value.resetFields();
    queryFormData.pageNum = 1;
    handleQuery();
  };

  /**
   * @description: 更改每页大小
   * @param {*} val
   * @return {*}
   */
  const handleSizeChange = (val: number) => {
    queryFormData.pageNum = 1;
    queryFormData.pageSize = val;
    handleQuery();
  };

  /**
   * @description: 更改页码
   * @param {*} val
   * @return {*}
   */
  const handleCurrentChange = (val: number) => {
    queryFormData.pageNum = val;
    handleQuery();
  };

  /**
   * @description: 新增
   * @return {*}
   */
  const handleAdd = () => {
    if (isEmpty(props.code) || isEmpty(props.formId)) {
      ElMessage.warning('请先选择左侧表单');
      return;
    }
    formInitiationRef.value.init(props.formId);
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
    // let val: any = [];
    // if (key) {
    //   val.push(key);
    // } else {
    //   val = selectedList.value?.map((item) => item.id);
    //   if (!val || val.length == 0) {
    //     ElMessage.warning(t('delete.empty'));
    //     return;
    //   }
    // }
    // ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
    //   confirmButtonText: t('button.confirm'),
    //   cancelButtonText: t('button.cancel'),
    //   type: 'warning',
    //   lockScroll: false,
    // })
    //   .then(() => {
    //     // formDeleteApi(val).then((res) => {
    //     //   if (res.code == ResultEnum.SUCCESS) {
    //     //     ElMessage.success(t('delete.success'));
    //     //     handleQuery();
    //     //   }
    //     // });
    //   })
    //   .catch(() => {});
  };

  // 列表设置内容
  const _listSettings = computed(() => {
    const settings = workFlowStore.design.listSettings;
    if (props.type === 'design') {
      readonly.value = true;
      // 从store中获取表单信息
      loadFormInfoByStore(settings.columns);
    }
    return settings;
  });

  // 表单基础信息
  const _formInfo = computed(() => {
    return {
      labelPosition: workFlowStore.design.labelPosition,
      labelWidth: workFlowStore.design.labelWidth,
    };
  });

  /**
   * @description: 从store中加载表单信息
   * @return {*}
   */
  const loadFormInfoByStore = async (columns: WorkComponent.ComponentConfig[]) => {
    // 模拟列表数据
    let data = {};
    columns.forEach((item) => {
      data[item.id] = '--';
    });
    dataList.value = [data, data, data];
    // 列表数据总数
    total.value = columns.length > 0 ? 3 : 0;
  };

  /**
   * @description: 根据code获取最新表单信息
   * @param {*} code 表单code
   * @return {*}
   */
  const loadFormInfoByCode = async (code: string) => {
    await formInfoByCodeApi(code).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        workFlowStore.design = res.data;
        // 如果表单没有配置列表设置，则默认配置
        if (res.data.listSettings == null) {
          workFlowStore.design.listSettings = {
            queryItems: [],
            columns: [],
            sortBy: 'create_time',
            sortDirection: 'desc',
            actions: [],
          };
        }
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  // 监听表单编码
  watch(
    () => props.code,
    (val) => {
      if (props.type == 'list' && isNotEmpty(val)) {
        readonly.value = false;
        // 根据code获取表单信息
        loadFormInfoByCode(val);
      }
    },
  );
</script>
<style scoped lang="scss"></style>
