<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-31 14:36:50
 * @FilePath: \aster-flowable-vue\src\views\auth\user\add-or-edit.vue
 * @Description: 用户添加/编辑
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :close-on-click-modal="false"
    :lock-scroll="false"
    width="60%"
    draggable
  >
    <el-form
      ref="formDataRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item prop="avatar" :label="$t('label.user.avatar')">
            <avatar :avatar="formData.avatar" @set-avatar="setAvatar" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="username" :label="$t('label.user.username')">
            <el-input v-model="formData.username" :placeholder="$t('placeholder.user.username')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="nickName" :label="$t('label.user.nickName')">
            <el-input v-model="formData.nickName" :placeholder="$t('placeholder.user.nickName')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="gender" :label="$t('label.user.gender')">
            <dict-radio v-model="formData.gender" dict-type="gender" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="mobile" :label="$t('label.user.mobile')">
            <el-input v-model="formData.mobile" :placeholder="$t('placeholder.user.mobile')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="realName" :label="$t('label.user.realName')">
            <el-input v-model="formData.realName" :placeholder="$t('placeholder.user.realName')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="idNumber" :label="$t('label.user.idNumber')">
            <el-input v-model="formData.idNumber" :placeholder="$t('placeholder.user.idNumber')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="birthday" :label="$t('label.user.birthday')">
            <el-date-picker
              v-model="formData.birthday"
              type="date"
              placeholder="选择时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="area" :label="$t('label.user.area')">
            <el-input v-model="formData.area" :placeholder="$t('placeholder.user.area')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="orgId" :label="$t('label.user.belongOrg')" class="popover-list">
            <el-tree-select
              v-model="formData.orgId"
              :data="deptList"
              value-key="id"
              check-strictly
              :render-after-expand="false"
              :props="{ label: 'orgName', children: 'children' }"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="roleIdList" :label="$t('label.user.belongRole')">
            <el-select
              v-model="formData.roleIdList"
              multiple
              :placeholder="$t('label.user.belongRole')"
              style="width: 100%"
            >
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.roleName"
                :value="role.id ? role.id : ''"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="postIdList" :label="$t('label.user.belongPost')">
            <el-select
              v-model="formData.postIdList"
              multiple
              :placeholder="$t('label.user.belongPost')"
              style="width: 100%"
            >
              <el-option
                v-for="post in postList"
                :key="post.id"
                :label="post.postName"
                :value="post.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="status" :label="$t('label.status')">
            <dict-radio v-model="formData.status" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="signature" :label="$t('label.user.signature')">
            <el-input
              v-model="formData.signature"
              type="textarea"
              :placeholder="$t('placeholder.user.signature')"
              show-word-limit
              :maxlength="30"
              :rows="2"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isEmpty, isNotEmpty } from '@/utils';
  import { userInfoApi, userSaveApi, validateUserNameApi } from '@/api/sys/user';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import Avatar from '@/components/header/avatar.vue';
  import { postListApi } from '@/api/sys/post';
  import { roleListApi } from '@/api/sys/role';
  import { deptListApi } from '@/api/sys/dept';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emits = defineEmits(['refresh']);

  /** 是否显示 */
  const visible = ref(false);
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 注册组件 */
  const formDataRef = ref();
  /** 表单内容 */
  const formData = reactive<User.UserInfo>({
    // 基本信息
    id: '',
    avatar: '',
    username: '',
    nickName: '',
    gender: '0',
    birthday: '',
    mobile: '',
    signature: '',
    status: '0',
    // 实名认证
    realName: '',
    idNumber: '',
    // 权限
    orgId: '',
    orgName: '',
    postIdList: [] as string[],
    roleIdList: [] as string[],
  });

  /** 验证用户名 */
  const validateUsername = async (rule: any, value: string, callback: any) => {
    if (isEmpty(value)) {
      callback();
    }
    const reg = /^[a-zA-Z0-9_]{3,20}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error(t('label.user.userNameValidate')));
    }
  };

  /** 表单规则 */
  const formRules = computed(() => {
    return {
      username: [
        { required: true, message: t('common.required'), trigger: 'blur' },
        {
          validator: validateUsername,
          trigger: 'blur',
        },
      ],
      nickName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      mobile: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      orgId: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });
  /** 角色列表 */
  const roleList = ref<Role.RoleInfo[]>([]);
  /** 岗位列表 */
  const postList = ref<Post.PostInfo[]>([]);
  /** 部门 */
  const deptList = ref<Dept.DeptInfo[]>([]);

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
    formData.id = '';
    formData.postIdList = [];
    formData.roleIdList = [];
    // 部门
    await getDeptList();
    // 角色
    await getRoleList();
    // 岗位
    await getPostList();

    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
      treeSetDefaultHandle();
    }

    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      getDataInfo(key);
    }
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getDataInfo = (key: string) => {
    userInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
    });
  };

  /**
   * @description: 获取部门
   * @return {*}
   */
  const getDeptList = async () => {
    return await deptListApi().then(({ data }) => {
      deptList.value = data;
    });
  };
  /**
   * @description: 获取角色
   * @return {*}
   */
  const getRoleList = async () => {
    return await roleListApi().then(({ data }) => {
      roleList.value = data;
    });
  };
  /**
   * @description: 获取岗位
   * @return {*}
   */
  const getPostList = async () => {
    return await postListApi().then(({ data }) => {
      postList.value = data;
    });
  };

  /**
   * @description: 保存
   * @return {*}
   */
  const submit = () => {
    formDataRef.value.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }

      validateUserNameApi(formData.username).then(({ data }) => {
        if (data) {
          userSaveApi(formData).then((res) => {
            if (res.code == ResultEnum.SUCCESS) {
              ElMessage.success({
                message: t('common.success'),
                duration: 500,
                onClose: () => {
                  visible.value = false;
                  emits('refresh');
                },
              });
            }
          });
        } else {
          ElMessage.error({
            message: t('label.user.userRepeat'),
            duration: 1500,
          });
        }
      });
    });
  };

  /**
   * @description: 设置头像
   * @return {*}
   */
  const setAvatar = (avatar: string) => {
    formData.avatar = avatar;
  };

  /**
   * @description: 设置默认值
   * @return {*}
   */
  const treeSetDefaultHandle = () => {
    formData.orgId = '';
    formData.orgName = '';
  };

  defineExpose({
    init,
  });
</script>
