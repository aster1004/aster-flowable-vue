declare namespace TenantPackage {
  export interface TenantPackageParams extends Page.ReqPage {
    packageName: string;
    status: string;
  }

  export interface TenantPackageInfo {
    id?: string;
    packageName: string;
    menuIds: string[];
    status: string;
    remark: string;
  }
}
