/*
 * @Author: Aster lipian1004@163.com
 * @Date: 2023-08-15 14:40:06
 * @FilePath: \aster-flowable-vue\src\i18n\modules\en_US.ts
 * @Description: 英文
 * Copyright (c) 2024 by Aster, All Rights Reserved.
 */
export default {
  home: {
    welcome: 'Welcome',
    home: 'Home',
  },
  common: {
    success: 'Success',
    failed: 'Failed',
    required: 'Required items cannot be empty',
    tips: 'Tips',
    dateRange: {
      separator: ' - ',
      start: 'Start Time',
      end: 'End Time',
    },
    selectOne: 'Please select data!',
    status0: 'Enable',
    status1: 'Disable',
    confirmSubmit: 'Are you sure you want to submit?',
  },
  calendar: {
    perpetualCalendar: 'Perpetual Calendar',
    almanac: 'Almanac',
    vacation: 'Vacation',
    toToday: 'Return To Today',
    year: 'Year',
    month: 'Month',
    day: 'Day',
  },
  tabs: {
    more: 'More',
    refresh: 'Refresh',
    maximize: 'Maximize',
    closeCurrent: 'Close Current',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeOther: 'Close Other',
    closeAll: 'Close All',
  },
  header: {
    componentSize: 'Component Size',
    // 语言
    language: 'Language',
    // 主题
    theme: 'Theme',
    layoutStyle: 'Style',
    layoutVertical: 'Vertical',
    layoutClassic: 'Classic',
    layoutTransverse: 'Transverse',
    layoutColumns: 'Columns',
    sidebarInvertColor: 'Sidebar Invert Color',
    sidebarInvertColorTip: 'Sidebar Color Changes To Dark Mode',
    headerInvertColor: 'Header Invert Color',
    headerInvertColorTip: 'Header Color Changes To Dark Mode',
    layoutConfig: 'Layout Config',
    primary: 'Primary',
    darkMode: 'Dark Mode',
    greyMode: 'Grey Mode',
    weakMode: 'Weak Mode',
    pageSettings: 'Page',
    collapseMenu: 'Collapse Menu',
    breadcrumb: 'Bread Crumb',
    breadcrumbIcon: 'Bread Crumb Icon',
    tabs: 'Tabs',
    tabsIcon: 'Tabs Icon',
    footer: 'Footer',
    // 全屏
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    // 消息
    message: 'Message',
    noneMessage: 'Empty',
    notice: 'Notice',
    noneNotice: 'Empty',
    announcement: 'Announcement',
    noneAnnouncement: 'Empty',
    // 用户
    personalData: 'Personal Data',
    changePassword: 'Change Password',
    logout: 'Logout',
    logoutTip: 'Are you sure you want to logout?',
    // 表单
    deleteComp:
      'Deleting components will also delete related configurations. If there are any sub components, they will be deleted together. Do you want to continue?',
  },
  login: {
    placeholder: {
      username: 'username：admin',
      password: 'password：123456',
      captcha: 'captcha',
      tenant: 'tenant',
    },
    rule: {
      username: 'Please enter the username',
      password: 'Please enter the password',
      captcha: 'Please enter the captcha',
      tenant: 'Please choose a tenant',
    },
    message: {
      login: 'Welcome ',
    },
  },
  error: {
    password: 'New and old cannot be the same!',
    repeatPassword: 'The two passwords do not match!',
    avatarUploadType: 'Avatar picture must be Image format!',
    avatarUploadSize: 'Avatar picture size can not exceed ',
  },
  button: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    detail: 'Detail',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    import: 'Import',
    export: 'Export',
    upload: 'Upload',
    download: 'Download',
    search: 'Search',
    reset: 'Reset',
    login: 'Login',
    expand: 'Expand',
    merge: 'Merge',
    refresh: 'Refresh',
    force: 'Force',
    preview: 'Preview',
    sync: 'Sync',
    test: 'Test',
    log: 'Log',
    clear: 'Clear',
    execute: 'Execute',
    suspend: 'Suspend',
    restore: 'Restore',
    publish: 'Publish',
    save: 'Save',
    copy: 'Copy',
    deploy: 'Deploy',
    set: 'Set',
    close: 'Close',
    print: 'Print',
    tmp: 'Tmp',
    submit: 'Submit',
    showSearch: 'Show Search',
    hideSearch: 'Hide Search',
    configDict: 'Config Dict',
    configAuth: 'Config Auth',
    generatorCode: 'Generate Code',
    submitAgain: 'Submit Again',
    printPreview: 'Print Preview',
  },
  delete: {
    empty: 'Please select to delete a record',
    confirm: 'Confirm deletion operation?',
    success: 'Successfully deleted！',
  },
  label: {
    status: 'Status',
    sort: 'Sort',
    createTime: 'Create Time',
    operate: 'Operate',
    remark: 'Remark',
    default: 'Default',
    dept: {
      orgName: 'Org Name',
      parentName: 'Parent Org',
    },
    post: {
      postCode: 'Post Code',
      postName: 'Post Name',
    },
    role: {
      roleName: 'Role Name',
      roleCode: 'Role Code',
      menuAuth: 'Menu Auth',
      dataAuth: 'Data Auth',
      dataScope: 'Data Scope',
    },
    user: {
      orgList: 'Org List',
      userList: 'User List',
      name: 'Name',
      gender: 'Gender',
      avatar: 'Avatar',
      username: 'User Name',
      nickName: 'Nick Name',
      realName: 'Real Name',
      idNumber: 'IDCard',
      area: 'Area',
      mobile: 'Mobile',
      birthday: 'Birthday',
      signature: 'Signature',
      belongOrg: 'Belong Org',
      belongRole: 'Belong Role',
      belongPost: 'Belong Post',
      uploadAvatar: 'Upload Avatar',
      resetPassword: 'Reset Password',
      exportConfirm: 'Confirm exporting user data?',
      resetPwdConfirm: 'Confirm resetting password?',
      userNameValidate:
        'Username must be between 3-20 characters and can only contain English, numbers and underscores',
      userRepeat: 'Username already exists, please re-enter',
    },
    access: {
      username: 'Login Account',
      status: 'Login Status',
      loginTime: 'Login Time',
      ipAddress: 'Login IP',
      location: 'Login Address',
      operation: 'Operation Status',
      exportConfirm: 'Confirm export access log?',
      log: 'Access Log',
    },
    operation: {
      username: 'UserName',
      module: 'Module',
      name: 'Method',
      businessType: 'Business Type',
      requestUri: 'Request URI',
      requestMethod: 'Request Method',
      requestParams: 'Request Params',
      ip: 'IP',
      address: 'Address',
      duration: 'Duration',
      operTime: 'Operation Time',
      status: 'Operation Status',
      resultMsg: 'Return Message',
      exportConfirm: 'Confirm export operation logs?',
      log: 'Operation Log',
    },
    dict: {
      dictType: 'Dict Type',
      dictName: 'Dict Name',
      status: 'Dict Status',
      config: 'Config Dict',
      dictValue: 'Dict Value',
      dictLabel: 'Dict Label',
      labelClass: 'Label Class',
    },
    menu: {
      name: 'Name',
      status: 'Status',
      path: 'Path',
      icon: 'Icon',
      type: 'Type',
      perms: 'Perms',
      component: 'Component',
      parentMenu: 'ParentMenu',
      isKeepAlive: 'isKeepAlive',
      isFull: 'isFull',
      isAffix: 'isAffix',
      isHide: 'isHide',
      openStyle: 'openStyle',
    },
    config: {
      configName: 'Config Name',
      configKey: 'Config Key',
      configValue: 'Config Value',
      configType: 'Config Type',
    },
    online: {
      tokenId: 'Token',
      username: 'Username',
      mobile: 'Mobile',
      email: 'Email',
      gender: 'Gender',
      empty: 'Token cannot be empty',
      confirm: 'Are you sure you want to forcibly exit this account?',
    },
    server: {
      status: 'System Status',
      sys: 'System',
      sysOsName: 'Os Name',
      sysOsArch: 'Os Arch',
      sysName: 'Sys Name',
      sysIp: 'Sys Ip',
      sysDir: 'Sys Dir',

      cpu: 'CPU',
      cpuName: 'CPU Name',
      cpuNum: 'CPU Num',
      cpuUsed: 'CPU Used',
      cpuSys: 'CPU Sys',
      cpuFree: 'CPU Free',

      mem: 'Memory',
      memTotal: 'Mem Total',
      memUsed: 'Mem Used',
      memFree: 'Mem Free',
      memUsage: 'Mem Usage',

      jvm: 'JVM',
      jvmName: 'Name',
      jvmVersion: 'Version',
      jvmMax: 'Jvm Max',
      jvmTotal: 'Jvm Total',
      jvmUsed: 'Jvm Used',
      jvmFree: 'Jvm Free',
      jvmUsage: 'Jvm Usage',
      jvmHome: 'Jvm Home',
      jvmStartTime: 'Start Time',
      jvmRunTime: 'Run Time',

      disk: 'Disk',
      typeName: 'Disk Name',
      sysTypeName: 'Disk Type',
      dirName: 'Disk Path',
      diskTotal: 'Disk Total',
      diskUsed: 'Disk Used',
      diskFree: 'Disk Free',
      diskUsage: 'Disk Usage',
    },
    generator: {
      baseCode: 'Base Class Code',
      baseField: 'Base Class Field',
      tableName: 'Table Name',
      tableComment: 'Table Comment',
      className: 'Class Name',
      syncMessage: 'Are you sure to synchronize the data table?',
      genMessage: 'Please select the table for generating code?',
      tableIdEmpty: 'The table ID is empty. Please refresh and try again?',
      importTable: 'Import database tables',
      importDatasource: 'Database',
      extend: 'Extend',
      moduleName: 'Module Name',
      moduleSimple: 'Module Abbreviation',
      functionName: 'Function Name',
      packageName: 'Package Name',
      author: 'Author',
      email: 'Email',
      version: 'Version',
      formLayout: 'Form Layout',
      generatorType: 'Generate Type',
      backendPath: 'Backend Path',
      frontendPath: 'Frontend Path',
      oneCol: 'One column',
      twoCol: 'Two column',
      zipPath: 'Zip',
      customPath: 'Custom Path',
      connName: 'Conn Name',
      dbType: 'Db Type',
      connUrl: 'Conn Url',
      username: 'Username',
      password: 'Password',
      columnType: 'Column Type',
      attrType: 'Attr Type',
      fieldPackage: 'Field Package',
    },
    quartz: {
      jobId: 'Job ID',
      jobName: 'Job Name',
      jobGroup: 'Job Group',
      invokeTarget: 'Invoke Target',
      beanTarget: 'Bean Invocation Example',
      classTarget: 'Class Invocation Example',
      paramTarget: 'Parameter Description: Supports string, boolean, long, float, and integer',
      cronExpression: 'Cron Expression',
      misfirePolicy: 'Misfire Policy',
      concurrent: 'Concurrent',
      immediately: 'Execute Immediately',
      once: 'Execute Once',
      abandon: 'Abandon Execution',
      allow: 'Allow',
      prohibit: 'Prohibit',
      immediateMessage: 'Are you sure you want to execute the task immediately?',
      restoreMessage: 'Are you sure you want to restore the task?',
      suspendMessage: 'Are you sure you want to pause the task?',
      jobMessage: 'Job Message',
      logDetail: 'Log Detail',
      logId: 'Log Id',
      status: 'Execute Status',
      exceptionInfo: 'Exception Info',
    },
    notice: {
      title: 'Title',
      type: 'Type',
      content: 'Content',
      publishType: 'Publish Type',
      publishNow: 'Publish Now',
      publishJob: 'Timed release',
      publishTime: 'Publish Time',
    },
    tenant: {
      switch: 'Tenant switch successful',
      contactUserName: 'Contact User',
      contactPhone: 'Contact Mobile',
      companyName: 'Company Name',
      licenseNumber: 'License Number',
      username: 'username',
      password: 'password',
      accountCount: 'Account Count',
      accountCountTip:
        'Limit the number of registered users for tenants, -1 represents no restriction',
      expireTime: 'Expire Time',
      expireTimeTip:
        'After expiration, users under the tenant cannot log in. If left blank, it will not expire',
      packageId: 'Tenant Package',
      address: 'Address',
      intro: 'Intro',
      domain: 'Domain',
      packageName: 'Package Name',
      menuIds: 'Context Menu',
    },
  },
  placeholder: {
    password: 'Please enter the password',
    oldPassword: 'Please enter the original password',
    newPassword: 'Please enter a new password',
    repeatPassword: 'Please repeat the password',
    status: 'Please enter the status',
    remark: 'Please enter the remark',
    dept: {
      orgName: 'Please enter the org name',
    },
    post: {
      postCode: 'Please enter the post code',
      postName: 'Please enter the post name',
    },
    role: {
      roleName: 'Please enter the role name',
      roleCode: 'Please enter the role code',
    },
    user: {
      name: 'username/nickname/mobile',
      gender: 'Gender',
      username: 'User Name',
      nickName: 'Nick Name',
      mobile: 'Mobile',
      realName: 'Real Name',
      idNumber: 'IDCard',
      area: 'Area',
      belongRole: 'Belong Role',
      belongPost: 'Belong Post',
      signature: 'Signature',
    },
    access: {
      username: 'Login Account',
      status: 'Login Status',
    },
    operation: {
      username: 'Please enter the username',
    },
    dict: {
      dictType: 'Please enter the dict type',
      dictName: 'Please enter the dict name',
      dictLabel: 'Please enter the dict label',
      dictValue: 'Please enter the dict value',
    },
    menu: {
      name: 'Please enter the menu name',
      path: 'Please enter the menu path',
      parentMenu: 'Parent Menu',
      path2: 'example: /system/menu',
      component: 'example: /system/menu/index',
      perms: 'example: sys:menu:add',
      isKeepAlive:
        'If you choose Yes, it will be cached by `keep alive`, and the matching components `name`and address need to be consistent',
      isFull: 'If you choose Yes, the menu will be displayed in full screen when opened',
      isAffix:
        'If you choose Yes, it will be fixed in the label bar and cannot be removed from the label bar',
      isHide:
        'If you choose to Yes, the route will not appear in the sidebar, but it can still be accessed',
      status:
        'If you choose to disable, the route will not appear in the sidebar and cannot be accessed',
    },
    config: {
      configName: 'Please enter the config name',
      configKey: 'Please enter the config key',
      configValue: 'Please enter the config value',
      configType: 'Please choose a config type',
    },
    generator: {
      baseCode: 'Please enter the base class code',
      baseField: 'Please enter the base class field',
      tableName: 'Please enter the table name',
      tableComment: 'Please enter the table comment',
      className: 'Please enter the class name',
      importDatasource: 'Please enter the datasource',
      extend: 'Please enter the base class',
      moduleName: 'Please enter the module name',
      moduleSimple: 'Please enter the module abbreviation',
      functionName: 'Please enter the function name',
      packageName: 'Please enter the package name',
      author: 'Please enter the author',
      email: 'Please enter the email',
      version: 'Please enter the version',
      formLayout: 'Please enter the form layout',
      generatorType: 'Please enter the generate type',
      backendPath: 'Please enter the backend path',
      frontendPath: 'Please enter the frontend path',
      connName: 'Please enter the conn name',
      dbType: 'Please enter the dbType',
      connUrl: 'Please enter the connUrl',
      username: 'Please enter the username',
      password: 'Please enter the password',
      columnType: 'Please enter the column type',
      attrType: 'Please enter the attr type',
      fieldPackage: 'Please enter the field package',
    },
    quartz: {
      jobId: 'Please enter the job id',
      jobName: 'Please enter the job name',
      jobGroup: 'Please enter the job group',
      invokeTarget: 'Please enter the invoke target',
      cronExpression: 'Please enter the cron expression',
    },
    notice: {
      title: 'Please enter the title',
      type: 'Please enter the type',
      content: 'Please enter the content',
    },
    tenant: {
      contactUserName: 'Please enter the contact user',
      contactPhone: 'Please enter the contact mobile',
      companyName: 'Please enter the contact name',
      licenseNumber: 'Please enter the license number',
      username: 'Please enter the username',
      password: 'Please enter the password',
      accountCount: 'Please enter the account count',
      expireTime: 'Please choose a expire time',
      packageId: 'Please choose a tenant package',
      address: 'Please enter the address',
      intro: 'Please enter the intro',
      domain: 'Please enter the domain',
      packageName: 'Please enter the package name',
    },
  },
  workflow: {
    clearRow: 'Clear Row Data',
    addRowAbove: 'Add Row Above',
    addRowBelow: 'Add Row Below',
    prevRow: 'Prev',
    nextRow: 'Next',
    formDesign: 'Form Design',
    processDesign: 'Process Design',
    listDesign: 'List Design',
    formSetting: 'Form Setting',
    label: {
      appInfo: 'Application',
      appName: 'App Name',
      appIcon: 'App Icon',
      appIconColor: 'Icon Color',
      appIconView: 'Preview',
      formName: 'Form Name',
      formIcon: 'Form Icon',
      formVersion: 'Version',
      componentProperties: 'Component',
      formProperties: 'Form',
      dataTitle: 'Data Title',
      labelPosition: 'Label Position',
      labelWidth: 'Label Width',
      formDesc: 'Form Desc',
      belongForm: 'Belong Form',
      dateRange: 'Date Range',
      currentNode: 'Node',
      nodeName: 'Node Name',
      initiator: 'Initiator',
      taskArrivalTime: 'Task Arrival Time',
      startTime: 'Start Time',
      endTime: 'End Time',
      duration: 'Duration',
      formStatus: 'Status',
      agentAllName: 'Agent/Delegator',
      agentTime: 'Agent Time',
      agentName: 'Agent Name',
      delegatorName: 'Delegator Name',
      agentStart: 'Start Time',
      agentEnd: 'End Time',
      agentType: 'Agent Type',
      agentReason: 'Agent Reason',
      agentFile: 'Agent File',
      roleName: 'Role Name',
      roleGroup: 'Role Group',
    },
    rule: {
      appName: 'App name cannot be empty',
      appIcon: 'Icon cannot be empty',
      appIconColor: 'Icon color cannot be empty',
      appSort: 'Sort cannot be empty',
      appStatus: 'Status cannot be empty',
    },
    component: {
      layoutComponent: 'Layout Component',
      basicComponent: 'Basic Component',
      advancedComponent: 'Advanced Component',
      code: 'Component Code',
      name: 'Component Name',
      placeholder: 'Placeholder',
      required: 'Required',
      format: 'Format',
      defaultValue: 'Default Value',
      hidden: 'Hidden',
      hiddenTip: 'Hide conditions, hide controls when conditions are met',
      hiddenBtn: 'Please set hidden conditions',
      hiddenPlaceholder:
        'When the expression value resolves to true, the current control is hidden',
      numericalPrecision: 'Numerical Precision',
      precisionTip: 'places after the decimal point',
      areaLevel: 'Area Level',
      associatedForm: 'Associated Form',
      dataScope: 'Data Scope',
      dataFill: 'Data Fill',
      displayField: 'Display Field',
      associatedProperty: 'Associated Property',
      formulaConfig: 'Formula Config',
      formulaConfigTip: 'Set Formula',
      dateFormat: 'Date Format',
      displayDuration: 'Display duration',
      isMultiple: 'Multiple',
      deptFilter: 'Dept Filter',
      description: 'Description',
      fontSize: 'Font Size',
      fontWeight: 'Font Weight',
      fontColor: 'Font Color',
      showIcon: 'Show Icon',
      justifiy: 'Justifiy',
      columnGutter: 'Column Gutter',
      columnCount: 'Column Count',
      displayChinese: 'Display Chinese',
      inputLines: 'Lines',
      maxScore: 'Max Score',
      allowHalf: 'Allow Half',
      showScore: 'Show Score',
      optionConfig: 'Option Config',
      optionStatic: 'Static',
      optionDynamic: 'Dynamic',
      optionDict: 'Dict',
      isExpand: 'Expand',
      serialRule: 'Rule',
      showSignature: 'Show Signature',
      allowLocal: 'Allow Update Local Signature',
      showCombine: 'Show Signature Combine',
      signatureConfig: 'Signature Combine Size',
      showDate: 'Show Date',
      showLineWidth: 'Line Width',
      showLineColor: 'Line Color',
      showBorder: 'Border',
      defaultLines: 'Default Lines',
      fieldSort: 'Field Sort',
      fileSize: 'File Size',
      fileNum: 'File Num',
      fileType: 'File Type',
      imageSize: 'Image Size',
      imageNum: 'Image Num',
      imageZip: 'Image Zip',
      userFilter: 'User Filter',
      checkDuplicate: 'Duplicate entries are not allowed',
    },
    form: {
      selectIcon: 'Select Icon',
      iconColor: 'Icon Color',
      dataTitlePlaceholder: 'Please select the data title',
      formDescPlaceholder: 'Please enter the form description',
      formNamePlaceholder: 'Please enter the form name',
      formNameRule: 'Please enter the form name',
      formNameLength: 'Between 2 and 50 characters long',
      formIconRule: 'Please select the form icon',
      dataTitleRule: 'Please select the data title',
      edit: 'Edit',
      closeEdit: 'Close Edit',
      defaultTemplate: 'Default Print Template',
      flowLog: 'Flow Log',
      comment: 'Comment',
      viewFlowChart: 'View Flow Chart',
    },
    process: {
      approver: 'Approver',
      ccMember: 'CC',
      conditionalBranch: 'Condition',
      parallelBranch: 'Parallel',
      inclusiveBranch: 'Inclusive',
      subProcess: 'Sub-Process',
      processCompleted: 'Process Completed',
      nodeProperty: 'Node Property',
      nodeId: 'Node ID',
      nodeApprover: 'Approver',
      approverEmpty: 'Approver Empty',
      mutiApproverType: 'Muti Approver Type',
      formPermission: 'Form Permission',
      buttonPermission: 'Button Permission',
      condition: 'Condition',
      selectApprover: 'Select Approver',
      user: 'User',
      dept: 'Dept',
      role: 'Role',
      form: 'Form',
      leader: 'Leader',
    },
    list: {
      fieldSetting: 'Field Settings',
      listSetting: 'List Settings',
      search: 'Search',
      listField: 'List Field',
      sortField: 'Sort Field',
      sortDirection: 'Sort Direction',
      functionBtn: 'Function Button',
    },
    settings: {
      submitValidate: 'Submit Validate',
      dynamicValidate: 'Dynamic Validate',
      businessRule: 'Business Rule',
      messageReminder: 'Message',
      associationList: 'Association List',
      printTemplate: 'Print Template',
      addRule: 'Add',
      immediatelySet: 'Immediately Set',
      submitEmpty: 'Submit verification as empty',
      submitEmptyTip:
        'When submitting the form, data that meets the verification rules will not be allowed to be submitted',
      submitDesc:
        'Explanation: Data that meets the following validation rules when submitting the form will not be allowed to be submitted. Please avoid entering mutually exclusive conditions between multiple rules to avoid front-end validation errors',
      businessEmpty: 'Business rule as empty',
      businessEmptyTip:
        'Setting business rules allows for operations such as inserting, updating, and deleting data from other forms',
      businessDesc:
        'Explanation: Business rules are used to handle data association changes between forms. Through business rules, data from other forms can be inserted, updated, deleted, and other operations can be performed',
      listEmpty: 'The current form is not currently associated with any other forms',
      listEmptyTip:
        'Please make the settings when associating the form with its associated controls in other forms',
      listDesc:
        'Explanation: When the current form is associated with associated controls in other forms, you can configure an associated list here to achieve quick viewing and addition of data from other forms',
      printAdd: 'Add',
      printPreview: 'Default Template Preview',
      printEmpty: 'You haven not added any custom print templates yet',
      printEmptyTip: 'The fields in the form can be freely formatted for daily document printing',
      printDesc:
        'Explanation: Fields within the form can be freely formatted for daily document printing',
      systemField: 'System Field',
      formField: 'Form Field',
    },
    error: {
      submitAgain: 'The form code and process instance ID cannot be empty',
      formCode: 'The form code cannot be empty',
      formId: 'The form ID cannot be empty',
      params: 'There is an issue with the parameters',
    },
  },
};
