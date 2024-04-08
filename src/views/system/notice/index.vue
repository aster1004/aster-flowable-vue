<template>
  <div class="table-box">
    <!-- 查询表单 -->
    <div class="card table-search" v-show="showSearch">
      <el-form ref="queryForm" :model="queryParams" :inline="false" @keyup.enter="handleQuery()">
        <div class="grid-box">
          <div class="grid-column">
            <el-form-item :label="$t('label.notice.title')" prop="title">
              <el-input
                v-model="queryParams.title"
                :placeholder="$t('placeholder.notice.title')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column">
            <el-form-item :label="$t('label.notice.type')" prop="type">
              <dict-select
                v-model="queryParams.type"
                dict-type="notice_type"
                :placeholder="$t('placeholder.notice.type')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="grid-column" v-show="!searchCollapsed">
            <el-form-item :label="$t('label.status')" prop="status">
              <dict-select
                v-model="queryParams.status"
                dict-type="status"
                :placeholder="$t('placeholder.status')"
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
          <el-button type="primary" v-hasPerm="['sys:notice:add']" @click="handleAdd">
            <i class="iconfont icon-xinzeng pr-5px"></i>{{ $t('button.add') }}
          </el-button>
          <el-button type="danger" v-hasPerm="['sys:notice:delete']" @click="handleDelete()">
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
      <el-table
        ref="tableRef"
        :data="dataList"
        :border="true"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" header-align="center" align="center" width="50" />
        <el-table-column
          prop="title"
          :label="$t('label.notice.title')"
          header-align="center"
          align="center"
        />
        <el-table-column
          prop="type"
          :label="$t('label.notice.type')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="notice_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          :label="$t('label.status')"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <dict-tag dict-type="status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('label.createTime')"
          header-align="center"
          align="center"
        />

        <el-table-column :label="$t('label.operate')" align="center" class-name="operation">
          <template #default="scope">
            <el-button
              size="small"
              link
              type="primary"
              @click="handlePublish(scope.row.id)"
              v-hasPerm="['sys:notice:edit']"
            >
              <i class="iconfont icon-fabu"></i>{{ $t('button.publish') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleEdit(scope.row.id)"
              v-hasPerm="['sys:notice:edit']"
            >
              <i class="iconfont icon-bianji"></i>{{ $t('button.edit') }}
            </el-button>
            <el-button
              size="small"
              link
              type="primary"
              @click="handleDelete(scope.row.id)"
              v-hasPerm="['sys:notice:delete']"
            >
              <i class="iconfont icon-shanchu"></i>{{ $t('button.delete') }}
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
    <!-- 新增/编辑 -->
    <add-or-edit v-if="showEdit" ref="addOrEditRef" @refresh="handleQuery" @close="closeEdit" />
    <!-- 发布 -->
    <publish ref="publishRef" />
  </div>
</template>
<script setup lang="ts">
  import { noticePageApi, noticeDeleteApi } from '@/api/sys/notice';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, reactive, onMounted, nextTick } from 'vue';
  import AddOrEdit from './add-or-edit.vue';
  import Publish from './publish.vue';
  import DictSelect from '@/components/dict/dict-select.vue';
  import DictTag from '@/components/dict/dict-tag.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  /** 注册组件 */
  const queryForm = ref();
  const addOrEditRef = ref();
  const publishRef = ref();
  /** 是否显示查询 */
  const showSearch = ref(true);
  const showEdit = ref(false);
  /** 默认折叠搜索项 */
  const searchCollapsed = ref(true);
  /** 查询条件 */
  const queryParams = reactive<Notice.NoticeParams>({
    title: '',
    type: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  });
  /** 数据列表 */
  const dataList = ref<Notice.NoticeInfo[]>();
  /** 总数 */
  const total = ref<number>(0);
  /** 已选择列表 */
  const selectedList = ref<Notice.NoticeInfo[]>();
  const loading = ref(true);

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
    noticePageApi(queryParams).then(({ data }) => {
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
  const handleSelectionChange = (val: Notice.NoticeInfo[]) => {
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
    showEdit.value = true;
    nextTick(() => {
      addOrEditRef.value.init();
    });
  };

  /**
   * @description: 修改
   * @param {string} key
   * @return {*}
   */
  const handleEdit = (key: string) => {
    showEdit.value = true;
    nextTick(() => {
      addOrEditRef.value.init(key);
    });
  };

  /**
   * 关闭新增/编辑
   */
  const closeEdit = () => {
    showEdit.value = false;
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
        noticeDeleteApi(val).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            ElMessage.success(t('delete.success'));
            handleQuery();
          }
        });
      })
      .catch(() => {});
  };

  /**
   * @description: 发布
   * @param {*} id 公告id
   * @return {*}
   */
  const handlePublish = (id: string) => {
    publishRef.value.init(id);
  };
</script>
<style lang="scss" scoped></style>
