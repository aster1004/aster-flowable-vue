<!--
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-11-07 10:15:55
 * @FilePath: \aster-flowable-vue\README.md
 * @Description: README.md
 * Copyright (c) 2024 by Aster, All Rights Reserved.
-->

### 项目介绍

  aster-flowable-vue工作流前端设计器，仿钉钉/氚云设计，包含在线表单设计，审批流程设计、流程权限、流程管理和基础功能等。
  - 后端框架基于[aster-boot](https://gitee.com/lp1791803611/aster-boot)开发，技术采用SpringBoot3.x + Mybatis-Plus + Flowable7.0 + SpringSecurity + Quartz + WebSocket等。
  - 前端框架基于[aster-admin](https://gitee.com/lp1791803611/aster-admin)开发，技术采用Vue3 + TypeScript + Vite + Element-Plus + Pinia等。

### 功能介绍

- 表单设计<br />
  布局控件：分组标题、一行多列、明细表、描述说明<br />
  基础控件：单行文本、多行文本、数字、金额、单选框、复选框、日期、日期范围、图片、附件、人员、部门、评分等<br />
  高级控件：流水号、签名、签章、关联表单、关联属性、地理位置、省市区、计算公式、汇总计算等
- 流程设计<br />
  审批人、抄送人、条件分支、并行分支、包容分支、子流程等；<br />
  节点属性、表单权限、操作权限等；
- 列表设计<br />
  列表字段、查询字段、功能按钮、排序字段和排序方式等
- 表单设置<br />
  提交校验、业务规则、消息提醒、关联列表、打印模板等
- 流程权限<br />
  数据管理员：查看所有表单数据<br />
  所有用户：设置公共权限<br />
  其他角色：角色权限设置、角色成员管理
- 工作台、待办任务、已办任务、我发起的、抄送我的
- 基础功能<br />
  系统设置：菜单管理、数据字典、参数配置、通知公告；<br />
  权限管理：用户管理、角色管理、部门管理、岗位管理；<br />
  日志管理：访问日志、操作日志；<br />
  系统监控：在线用户、任务调度、服务监控、缓存监控；<br />
  代码生成：代码生成、数据源管理、字段类型映射、基类管理；<br />
  常用组件等

### 项目预览
![img-1](/public/images/preview01.png)
![img-1](/public/images/preview02.png)
![img-1](/public/images/preview03.png)
![img-1](/public/images/preview04.png)
![img-1](/public/images/preview05.png)
![img-1](/public/images/preview06.png)
![img-1](/public/images/preview07.png)
![img-1](/public/images/preview08.png)
![img-1](/public/images/preview09.png)


### 使用步骤
```
# 克隆项目
git clone https://gitee.com/lp1791803611/aster-flowable-vue.git

# 进入项目
cd aster-flowable-vue

# 安装依赖
yarn

# 运行项目
yarn dev

# 打包发布
yarn build
```
### 支持

如果觉得还不错，希望您可以帮作者点个 ⭐ Star，这将是对作者极大的鼓励与支持。