import { useWorkFlowStore } from '@/stores/modules/workflow';
import { flatFormItems } from '@/utils/workflow';
import { isNotEmpty } from '@/utils';

// 工作流store
const workFlowStore = useWorkFlowStore();

/**
 * 获取表单字段数据权限
 * @param val
 */
export const getFormFieldData = (val: any) => {
  let formItems = flatFormItems(workFlowStore.design.formItems);
  formItems.forEach((formItem: any) => {
    if (val.value.type === 0) {
      formItem.operation = ['edit'];
    } else {
      formItem.operation = ['readonly'];
    }
  });
  let formPermissionData = val.value.formPermission;
  console.info('formPermissionData.length', formPermissionData.length);
  if (isNotEmpty(formPermissionData)) {
    formItems.forEach((formItem: any) => {
      for (let i = 0; i < formPermissionData.length; i++) {
        let permission: any = formPermissionData[i];
        if (formItem.id == permission.id) {
          formItem.operation = permission.operation;
        }
      }
    });
  }
  console.info('返回了：', JSON.stringify(formItems));
  return formItems;
};
