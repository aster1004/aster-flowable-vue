/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-04 15:01:23
 * @FilePath: \aster-flowable-vue\src\utils\color.ts
 * @Description: 颜色转换工具类
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import { ElMessage } from 'element-plus';

/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
  let hexs: any = '';
  let reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) return ElMessage.warning('输入错误的hex');
  str = str.replace('#', '');
  hexs = str.match(/../g);
  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
  return hexs;
}

/**
 * @description rgb颜色转Hex颜色
 * @param {*} r 代表红色
 * @param {*} g 代表绿色
 * @param {*} b 代表蓝色
 * @returns {String} 返回处理后的颜色值
 */
export function rgbToHex(r: any, g: any, b: any) {
  let reg = /^\d{1,3}$/;
  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return ElMessage.warning('输入错误的rgb颜色值');
  let hexs = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
  return `#${hexs.join('')}`;
}

/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
  let reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return ElMessage.warning('输入错误的hex颜色值');
  let rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
  let reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return ElMessage.warning('输入错误的hex颜色值');
  let rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}
