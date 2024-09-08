<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-10-23 11:22:45
 * @FilePath: \aster-flowable-vue\src\views\system\menu\add-or-edit.vue
 * @Description: 菜单新增/编辑
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
          <el-form-item prop="parentName" :label="$t('label.menu.parentMenu')" class="popover-list">
            <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" :width="400">
              <template #reference>
                <el-input
                  v-model="formData.parentName"
                  :readonly="true"
                  :placeholder="$t('placeholder.menu.parentMenu')"
                >
                  <template #suffix>
                    <i
                      v-if="formData.pid !== '0'"
                      class="iconfont icon-close"
                      @click.stop="treeSetDefaultHandle()"
                    ></i>
                  </template>
                </el-input>
              </template>
              <div>
                <el-tree
                  ref="menuListTree"
                  :data="menuList"
                  :props="{ label: 'name', children: 'children' }"
                  node-key="id"
                  :highlight-current="true"
                  :expand-on-click-node="false"
                  accordion
                  @current-change="treeCurrentChange"
                />
              </div>
            </el-popover>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="type" :label="$t('label.menu.type')">
            <dict-radio v-model="formData.type" dict-type="menu_type" />
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="formData.type != '2'">
          <el-form-item prop="icon" :label="$t('label.menu.icon')" class="popover-list">
            <icon-select ref="iconSelectRef" v-model:icon="formData.icon" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="name" :label="$t('label.menu.name')">
            <el-input v-model="formData.name" :placeholder="$t('placeholder.menu.name')" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.type == '1'">
          <el-form-item prop="openStyle" :label="$t('label.menu.openStyle')">
            <dict-radio v-model="formData.openStyle" dict-type="open_style" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.type != '2'">
          <el-form-item prop="path" :label="$t('label.menu.path')">
            <el-input v-model="formData.path" :placeholder="$t('placeholder.menu.path2')" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.type == '1' && formData.openStyle != '1'">
          <el-form-item prop="component" :label="$t('label.menu.component')">
            <el-input v-model="formData.component" :placeholder="$t('placeholder.menu.component')">
              <template #append>.vue</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="sort" :label="$t('label.sort')">
            <el-input-number v-model="formData.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type == '1'">
          <el-form-item>
            <template #label>
              <el-tooltip :content="$t('placeholder.menu.isKeepAlive')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.menu.isKeepAlive') }}
            </template>
            <dict-radio v-model="formData.isKeepAlive" dict-type="whether" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.type == '1'">
          <el-form-item>
            <template #label>
              <el-tooltip :content="$t('placeholder.menu.isFull')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.menu.isFull') }}
            </template>
            <dict-radio v-model="formData.isFull" dict-type="whether" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type == '1'">
          <el-form-item>
            <template #label>
              <el-tooltip :content="$t('placeholder.menu.isAffix')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.menu.isAffix') }}
            </template>
            <dict-radio v-model="formData.isAffix" dict-type="whether" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.type != '2'">
          <el-form-item>
            <template #label>
              <el-tooltip :content="$t('placeholder.menu.isHide')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.menu.isHide') }}
            </template>
            <dict-radio v-model="formData.isHide" dict-type="whether" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type == '2'">
          <el-form-item prop="perms" :label="$t('label.menu.perms')">
            <el-input v-model="formData.perms" :placeholder="$t('placeholder.menu.perms')" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.type != '2'">
          <el-form-item>
            <template #label>
              <el-tooltip :content="$t('placeholder.menu.status')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.menu.status') }}
            </template>
            <dict-radio v-model="formData.status" dict-type="status" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="remark" :label="$t('label.remark')">
            <el-input v-model="formData.remark" :placeholder="$t('placeholder.remark')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="close">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { menuListApi, menuInfoApi, menuSaveApi } from '@/api/sys/menu';
  import { isNotEmpty } from '@/utils';
  import IconSelect from '@/components/icon/icon-select.vue';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
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
  const iconSelectRef = ref();

  const formData = reactive<Menu.MenuOptions>({
    id: '',
    pid: '',
    parentName: '',
    name: '',
    type: '0',
    icon: '',
    path: '',
    component: '',
    isHide: '1',
    isKeepAlive: '1',
    isAffix: '1',
    isFull: '1',
    openStyle: '',
    status: '0',
    sort: 0,
    perms: '',
    remark: '',
  });
  const formRules = computed(() => {
    return {
      name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      parentName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      path: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      openStyle: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      component: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      perms: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });
  const menuList = ref<Menu.MenuOptions[]>([]);
  const menuListPopover = ref();
  const menuListTree = ref();

  const init = async (type: string, menu?: Menu.MenuOptions) => {
    visible.value = true;
    formData.id = '';
    // 菜单列表
    await getMenuList();
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
      formData.component = '';
      formData.createTime = '';
    }
    // 判断新增还是编辑
    if (menu && isNotEmpty(menu.id)) {
      if (type == 'add') {
        menuListTree.value.setCurrentKey(menu.id);
      } else {
        getMenu(menu.id);
      }
    } else {
      treeSetDefaultHandle();
    }
  };

  // 获取菜单列表
  const getMenuList = async () => {
    return await menuListApi().then(({ data }) => {
      menuList.value = data;
    });
  };

  // 获取信息
  const getMenu = (id: string) => {
    menuInfoApi(id).then(({ data }) => {
      Object.assign(formData, data);
      if (formData.pid == '0') {
        return treeSetDefaultHandle();
      }
      menuListTree.value.setCurrentKey(formData.pid);
    });
  };

  // 上级菜单树, 设置默认值
  const treeSetDefaultHandle = () => {
    formData.pid = '0';
    formData.parentName = '一级菜单';
  };

  const treeCurrentChange = (data: any) => {
    formData.pid = data.id;
    formData.parentName = data.name;
    menuListPopover.value.hide();
  };

  const submit = () => {
    formDataRef.value.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }

      menuSaveApi(formData).then((res) => {
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
    });
  };

  const close = () => {
    visible.value = false;
  };

  defineExpose({
    init,
  });
</script>
<style lang="scss" scoped></style>
