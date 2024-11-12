/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-10-28 10:28:10
 * @FilePath: \aster-flowable-vue\src\utils\print.ts
 * @Description: 打印工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */

import { ResultEnum } from '@/enums/httpEnum';
import { getDictDataList, isArray, isEmpty, isNotEmpty } from '.';
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
) => {
  // 匹配字符
  const exp = /\${.+:\w+}/gi;
  // 替换变量
  const printEl = document.getElementById(domId)!;
  printEl.innerHTML = templateContent.replace(exp, (match) => {
    const fieldId = match.split(':')[1].trim().replace('}', '');
    // console.log('m--->', fieldId, formData[fieldId]);
    return formData[fieldId] || match;
  });
  const tableEl = printEl.getElementsByTagName('table');
  for (let td of Array.from(tableEl)) {
    const tbody = td.children[0];
    let tr = '';
    if (tbody.children.length === 1) {
      // 可能是没有表头，就直接扫首行
      tr = tbody.children[0].outerHTML;
    } else {
      // 按最后一行来处理
      tr = tbody.children[tbody.children.length - 1].outerHTML;
    }
    // 判断有没有变量存在，没有就不处理
    if (exp.test(tr)) {
      // 行循环
      let tbHtml = '',
        thHtml = '';
      (formData[td.className] || []).forEach((row) => {
        tbHtml += tr.replace(exp, (match) => {
          return row[match.split(':')[1].trim().replace('}', '')] || match;
        });
      });
      // 取表头部分
      for (let i = 0; i < tbody.children.length - 1; i++) {
        thHtml += tbody.children[i].outerHTML;
      }
      tbody.outerHTML = thHtml + tbHtml;
    }
  }
  printEl.innerHTML = printEl.innerHTML.replace(exp, (match) => {
    return '';
  });
};

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
  if (!formData[formItem.id] || isEmpty(formData[formItem.id])) {
    val[formItem.id] = '';
  } else {
    let value: any = '';
    switch (formItem.name) {
      case 'TableList':
        value = [];
        formData[formItem.id].forEach((row, i) => {
          let childValue = {};
          formItem.props.columns.forEach((col) => {
            fieldFillValue(row, col, childValue);
          });
          value.push(childValue);
        });
        break;
      case 'SelectSingle':
        if (formItem.props.type === 'dict') {
          const dataList = await getDictDataList(appStore.dictList, formItem.props.dictType);
          value = dataList.find((d) => d.dictValue === formData[formItem.id])?.dictLabel;
        } else if (formItem.props.type === 'static' || formItem.props.type === 'dynamic') {
          value = formData[formItem.id];
        }
        break;
      case 'SelectMultiple':
        if (formItem.props.type === 'dict') {
          const dataList = await getDictDataList(appStore.dictList, formItem.props.dictType);
          value = formData[formItem.id]
            .map((item) => dataList.find((d) => d.dictValue === item)?.dictLabel)
            .join(',');
        } else if (formItem.props.type === 'static' || formItem.props.type === 'dynamic') {
          value = formData[formItem.id].join(',');
        }
        break;
      case 'DateTime':
        value = moment(formData[formItem.id]).format(formItem.props.format);
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
        value += '<div style="display: flex; justify-content: flex-start;">';
        formData[formItem.id].forEach((image) => {
          value +=
            `<img style="width: 100px; height: 100px; padding: 2px;" src="` + image.url + `"/>`;
        });
        value += '</div>';
        break;
      case 'UploadFile':
        formData[formItem.id].forEach((file) => {
          value += file.name + '<br />';
        });
        break;
      case 'UserPicker':
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
        break;
      case 'DeptPicker':
        (await import('@/api/sys/dept')).selectDeptsByIdsApi(formData[formItem.id]).then((res) => {
          if (res.code == ResultEnum.SUCCESS) {
            value = res.data.map((item) => item.orgName).join(',');
          } else {
            value = '';
          }
          val[formItem.id] = value;
        });
        break;
      case 'Signature':
        value =
          `<img style="width: 120px; height: 50px; padding: 2px;" src="` +
          formData[formItem.id] +
          `"/>`;
        break;
      case 'SignatureCombine':
        let signLabel = '';
        if (formItem.props.showSignature && formItem.props.showSignatureCombine) {
          signLabel = '(签字并盖章)';
        } else if (formItem.props.showSignature) {
          signLabel = '(签字)';
        } else if (formItem.props.showSignatureCombine) {
          signLabel = '(盖章)';
        }
        value =
          '<div style="width: 100%; height: 100%; position: relative; padding: 5px;">' +
          '  <div style="width: 100%"> ' +
          '    <span>' +
          (formData[formItem.id].comment || '') +
          '    </span>' +
          '  </div>' +
          '  <div style="position: absolute; bottom: 0; right: 30px; width: 250px; color: #909399;">' +
          '    <div style="box-sizing: border-box; display: flex; flex-wrap: wrap; position: relative;">' +
          '      <div style="display: flex; flex: 0 0 50%; max-width: 50%; align-items: end;">' +
          '        <span>' +
          signLabel +
          '</span>' +
          '      </div>' +
          '      <div style="display: block; flex: 0 0 50%; max-width: 50%;">' +
          '        <div style="position: relative; width: 100px; height: 100px; background-image: url(' +
          (formData[formItem.id].signature || '') +
          '); ' +
          'background-size: 100%; background-repeat: no-repeat; background-color: rgba(255, 255, 255, 0.5); background-position: center center;">' +
          `          <img style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" src="` +
          (formData[formItem.id].signatureCombine || '') +
          `"/>` +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '    <div style="box-sizing: border-box; display: flex; flex-wrap: wrap;">' +
          '      <div style="width: 100%; display: flex; justify-content: flex-end;">' +
          (formData[formItem.id].date || 'xxxx年xx月') +
          '      </div>' +
          '    </div>' +
          '  </div>' +
          '</div>';
        break;
      case 'AssociatedForm':
        value = formData[formItem.id].label || '';
        break;
      case 'AssociatedProperty':
        value = formData[formItem.id];
        break;
      case 'GeoLocation':
        value = formData[formItem.id].address || '';
        break;
      case 'InputTextarea':
        value = '<div style="padding: 0 5px">' + formData[formItem.id] + '</div>';
        break;
      default:
        value = formData[formItem.id];
        break;
    }
    val[formItem.id] = value;
  }
};
