/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-01-26 17:02:03
 * @FilePath: \aster-admin\src\utils\encrypt.ts
 * @Description: 加解密
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
import JSEncrypt from 'jsencrypt';

/**
 * 加密
 * @param source 明文
 * @param publicKey 公钥
 * @returns 密文
 */
export function encrypt(source: string, publicKey: string) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
  const result = encrypt.encrypt(source);
  return result == false ? '' : result;
}

/**
 * 解密
 * @param source 密文
 * @param publicKey 公钥
 * @returns 明文
 */
export function decrypt(source: string, publicKey: string) {
  const encrypt = new JSEncrypt();
  encrypt.setPrivateKey(publicKey);
  // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
  var result = encrypt.decrypt(source);
  return result == false ? '' : result;
}
