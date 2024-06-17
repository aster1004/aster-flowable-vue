<template>
  <el-drawer
    :append-to-body="true"
    :title="approverConfig.value.nodeName"
    v-model="visible"
    :show-close="false"
    :size="450"
    :before-close="saveApprover"
  >
    <el-form
      ref="nodeFormRef"
      style="max-width: 600px"
      :rules="[]"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="节点属性" name="nodeProps">
          <el-form-item label="节点ID" prop="nodeId">
            <el-input readonly v-model="approverConfig.id" />
          </el-form-item>
          <el-form-item label="审核人" prop="nodeId">
            <el-input v-model="nodeForm.nodeId" readonly>
              <template #suffix>
                <i class="iconfont icon-xinzeng icon-primary" />
              </template>
            </el-input>
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
      </el-tabs>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="saveApprover">确 定</el-button>
      <el-button @click="closeDrawer">取 消</el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useStore } from '@/stores/index';
  import type { TabsPaneContext } from 'element-plus';
  import { useWorkFlowStore } from '@/stores/modules/workflow';
  import { flatFormItems } from '@/utils/workflow';

  let store = useStore();
  let { setApprover } = store;

  // let approverConfig = ref({});

  let approverConfig = ref<any>({});
  let approverConfig1 = computed(() => store.approverConfig1);

  watch(approverConfig1, (val) => {
    console.info('approverConfig:', val);
    approverConfig.value = val;
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

  const nodeForm = ref({
    nodeId: '',
  });

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

  onMounted(() => {});
</script>
<style lang="scss"></style>
