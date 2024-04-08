declare namespace Tenant {
  export interface TenantParams extends Page.ReqPage {
    contactUserName: string;
    companyName: string;
    status: string;
  }

  export interface TenantInfo {
    id?: string;
    contactUserName: string;
    contactPhone: string;
    companyName: string;
    licenseNumber: string;
    accountCount: number;
    expireTime: string;
    address: string;
    intro: string;
    domain: string;
    status: string;
    remark: string;
    packageId: string;
    username: string;
    password: string;
    createTime?: string;
  }
}
