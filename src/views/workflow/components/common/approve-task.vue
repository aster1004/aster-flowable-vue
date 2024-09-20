<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-09-06 17:37:17
 * @FilePath: \aster-flowable-vue\src\views\workflow\components\common\approve-task.vue
 * @Description: 处理任务
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    width="48%"
    :title="buttonInfo?.operation"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
    @closed="cancleApprove"
  >
    <el-form :model="approveParams" label-width="90px" style="max-width: 700px">
      <!--   转交   -->
      <el-form-item v-if="showTransferAndCountersign" :label="labelTitle">
        <el-input
          style="width: 50%"
          @click="showTransferDialog"
          readonly
          v-model="selectedUserName"
        >
          <template #suffix>
            <i class="iconfont icon-xinzeng" style="color: #b7b9bf" />
          </template>
        </el-input>
      </el-form-item>

      <!--   退回   -->
      <el-form-item v-if="showBackNode" :label="labelTitle">
        <el-select
          v-model="backNodeName"
          placeholder="请选择"
          clearable
          style="width: 50%"
          @change="backNodeNameChange"
        >
          <el-option
            v-for="item in backNodeList"
            :label="item.nodeName"
            :value="item.nodeId"
            :key="item.nodeId"
          />
        </el-select>
        <span v-if="backNodeList.length == 0" style="margin-left: 20px">暂无可退回节点</span>
      </el-form-item>

      <!--   常用意见   -->
      <el-form-item label="常用意见">
        <el-select
          v-model="commonOpinion"
          placeholder="请选择"
          clearable
          @change="commonOpinionChange"
        >
          <el-option
            v-for="item in opinionOptions"
            :label="item.name"
            :value="item.name"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <!--   添加意见   -->
      <el-form-item label="添加意见">
        <el-input v-model="commentInfo.opinion" rows="5" type="textarea" />
      </el-form-item>

      <!--   添加图片   -->
      <el-form-item label="添加图片">
        <approve-upload-image v-model:value="commentInfo.imageList" />
      </el-form-item>

      <!--   添加附件   -->
      <el-form-item label="添加附件">
        <approve-upload-file v-model:value="commentInfo.fileList" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="cancleApprove">{{ $t('button.cancel') }}</el-button>
    </template>

    <!--   用户选择   -->
    <user-org-picker
      ref="userDeptPickerRef"
      type="user"
      title="用户选择"
      :multiple="multiple"
      mode="design"
      @success="handleDefaultSuccess"
    />
  </el-dialog>
</template>
<script setup lang="ts">
  import { PropType, ref, watchEffect } from 'vue';
  import { completeTaskApi, getRecallTaskNodesApi } from '@/api/workflow/task';
  import { opinionOptions } from '@/enums/workFlowEnum';
  import ApproveUploadImage from '@/views/workflow/components/common/approve-upload-image.vue';
  import ApproveUploadFile from '@/views/workflow/components/common/approve-upload-file.vue';
  import userOrgPicker from '@/views/workflow/components/common/user-dept-picker.vue';
  import { isDef, isNotEmpty, isUnDef } from '@/utils';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    formData: {
      type: Object as PropType<WorkForm.FormDataModel>,
      default: () => ({}),
    },
    // 任务id，有可能为空
    taskId: {
      type: String,
      default: '',
    },
    // 表单id
    formId: {
      type: String,
      default: '',
    },
  });
  const emits = defineEmits(['cancel']); // 关闭详情弹框
  // 选人选部门组件
  const userDeptPickerRef = ref();
  // 已选择的人员
  const selectedInfos = ref<UserDeptRole[]>([]);
  // 是否显示
  const visible = ref(false);
  // 用户选择是否多选，true 为多选
  const multiple = ref(false);
  // 是否显示转交、加签，两个通用
  const showTransferAndCountersign = ref(false);
  // 是否显示退回
  const showBackNode = ref(false);
  // form-item 左侧标题
  const labelTitle = ref('');
  // 按钮信息，包括操作名称、操作类型、操作权限
  const buttonInfo = ref<WorkForm.ButtonPermission>();
  // 选中的常用意见
  const commonOpinion = ref('');
  // 可退回的节点名称
  const backNodeName = ref('');
  // 可退回的节点列表
  const backNodeList = ref<Process.BackNodeModel[]>([]);
  // 选中的用户名称
  const selectedUserName = ref('');

  const commentInfo = ref<WorkForm.Comment>({
    opinion: '', // 审批意见
    imageList: [],
    fileList: [],
  });
  // 提交参数
  const approveParams = ref<WorkForm.ApproveParams>({
    taskId: '', // 任务id
    approveType: 'agree',
    signature: '', // 手写签名,base64
    formData: props.formData, // 表单数据
    formId: '', // 表单id
    backNode: '', // 退回节点
    transferUser: '', // 转交人
    countersignUser: '', // 会签人
    comment: {
      opinion: '', // 审批意见
      imageList: [],
      fileList: [],
    },
  });

  /**
   * @description: 保存
   * @return {*}
   */
  const handleSubmit = () => {
    console.log(approveParams.value);
    approveParams.value.taskId = props.taskId;
    approveParams.value.formId = props.formId;
    approveParams.value.comment = commentInfo.value;
    console.info('处理待办：', props.taskId);
    completeTaskApi(approveParams.value).then((res) => {
      console.info(res);
    });

    visible.value = false;
    // 重置表单数据，防止下次提交还有数据
    resetApproveParams();
    emits('cancel'); // 处理成功，关闭详情
  };

  /**
   * 取消按钮，也对数据进行重置
   */
  const cancleApprove = () => {
    visible.value = false;
    resetApproveParams();
  };

  /**
   * 重置表单数据
   */
  const resetApproveParams = () => {
    commentInfo.value = {
      opinion: '', // 审批意见
      imageList: [],
      fileList: [],
    };
    approveParams.value = {
      comment: commentInfo.value,
      taskId: '', // 任务id
      approveType: 'agree',
      signature: '', // 手写签名,base64
      formData: props.formData, // 表单数据
      formId: '', // 表单id
      backNode: '', // 退回节点
      transferUser: '', // 转交人
    };
    selectedInfos.value = [];
    selectedUserName.value = '';
    showTransferAndCountersign.value = false;
    showBackNode.value = false;
    labelTitle.value = '';
    commonOpinion.value = '';
    backNodeName.value = '';
  };
  /**
   * @description: 常用意见选中值改变时赋值给审批意见
   * @param val
   */
  const commonOpinionChange = (val: string) => {
    commentInfo.value.opinion = val;
  };
  /**
   * @description: 常用意见选中值改变时赋值给审批意见
   * @param val
   */
  const backNodeNameChange = (val: string) => {
    console.log(val);
    approveParams.value.backNode = val;
  };

  // 定义一个联合类型
  type UserDeptRole = User.UserInfo | Dept.DeptInfo | Role.RoleInfo;
  /**
   * @description: 选人选部门设置默认值组件回调
   * @param {*} val 选中人员
   * @return {*}
   */
  const handleDefaultSuccess = (val: User.UserInfo[]) => {
    console.log('选人', val);
    if (val.length > 0) {
      val.forEach((item: User.UserInfo) => {
        selectedInfos.value.push(item);
        if (item?.realName != null) {
          selectedUserName.value = item.realName;
        }
        console.log(item);
        approveParams.value.transferUser = item.id;
      });
    } else {
      selectedInfos.value = [];
      selectedUserName.value = '';
    }
  };

  watchEffect(() => {
    console.log('watchEffect--------', buttonInfo.value);
    if (isNotEmpty(buttonInfo.value) && isDef(buttonInfo.value)) {
      console.log(buttonInfo.value);
      // 根据按钮类型判断显示哪些组件
      switch (buttonInfo.value?.name) {
        case 'agree': // 同意
        case 'disagree': // 不同意
        case 'revoke': // 撤销
          break;
        case 'forward': // 转交
          showTransferAndCountersign.value = true;
          labelTitle.value = '转交人';
          break;
        case 'afterAddSign': // 加签
          showTransferAndCountersign.value = true;
          labelTitle.value = '加签人';
          break;
        case 'recall': // 退回
          showBackNode.value = true;
          labelTitle.value = '退回节点';
          break;
        default:
          throw new Error(`未知按钮类型：${buttonInfo.value?.name}`);
      }
    }
  });

  /**
   * 查询是否有可退回节点
   */
  const getBackNodeList = () => {
    showBackNode.value = true;
    labelTitle.value = '退回节点';
    getRecallTaskNodesApi(props.taskId).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        backNodeList.value = res.data;
      }
      console.info(res);
    });
    console.log('getBackNodeList');
  };

  /**
   * 转交选人组件
   */
  const showTransferDialog = () => {
    userDeptPickerRef.value.init(selectedInfos.value);
  };

  // 初始化显示
  const init = (item: WorkForm.ButtonPermission) => {
    visible.value = true;
    buttonInfo.value = item;
    approveParams.value.approveType = buttonInfo.value?.name;
    console.log('init', approveParams.value.approveType);
    if (approveParams.value.approveType === 'recall') {
      getBackNodeList();
    }
  };

  defineExpose({
    init,
  });
</script>
<style scoped lang="scss">
  .serial-number-container {
    height: 250px;
    padding: 0 15px;
    overflow-y: auto;

    .serial-number-list {
      width: 100%;
      .serial-number-item {
        padding-bottom: 3px;
        color: var(--el-text-color-primary);
      }

      .serial-number-icon {
        color: var(--el-color-primary);
      }
    }
  }

  .serial-number-display {
    margin-top: 20px;
    padding: 10px 15px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #f3f3f3;
  }

  .custom-input {
    ::v-deep(.el-input-group__append, .el-input-group__prepend) {
      align-items: center;
      background-color: #fff;
      border-radius: 0;
      border-top-right-radius: var(--el-input-border-radius);
      border-bottom-right-radius: var(--el-input-border-radius);
      color: var(--el-color-info);
      display: inline-flex;
      justify-content: center;
      min-height: 100%;
      padding: 0 10px;
      position: relative;
      white-space: nowrap;
    }
  }
  .el-form-item--default {
    align-items: center;
    ::v-deep(.el-form-item__content) {
      margin-left: 30px;
    }
  }
</style>
