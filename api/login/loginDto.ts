export const TenantStatus = {
  AVAILABLE: 1,
  INACTIVE: 2,
  NOTFOUND: 3,
};

export interface ILoginModel {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
  tenantId?: number;
}
export interface IAuthenResultModel {
  accessToken: string;
  refreshToken: string;
  expireInSeconds: boolean;
}
