/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-17 16:01:38
 * @FilePath: \aster-flowable-vue\src\types\workflow\component.d.ts
 * @Description: 组件
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace WorkComponent {
  declare type PropModel = {
    [key: string]: any;
  };

  /**
   * @description: 表单组件配置
   */
  export interface ComponentConfig {
    // 组件id
    id?: string;
    // 组件标题
    title: string;
    // 组件名称
    name: string;
    // 组件图标
    icon: string;
    // 组件值
    value: any;
    // 组件值类型
    valueType: any;
    // 组件属性
    props: PropModel;
  }

  /**
   * @description: 表单组件分组配置
   */
  export interface ComponentConfigGroup {
    // 分组名称
    title: string;
    // 组件
    components: ComponentConfig[];
  }
}
