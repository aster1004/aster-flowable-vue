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
    // 表单编码
    code: string;
    // 列表列名
    columns: string[];
    // 自定义查询参数
    customParams: CustomParams;
    // 自定义查询参数的配置
    customItems: WorkComponent.ComponentConfig[];
    // 数据主键
    dataPrimaryKey?: string;
  }
}
