<template>
  <el-drawer
    :append-to-body="true"
    :title="approverConfig.nodeName"
    v-model="visible"
    :show-close="false"
    :size="400"
    :before-close="saveApprover"
  >
    <el-form
      ref="nodeFormRef"
      style="max-width: 600px"
      :rules="[]"
      label-width="auto"
      label-position="top"
      status-icon
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="节点属性" name="nodeProps">
          <el-form-item label="节点ID" prop="id">
            <el-input readonly v-model="approverConfig.id" />
          </el-form-item>
          <el-form-item label="审核人" prop="approveUser">
            <el-input v-model="nodeForm.approveUser" readonly>
              <template #suffix>
                <i class="iconfont icon-xinzeng icon-primary" @click="openUserSelect" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="审批人为空时">
            <el-select v-model="nodeForm.noUser" placeholder="请选择">
              <el-option
                v-for="item in noUserOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="多人审批时审批方式">
            <el-select v-model="nodeForm.approveType" placeholder="请选择">
              <el-option
                v-for="item in approveTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="表单权限" name="formPermission">
          <el-table :data="formFieldData" style="width: 100%">
            <el-table-column prop="title" label="属性" />
            <el-table-column prop="edit" label="编辑" header-align="center" align="center">
              <template #header>
                <el-checkbox
                  label="编辑"
                  v-model="headerConfig.edit"
                  @change="checkedAll('edit')"
                />
              </template>
              <template #default="scope">
                <el-checkbox-group v-model="scope.row.operation" :max="1">
                  <el-checkbox value="edit" />
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="readonly" label="只读" header-align="center" align="center">
              <template #header>
                <el-checkbox
                  label="只读"
                  v-model="headerConfig.readonly"
                  @change="checkedAll('readonly')"
                />
              </template>
              <template #default="scope">
                <el-checkbox-group v-model="scope.row.operation" :max="1">
                  <el-checkbox value="readonly" />
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column prop="hidden" label="隐藏" header-align="center" align="center">
              <template #header>
                <el-checkbox
                  label="隐藏"
                  v-model="headerConfig.hidden"
                  @change="checkedAll('hidden')"
                />
              </template>
              <template #default="scope">
                <el-checkbox-group v-model="scope.row.operation" :max="1">
                  <el-checkbox value="hiddden" />
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="操作按钮" name="nodeButton">
          <el-table
            :data="buttonTableData"
            :show-header="false"
            :stripe="true"
            :border="true"
            style="width: 100%"
          >
            <el-table-column prop="operation" label="操作按钮" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  inline-prompt
                  active-text="开启"
                  inactive-text="关闭"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="saveApprover">确 定</el-button>
      <el-button @click="closeDrawer">取 消</el-button>
    </template>
    <range
      title="选择审批人"
      :visible="rangeVisible"
      v-if="rangeVisible"
      @closeRange="closeRange"
      :value="111111"
    />
  </el-drawer>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useStore } from '@/stores/index';
  import type { TabsPaneContext } from 'element-plus';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { flatFormItems } from '@/utils/workflow';
  import Range from '../../render/range.vue';

  let store = useStore();
  let { setApprover } = store;

  // 人员选择
  const rangeVisible = ref<boolean>(false);

  // let approverConfig = ref({});

  // 按钮数据
  const buttonTableData = ref([
    {
      operation: '同意',
      status: true,
    },
    {
      operation: '不同意',
      status: true,
    },
    {
      operation: '撤销',
      status: true,
    },
    {
      operation: '转交',
      status: true,
    },
    {
      operation: '加签',
      status: true,
    },
  ]);

  const approverConfig = ref<any>({});
  const approverConfig1 = computed(() => store.approverConfig1);

  watch(approverConfig1, (val) => {
    console.info('approverConfig:', val);
    approverConfig.value = val;
    approverConfig.value.id = val.value.id;
    console.info('approverConfig:', approverConfig.value);
  });

  let approverDrawer = computed(() => store.approverDrawer);

  const headerConfig = ref({
    required: false,
    edit: false,
    hidden: false,
    readonly: false,
  });

  /* const formFieldData = ref<any[]>([
     { fieldName: '原因', operation: ['edit'] },
     { fieldName: '日期', operation: ['hiddden'] },
   ]);
  */
  // 工作流store
  const workFlowStore = useWorkFlowStore();

  const formFieldData = computed(() => {
    let formItems = flatFormItems(workFlowStore.design.formItems);
    formItems.forEach((formItem: any) => {
      formItem.operation = ['edit'];
    });
    return formItems;
  });

  // 节点表单
  const nodeForm = ref({
    nodeId: '',
    nodeName: '',
    approveUser: '',
    noUser: 'autoPass',
    approveType: 'togetherCountersign',
  });

  // 没有人时节点处理方式
  const noUserOption = ref<Array<any>>([
    {
      value: 'autoPass',
      label: '自动通过',
    },
    {
      value: 'autoReject',
      label: '自动驳回',
    },
  ]);

  // 多人签批方式
  const approveTypeOption = ref<Array<any>>([
    {
      value: 'togetherCountersign',
      label: '会签(可同时审批，须全部同意)',
    },
    {
      value: 'orderCountersign',
      label: '会签(按选择顺序审批，须全部同意，不支持加签)',
    },
    {
      value: 'orSign',
      label: '或签(有一人同意即可)',
    },
  ]);

  let visible = computed({
    get() {
      return approverDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  // 选中的tab
  const activeName = ref<string>('nodeProps');

  const checkedAll = (field: string) => {
    console.info(field, headerConfig.value[field]);
    for (let key in headerConfig.value) {
      if (headerConfig.value[field]) {
        if (key !== field) {
          headerConfig.value[key] = false;
        }
      }
    }
    formFieldData.value.forEach((formField: any) => {
      formField.operation = headerConfig.value[field] ? [field] : [];
    });
  };

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event);
  };

  const saveApprover = () => {
    // 权限
    approverConfig.value.formPermission = formFieldData.value;
    console.info(formFieldData.value);
    console.info(approverConfig.value);
    // closeDrawer();
  };
  const closeDrawer = () => {
    setApprover(false);
  };

  /**
   * 打开选择审批人
   */
  const openUserSelect = () => {
    rangeVisible.value = true;
  };

  /**
   * 关闭审批人
   */
  const closeRange = () => {
    rangeVisible.value = false;
  };

  onMounted(() => {});
</script>
<style lang="scss"></style>
