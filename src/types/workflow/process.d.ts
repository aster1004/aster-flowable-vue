/**
 * 流程相关接口
 */
declare namespace Process {
  /**
   * 自定义查询参数
   */
  export interface CustomParams {
    [key: string]: any;
  }

  /**
   * 流程实例分页查询参数
   */
  export interface InstanceParams extends Page.ReqPage {
    // 主键
    id?: string;
    // 表单编码
    code: string;
    // 流程定义ID
    procDefId?: string;
    // 流程实例ID
    procInstId?: string;
    // 列表列名
    columns: string[];
    // 自定义查询参数
    customParams: CustomParams;
    // 自定义查询参数的配置
    customItems: WorkComponent.ComponentConfig[];
    // 关联表单参数
    associationParams?: WorkForm.AssocaitionListQuery;
  }

  /**
   * 流程实例查询参数
   */
  export interface InstanceQueryParams {
    // 主键
    id?: string;
    // 表单编码
    code: string;
    // 流程定义ID
    procDefId?: string;
    // 流程实例ID
    procInstId?: string;
  }

  /**
   * 流程实例信息
   */
  export interface InstanceInfo {
    // 主键
    id?: string;
    // 流程定义ID
    procDefId?: string;
    // 流程实例ID
    procInstId?: string;
    // 表单状态
    formStatus?: string;
    // 创建时间
    createTime?: string;
    // 创建人
    createBy?: string;
    // 表单字段
    [key: string]: any;
  }
  /**
   * 流程实例详情
   */
  export interface InstanceDetail {
    instanceInfo: InstanceInfo;
    formInfo: WorkForm.FormModel;
    processInfo?: string;
    nodeConfig?: WorkForm.NodeConfig;
  }
}
