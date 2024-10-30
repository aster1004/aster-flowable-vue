/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-10-28 10:28:10
 * @FilePath: \aster-flowable-vue\src\utils\print.ts
 * @Description: 打印工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { ResultEnum } from '@/enums/httpEnum';
import { getDictDataList, isArray, isNotEmpty } from '.';
import { useAppStore } from '@/stores/modules/app';
import moment from 'moment';

const appStore = useAppStore();

/**
 * @description: 往打印模板中填充表单数据
 * @param {string} domId 元素ID
 * @param {object} formData 表单数据
 * @param {string} templateContent 模板内容
 * @return {*}
 */
export const fillFormData = async (
  domId: string,
  formData: WorkForm.FormDataModel,
  templateContent: string,
) => {};

/**
 * @description: 模板填充值
 * @param formData 表单数据
 * @param formItems 已扁平化的表单项
 * @param val 最终返回的值
 */
export const templateFillValue = async (
  formData: WorkForm.FormDataModel,
  formItems: WorkComponent.ComponentConfig[],
  val: object,
) => {
  formItems.forEach(async (item) => {
    await fieldFillValue(formData, item, val);
  });
};

/**
 * @description: 按表单项格式化数据
 * @return {*}
 */
const fieldFillValue = async (
  formData: WorkForm.FormDataModel,
  formItem: WorkComponent.ComponentConfig,
  val: object,
) => {
  let value: any = '';
  switch (formItem.name) {
    case 'TableList':
      value = [];
      (formData[formItem.id] || []).forEach((row, i) => {
        value.push({});
        formItem.props.columns.forEach((col) => {
          fieldFillValue(row, col, value[i]);
        });
      });
      break;
    case 'SelectSingle':
      if (isNotEmpty(formData[formItem.id])) {
        if (formItem.props.type === 'dict') {
          const dataList = await getDictDataList(appStore.dictList, formItem.props.dictType);
          value = dataList.find((d) => d.dictValue === formData[formItem.id])?.dictLabel;
        } else if (formItem.props.type === 'static' || formItem.props.type === 'dynamic') {
          value = formData[formItem.id];
        }
      }
      break;
    case 'SelectMultiple':
      if (isNotEmpty(formData[formItem.id])) {
        if (formItem.props.type === 'dict') {
          const dataList = await getDictDataList(appStore.dictList, formItem.props.dictType);
          value = formData[formItem.id]
            .map((item) => dataList.find((d) => d.dictValue === item)?.dictLabel)
            .join(',');
        } else if (formItem.props.type === 'static' || formItem.props.type === 'dynamic') {
          value = formData[formItem.id].join(',');
        }
      }
      break;
    case 'DateTime':
      if (isNotEmpty(formData[formItem.id])) {
        value = moment(formData[formItem.id]).format(formItem.props.format);
      }
      break;
    case 'DateTimeRange':
      const v = formData[formItem.id];
      if (isArray(v) && v.length === 2) {
        value =
          moment(v[0]).format(formItem.props.format) +
          '至' +
          moment(v[1]).format(formItem.props.format);
      }
      break;
    case 'UploadImage':
      (formData[formItem.id] || []).forEach((image) => {
        value +=
          `<img style="width: 100px; height: 100px; padding: 2px;" src="` + image.url + `"/>`;
      });
      break;
    case 'UploadFile':
      (formData[formItem.id] || []).forEach((file) => {
        value += file.name + '<br />';
      });
      break;
    case 'UserPicker':
      if (isNotEmpty(formData[formItem.id])) {
        (await import('@/api/sys/user')).selectUsersByIdsApi(formData[formItem.id]).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            value = res.data
              .map((item) => (isNotEmpty(item.realName) ? item.realName : item.nickName))
              .join(',');
          } else {
            value = '';
          }
          val[formItem.id] = value;
        });
      }
      break;
    case 'DeptPicker':
      if (isNotEmpty(formData[formItem.id])) {
        (await import('@/api/sys/dept')).selectDeptsByIdsApi(formData[formItem.id]).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            value = res.data.map((item) => item.orgName).join(',');
          } else {
            value = '';
          }
          val[formItem.id] = value;
        });
      }
      break;
    case 'Signature':
      break;
  }
  val[formItem.id] = value;
};
