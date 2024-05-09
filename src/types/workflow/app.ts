/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2024-04-15 15:31:12
 * @FilePath: \aster-flowable-vue\src\types\workflow\app.ts
 * @Description: 应用信息
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
declare namespace WorkApp {
  export interface AppInfo {
    id: number;
    name: string;
    icon: string;
    iconColor: string;
    forms?: Array<WorkForm.BaseInfo>;
  }
}

import { WidgetType } from '@codemirror/view';
import { DEFAULT_PRIMARY } from '@/config';
export class PlaceholderWidget extends WidgetType {
  name: string;
  constructor(name) {
    super();
    this.name = name;
  }
  eq(other) {
    return this.name == other.name;
  }
  toDOM() {
    let elt = document.createElement('span');
    elt.style.cssText = `
      border: 1px solid ${DEFAULT_PRIMARY};
      border-radius: 4px;
      margin: 5px 2px;
      padding: 5px;`;
    elt.textContent = this.name;
    return elt;
  }
  ignoreEvent() {
    return false;
  }
}
