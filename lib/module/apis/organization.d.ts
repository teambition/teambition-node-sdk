import { GetSubTeamQuery, GetSubTeams, MemberSearchQuery, Organization, OrganizationMemberSearchQuery, OrganizationQuery, Organizations, OrgRole, OrgRoles, SoaTeams, TeamDetail, TeamMember, TeamMembers, TeamMembersQuery, TeamPickerQuery, TeamSearchQuery } from '../types';
import { ApiClient, OpenApiOptions } from './client';
export declare class OrgApi extends ApiClient {
    urlPrefix: string;
    constructor(options: OpenApiOptions);
    fixMemberName(teamMember: TeamMember): TeamMember;
    fixMembersName(teamMembers: TeamMember[]): TeamMember[];
    withTenantId(tenantId: string, tenantType?: string): OrgApi;
    withHeaders(headers: any): ApiClient;
    getById(organizationId: string): Promise<Organization>;
    getAdmins(organizationId: string): Promise<TeamMembers>;
    getRoles(organizationId: string, query: any): Promise<OrgRoles>;
    getRole(organizationId: string, roleId: string): Promise<OrgRole>;
    /**
     * 获取企业信息
     *
     * @param organizationId
     */
    getOrganizationInfo(organizationId: string): Promise<Organization>;
    getOrganizationAdmins(organizationId: string): Promise<TeamMembers>;
    getOrganizationRoles(organizationId: string, type: string, pageSize?: number, pageToken?: string): Promise<OrgRoles>;
    getJoinedOrganizations(userId: string, pageSize?: number, pageToken?: string): Promise<Organizations>;
    queryJoinedOrganizations(userId: string, param?: OrganizationQuery, pageSize?: number, pageToken?: string): Promise<Organizations>;
    /**
     * 检查用户是否属于某个企业
     *
     * @param organizationId
     * @param userId
     */
    memberCheckExist(organizationId: string, userId: string): Promise<boolean>;
    getOrganizationMemberByUser(_organizationId: string, _userId: string): Promise<TeamMember>;
    getOrganizationMemberById(_organizationId: string, _memberId: string): Promise<TeamMember>;
    getOrganizationTeams(_organizationId: string, queryObject: TeamPickerQuery): Promise<SoaTeams>;
    searchOrganizationTeams(_organizationId: string, queryObject: TeamSearchQuery): Promise<SoaTeams>;
    getOrganizationMembers(_organizationId: string, queryObject: OrganizationMemberSearchQuery): Promise<TeamMembers>;
    searchOrganizationMembers(_organizationId: string, queryObject: OrganizationMemberSearchQuery): Promise<TeamMembers>;
    getOrganizationTeamDetail(_organizationId: string, _teamId: string): Promise<TeamDetail>;
    getOrganizationTeamMembers(_organizationId: string, _teamId: string, queryObject: TeamMembersQuery): Promise<TeamMembers>;
    searchOrganizationTeamMembers(_organizationId: string, _teamId: string, queryObject: MemberSearchQuery): Promise<TeamMembers>;
    getOrganizationSubTeams(_organizationId: string, _teamId: string, queryObject: GetSubTeamQuery): Promise<GetSubTeams>;
    isOrgAdmin(_organizationId: string, _userId: string): Promise<boolean>;
}
