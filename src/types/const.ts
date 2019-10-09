export const CookieNames = {
  TB_ORGANIZATION_ID: 'TB_ORGANIZATION_ID',
  TB_TENANT_ID: 'TB_TENANT_ID',
  TB_TENANT_TYPE: 'TB_TENANT_TYPE',
  TB_ACCESS_TOKEN: 'TB_ACCESS_TOKEN',
  TB_ACCESS_TOKEN_INFO: 'TB_ACCESS_TOKEN_INFO',
};

export const HeaderNames = {
  TENANT_ID: 'X-TENANT-ID',
};

export const InvalidSession = {
  error: 'invalid session',
  message: 'invalid session, need login',
  success: false,
};

export const InvalidTenant = {
  error: 'invalid access',
  message: 'invalid tenant access, access forbidden',
  success: false,
};

export const InvalidAppUsable = {
  error: 'AppNotUsable',
  message: 'has no right to use app',
  success: false,
};
