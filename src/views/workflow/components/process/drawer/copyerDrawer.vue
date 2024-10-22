<!--
 * @Date: 2022-08-25 14:05:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-12 14:58:23
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\process\drawer\copyerDrawer.vue
-->
<template>
  <el-drawer
    :append-to-body="true"
    v-model="visible"
    :show-close="false"
    :size="550"
    :before-close="saveCopyer"
  >
    <template #header>
      <el-input
        v-if="editFlag"
        v-model="copyerConfig.value.nodeName"
        placeholder="请输入节点名称"
        @blur="editFlag = false"
      />
      <div class="custom-title" v-else>
        <div>{{ _nodeName }}</div>
        <i class="iconfont icon-bianji icon-primary" @click="editFlag = true"></i>
      </div>
    </template>
    <el-form
      ref="nodeFormRef"
      style="max-width: 600px"
      :rules="[]"
      label-width="auto"
      label-position="top"
      status-icon
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="节点属性" name="nodeProps">
          <el-form-item label="节点ID" prop="id">
            <el-input readonly v-model="copyerConfig.id" />
          </el-form-item>
          <el-form-item label="抄送人" prop="approveUser">
            <el-input :value="approveUserText" readonly @click="openUserSelect">
              <template #suffix>
                <i class="iconfont icon-xinzeng icon-primary" @click="openUserSelect" />
              </template>
            </el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="表单权限" name="formPermission">
          <form-permission
            v-model:value="copyerConfig.value.formPermission"
            :headerConfig="headerConfig"
          />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- <template #footer>
      <el-button type="primary" @click="saveCopyer">确 定</el-button>
      <el-button @click="closeDrawer">取 消</el-button>
    </template> -->
    <member-select
      ref="memberSelectRef"
      title="选择审批人"
      :value="copyerConfig.value.nodeUserList"
      @submit="handleSubmitMember"
    />
  </el-drawer>
</template>
<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { processStore } from '@/stores/modules/process';
  import MemberSelect from '../../common/member-select.vue';
  import { isNotEmpty } from '@/utils';
  import FormPermission from '../permission/form-permission.vue';
  import { getFormFieldData } from '@/utils/process/process';

  let store = processStore();
  let { setCopyerConfig, setCopyer } = store;

  // 编辑状态
  const editFlag = ref<boolean>(false);
  // 注册组件
  const memberSelectRef = ref();
  // 当前审核节点的配置
  const copyerConfig = ref<any>({});

  // store中的审核节点配置
  const copyerConfig1 = computed(() => store.copyerConfig1);

  // 审核节点标题
  const _nodeName = computed(() => {
    const config = JSON.parse(JSON.stringify(store.copyerConfig1));
    if (config && config.value) {
      return config.value.nodeName;
    }
    return '';
  });

  // 审批人文本
  const approveUserText = computed(() => {
    let expression = '';
    let val = copyerConfig.value.value.nodeUserList;
    if (isNotEmpty(val)) {
      expression = val
        .map((v: any) => {
          if (v.type === 'user') {
            return '{用户：' + v.name + '}';
          } else if (v.type === 'dept') {
            return '{部门：' + v.name + '}';
          } else {
            return '';
          }
        })
        .join(',');
    }
    return expression;
  });

  // 监听审核节点配置
  watch(
    () => copyerConfig1.value,
    (val) => {
      // console.info('初始化：', JSON.stringify(val));
      activeName.value = 'nodeProps';
      editFlag.value = false;
      copyerConfig.value = JSON.parse(JSON.stringify(val));
      copyerConfig.value.id = val.value.id;
      headerConfig.value = {
        required: false,
        edit: false,
        hidden: false,
        readonly: false,
      };
      let formField = getFormFieldData(val);
      copyerConfig.value.value.formPermission = JSON.parse(JSON.stringify(formField));
      // let buttonData = getButtonData(val);
      // copyerConfig.value.value.buttonPermission = JSON.parse(JSON.stringify(val.value.buttonPermission));
    },
  );

  let copyerDrawer = computed(() => store.copyerDrawer);

  let visible = computed({
    get() {
      return copyerDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });

  // 选中的tab
  const activeName = ref<string>('nodeProps');

  /**
   * 获取选中的审批人
   * @param val
   */
  const handleSubmitMember = (val: any) => {
    copyerConfig.value.value.nodeUserList = val;
  };

  // 表单属性表格配置
  const headerConfig = ref({});

  /**
   * 保存审批节点信息
   */
  const saveCopyer = () => {
    // 保存审批节点信息
    setCopyerConfig({
      value: JSON.parse(JSON.stringify(copyerConfig.value.value)),
      flag: true,
      id: copyerConfig1.value.value.id,
    });
    closeDrawer();
  };

  /**
   * 关闭抽屉
   */
  const closeDrawer = () => {
    setCopyer(false);
  };

  /**
   * 打开选择审批人
   */
  const openUserSelect = () => {
    memberSelectRef.value.init();
  };

  onMounted(() => {});
</script>
<style lang="scss">
  .custom-title {
    display: flex;
    justify-content: space-between;
  }
  .icon-bianji {
    cursor: pointer;
  }
</style>
