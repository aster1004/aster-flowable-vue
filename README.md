<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 10:15:55
 * @FilePath: \aster-admin\README.md
 * @Description: README.md
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->

### 项目介绍

  aster-admin一款基于 Vue3、TypeScript、Vite4、Pinia、Element-Plus 开源的后台管理框架, 基础功能已全部实现, 可快速搭建. 基础框架基于<a href="https://gitee.com/HalseySpicy/Geeker-Admin" target="_blank" class="text-blue-500">Geeker-Admin</a>、<a href="https://gitee.com/y_project/RuoYi-Vue" target="_blank" class="text-blue-500">ruoyi-vue</a>开发，请为他们点赞支持。
  <br />

  - 后端工程: https://gitee.com/lp1791803611/aster-boot
  - 在线体验：http://admin.aster.vip/#/  admin/123456

### 项目功能

- 使用 Vue3 + TypeScript + Vite 开发
- 使用 Pinia 替代 Vuex，轻量、简单、易用，集成 Pinia 持久化插件
- 使用 TypeScript 对 Axios 整个二次封装（请求拦截、取消、常用请求封装…）
- 支持 Element 组件大小切换、多主题布局、暗黑模式、i18n 国际化
- 使用 VueRouter 配置动态路由权限拦截、路由懒加载，支持页面按钮权限控制
- 使用 KeepAlive 对页面进行缓存，支持多级嵌套路由缓存
- 常用自定义指令开发（权限、复制、水印、拖拽、节流、防抖、长按…）
- 使用 Prettier 统一格式化代码，集成 ESLint、Stylelint 代码校验规范
- 使用 husky、lint-staged、commitlint及vscode插件git-commit-plugin 规范提交信息
- 使用 lunar-typescrip配置日历、农历、老黄历等

### 使用步骤
```
# 克隆项目
git clone https://gitee.com/lp1791803611/aster-admin.git

# 进入项目
cd aster-admin

# 安装依赖
yarn

# 运行项目
yarn dev

# 打包发布
yarn build
```

