import * as qs from 'querystring';
import {
  GetSubTeamQuery,
  GetSubTeams,
  MemberSearchQuery,
  Organization,
  OrganizationMemberSearchQuery, OrganizationQuery,
  Organizations,
  OrgRole,
  OrgRoles,
  SoaTeams,
  TeamDetail,
  TeamMember,
  TeamMembers,
  TeamMembersQuery,
  TeamPickerQuery,
  TeamSearchQuery,
} from '../types';

import { ApiClient, OpenApiOptions } from './client';

export class OrgApi extends ApiClient {
  urlPrefix = '/org';
  constructor(options: OpenApiOptions) {
    super(options);
  }
  // 处理返回的数据没有 name 字段
  fixMemberName (teamMember: TeamMember): TeamMember {
    teamMember.name = teamMember.name || (teamMember.profile && teamMember.profile.name) || (teamMember.userInfo && teamMember.userInfo.name);
    return teamMember;
  }
  fixMembersName (teamMembers: TeamMember[]): TeamMember[] {
    return teamMembers.map((item) => this.fixMemberName(item));
  }

  withTenantId(tenantId: string, tenantType?: string): OrgApi {
    return super.withTenantId(tenantId, tenantType) as OrgApi;
  }

  withHeaders(headers: any): ApiClient {
    return super.withHeaders(headers) as OrgApi;
  }

  async getById (organizationId: string): Promise<Organization> {
    return this.tws.get(
      `${this.urlPrefix}/v1/organizations/${organizationId}`,
      {},
    );
  }

  async getAdmins (organizationId: string): Promise<TeamMembers> {
    return this.tws.get(
      `${this.urlPrefix}/v1/organizations/${organizationId}/admins`,
      {},
    );
  }

  async getRoles (organizationId: string, query: any): Promise<OrgRoles> {
    return this.tws.get(
      `${this.urlPrefix}/v1/organizations/${organizationId}/roles`,
      query || {},
    );
  }
  async getRole (organizationId: string, roleId: string): Promise<OrgRole> {
    return this.tws.get(
        `${this.urlPrefix}/v1/organizations/${organizationId}/roles/${roleId}`);
  }

  /**
   * 获取企业信息
   *
   * @param organizationId
   */
  async getOrganizationInfo(organizationId: string): Promise<Organization> {
    return this.tws.get<Organization> (
      `${this.urlPrefix}/v1/organizations/${organizationId}`,
      {
        organizationId,
      },
    );
  }

  async getOrganizationAdmins(organizationId: string): Promise<TeamMembers> {
    return this.tws.get(
      `${this.urlPrefix}/v1/organizations/${organizationId}/admins`,
      {},
    );
  }

  async getOrganizationRoles(organizationId: string, type: string, pageSize?: number, pageToken?: string): Promise<OrgRoles> {
    return this.tws.get(
      `${this.urlPrefix}/v1/organizations/${organizationId}/roles`,
      {
        type,
        pageToken,
        pageSize,
      },
    );
  }

  async getJoinedOrganizations(userId: string, pageSize?: number, pageToken?: string): Promise<Organizations> {
    return this.tws.get(
      `${this.urlPrefix}/v1/users/${userId}/organizations`,
      {
        pageToken,
        pageSize,
      },
    );
  }

  async queryJoinedOrganizations(userId: string, param?: OrganizationQuery, pageSize?: number, pageToken?: string): Promise<Organizations> {
    return this.tws.get(
        `${this.urlPrefix}/v1/users/${userId}/organizations`,
        {
          ...(param || {}),
          pageToken,
          pageSize,
        },
    );
  }

  /**
   * 检查用户是否属于某个企业
   *
   * @param organizationId
   * @param userId
   */
  async memberCheckExist(organizationId: string, userId: string): Promise<boolean> {
    interface CheckExistResult {
      exist: boolean;
    }

    const result = await this.tws.get<CheckExistResult>(
      `${this.urlPrefix}/v1/organizations/${organizationId}/members:checkExist`,
      {
        organizationId,
        _userId: userId,
      },
    );
    return result.exist;
  }

  // SOA Organzation API
  async getOrganizationMemberByUser (_organizationId: string, _userId: string) {
    return this.tws.get<TeamMember>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/members:getByUser?_userId=${_userId}`,
    );
  }
  async getOrganizationMemberById (_organizationId: string, _memberId: string) {
    return this.tws.get<TeamMember>(
        `${this.urlPrefix}/v1/organizations/${_organizationId}/members/${_memberId}`,
    );
  }

  // ======================== SOA ORG Team API ========================

  async getOrganizationTeams (_organizationId: string, queryObject: TeamPickerQuery) {
    return this.tws.get<SoaTeams>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/teams?${qs.stringify(queryObject as any)}`,
    );
  }

  async searchOrganizationTeams (_organizationId: string, queryObject: TeamSearchQuery) {
    return this.tws.get<SoaTeams>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/teams:search?${qs.stringify(queryObject as any)}`,
    );
  }

  async getOrganizationMembers (_organizationId: string, queryObject: OrganizationMemberSearchQuery) {
    return this.tws.get<TeamMembers>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/members?${qs.stringify(queryObject as any)}`,
    );
  }

  async searchOrganizationMembers (_organizationId: string, queryObject: OrganizationMemberSearchQuery) {
    return this.tws.get<TeamMembers>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/members:search?${qs.stringify(queryObject as any)}`,
    );
  }

  async getOrganizationTeamDetail (_organizationId: string, _teamId: string) {
    return this.tws.get<TeamDetail>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}`,
    );
  }

  async getOrganizationTeamMembers (_organizationId: string, _teamId: string, queryObject: TeamMembersQuery) {
    return this.tws.get<TeamMembers>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/members?${qs.stringify(queryObject as any)}`,
    );
  }

  async searchOrganizationTeamMembers (_organizationId: string, _teamId: string, queryObject: MemberSearchQuery) {
    return this.tws.get<TeamMembers>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/members:search?${qs.stringify(queryObject as any)}`,
    );
  }

  async getOrganizationSubTeams (_organizationId: string, _teamId: string, queryObject: GetSubTeamQuery) {
    return this.tws.get<GetSubTeams>(
      `${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/subTeams?${qs.stringify(queryObject as any)}`,
    );
  }

  async isOrgAdmin(_organizationId: string, _userId: string): Promise<boolean> {
    const NONE_ROLE_ADMIN = 0;
    const member = await this.getOrganizationMemberByUser(_organizationId, _userId);
    if (!member) {
      return false;
    }
    return member.role > NONE_ROLE_ADMIN;
  }

}
