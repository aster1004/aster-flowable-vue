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
      label-width="130px"
      @keyup.enter="submit()"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="contactUserName" :label="$t('label.tenant.contactUserName')">
            <el-input
              v-model="formData.contactUserName"
              :placeholder="$t('placeholder.tenant.contactUserName')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="contactPhone" :label="$t('label.tenant.contactPhone')">
            <el-input
              v-model="formData.contactPhone"
              :placeholder="$t('placeholder.tenant.contactPhone')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="companyName" :label="$t('label.tenant.companyName')">
            <el-input
              v-model="formData.companyName"
              :placeholder="$t('placeholder.tenant.companyName')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="licenseNumber" :label="$t('label.tenant.licenseNumber')">
            <el-input
              v-model="formData.licenseNumber"
              :placeholder="$t('placeholder.tenant.licenseNumber')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isEdit">
          <el-form-item prop="username" :label="$t('label.tenant.username')">
            <el-input
              v-model="formData.username"
              :placeholder="$t('placeholder.tenant.username')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!isEdit">
          <el-form-item prop="password" :label="$t('label.tenant.username')">
            <el-input
              v-model="formData.password"
              type="password"
              show-password
              :placeholder="$t('placeholder.tenant.password')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="accountCount">
            <el-input
              v-model="formData.accountCount"
              type="number"
              :placeholder="$t('placeholder.tenant.accountCount')"
            />
            <template #label>
              <el-tooltip :content="$t('label.tenant.accountCountTip')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.tenant.accountCount') }}
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="expireTime">
            <el-date-picker
              v-model="formData.expireTime"
              type="datetime"
              :placeholder="$t('placeholder.tenant.expireTime')"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <template #label>
              <el-tooltip :content="$t('label.tenant.expireTimeTip')" placement="top">
                <i class="iconfont icon-help"></i>
              </el-tooltip>
              {{ $t('label.tenant.expireTime') }}
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="packageId" :label="$t('label.tenant.packageId')">
            <el-select
              v-model="formData.packageId"
              :placeholder="$t('placeholder.tenant.packageId')"
              style="width: 100%"
            >
              <el-option
                v-for="(p, i) in packageList"
                :key="i"
                :label="p.packageName"
                :value="p.id ? p.id : ''"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="address" :label="$t('label.tenant.address')">
            <el-input v-model="formData.address" :placeholder="$t('placeholder.tenant.address')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="intro" :label="$t('label.tenant.intro')">
            <el-input v-model="formData.intro" :placeholder="$t('placeholder.tenant.intro')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="domain" :label="$t('label.tenant.domain')">
            <el-input v-model="formData.domain" :placeholder="$t('placeholder.tenant.domain')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="status" :label="$t('label.status')">
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
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { tenantInfoApi, tenantSaveApi } from '@/api/sys/tenant';
  import { tenantPackageListApi } from '@/api/sys/tenantPackage';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage } from 'element-plus/es';
  import { isNotEmpty } from '@/utils';
  import DictRadio from '@/components/dict/dict-radio.vue';
  import { useI18n } from 'vue-i18n';
  import { encrypt } from '@/utils/encrypt';
  import { useAppStore } from '@/stores/modules/app';

  const appStore = useAppStore();
  const { t } = useI18n();

  const emits = defineEmits(['refresh']);

  /** 是否显示 */
  const visible = ref(false);
  /** 是否编辑页 */
  const isEdit = ref(false);
  // 秘钥
  const secretKey = ref('');
  /** 标题 */
  const title = computed(() => {
    return !formData.id ? t('button.add') : t('button.edit');
  });
  /** 租户套餐 */
  const packageList = ref<TenantPackage.TenantPackageInfo[]>([]);
  /** 注册组件 */
  const formDataRef = ref();
  /** 表单内容 */
  const formData = reactive<Tenant.TenantInfo>({
    id: '',
    contactUserName: '',
    contactPhone: '',
    companyName: '',
    licenseNumber: '',
    accountCount: -1,
    expireTime: '',
    address: '',
    intro: '',
    domain: '',
    status: '',
    remark: '',
    packageId: '',
    username: '',
    password: '',
  });
  /** 表单规则 */
  const formRules = computed(() => {
    return {
      contactUserName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      contactPhone: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      companyName: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      username: [{ required: true, message: t('common.required'), trigger: 'blur' }],
      password: [{ required: true, message: t('common.required'), trigger: 'blur' }],
    };
  });

  /**
   * @description: 获取租户套餐
   * @return {*}
   */
  const getTenantPackageList = () => {
    tenantPackageListApi().then(({ data }) => {
      packageList.value = data;
    });
  };

  /** 初始化 */
  const init = async (key?: string) => {
    visible.value = true;
    formData.id = '';
    // 重置表单
    if (formDataRef.value) {
      formDataRef.value.resetFields();
    }
    // 判断新增还是编辑
    if (key && isNotEmpty(key)) {
      isEdit.value = true;
      getInfo(key);
    } else {
      // 私钥
      secretKey.value = appStore.secretKey;
      isEdit.value = false;
    }
    // 获取租户套餐列表
    getTenantPackageList();
  };

  /**
   * @description: 获取信息
   * @param {*} key
   * @return {*}
   */
  const getInfo = (key: string) => {
    tenantInfoApi(key).then(({ data }) => {
      Object.assign(formData, data);
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
      console.log(formData.password);
      // 加密密码
      const encryptPassword = encrypt(formData.password, secretKey.value);

      tenantSaveApi({ ...formData, password: encryptPassword }).then((res) => {
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

  defineExpose({
    init,
  });
</script>
<style lang="scss" scoped></style>
