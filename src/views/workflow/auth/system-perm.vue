<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-09-04 16:37:16
 * @FilePath: \aster-flowable-vue\src\views\workflow\auth\system-perm.vue
 * @Description: 系统管理员权限
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->
<template>
  <div class="card table-main">
    <div class="table-header">
      <div class="header-title">权限设置</div>
    </div>
    <div class="table-body">
      <p class="table-body__desc">系统管理员拥有系统所有功能权限，可查看全部数据</p>
      <div class="system-title">
        <span>成员管理</span>
      </div>
      <div class="system-content">
        <div class="system-member" v-for="(member, index) in memberList" :key="index">
          <el-avatar :size="40" :src="member.avatar" />
          <div class="system-member--info">
            <span class="system-member--name">{{ member.memberName }}</span>
            <span class="system-member--dept">{{ member.serviceOrgName }}</span>
          </div>
          <div class="system-member--remove">
            <i class="iconfont icon-shanchu !text-sm" @click="handleDelete(member.id)"></i>
          </div>
        </div>
        <div class="system-member">
          <div class="system-member--add">
            <el-button type="primary" link @click="handleAdd()">
              <i class="iconfont icon-plus pr-5px"></i>添加成员
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { memberListApi } from '@/api/workflow/auth';
  import { ResultEnum } from '@/enums/httpEnum';
  import { reactive, ref, watch } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { isNotEmpty } from '@/utils';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps({
    roleId: {
      type: String,
      default: '',
    },
  });

  // 成员列表
  const memberList = ref<WorkAuth.MemberInfo[]>([]);
  // 查询参数
  const memberParams = reactive<WorkAuth.MemberParams>({
    roleId: '',
    name: '',
  });

  /**
   * @description: 新增成员
   */
  const handleAdd = () => {
    console.log('add');
  };

  /**
   * @description: 删除成员
   */
  const handleDelete = (id?: string) => {
    if (id) {
      ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
        confirmButtonText: t('button.confirm'),
        cancelButtonText: t('button.cancel'),
        type: 'warning',
        lockScroll: false,
      })
        .then(() => {})
        .catch(() => {});
    }
  };

  /**
   * @description: 获取成员列表
   */
  const getMemberList = (id: string) => {
    memberParams.roleId = id;
    memberListApi(memberParams).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        memberList.value = res.data;
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  watch(
    () => props.roleId,
    (val) => {
      if (val && isNotEmpty(val)) {
        getMemberList(val);
      }
    },
    { immediate: true, deep: true },
  );
</script>
<style scoped lang="scss">
  .system-title {
    margin: 15px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    span {
      color: var(--el-text-color-regular);
      border-left: 5px solid var(--el-color-primary);
      padding-left: 10px;
    }
  }

  .system-content {
    display: flex;
    flex-wrap: wrap;
    .system-member {
      position: relative;
      width: 240px;
      height: 76px;
      display: flex;
      align-items: center;
      margin-left: 8px;
      margin-right: 8px;
      margin-bottom: 16px;
      padding: 16px;
      background: #f7f9fb;
      border-radius: 4px;
      border: 1px solid transparent;

      &--info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        padding-left: 10px;

        span {
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          max-width: 160px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      &--name {
        color: var(--el-text-color-primary);
        font-size: 14px;
      }

      &--dept {
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }

      &--add {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &--remove {
        color: var(--el-bg-color);
        display: none;
        position: absolute;
        top: 0;
        right: 4px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        margin-top: -12px;
        background: var(--el-color-primary);
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
      }

      &:hover {
        border: 1px dashed var(--el-color-primary);

        .system-member--remove {
          display: inline-block;
        }
      }
    }
  }
</style>
