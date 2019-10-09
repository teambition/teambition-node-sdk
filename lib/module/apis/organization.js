import * as qs from 'querystring';
import { ApiClient } from './client';
export class OrgApi extends ApiClient {
    constructor(options) {
        super(options);
        this.urlPrefix = '/org';
    }
    // 处理返回的数据没有 name 字段
    fixMemberName(teamMember) {
        teamMember.name = teamMember.name || (teamMember.profile && teamMember.profile.name) || (teamMember.userInfo && teamMember.userInfo.name);
        return teamMember;
    }
    fixMembersName(teamMembers) {
        return teamMembers.map((item) => this.fixMemberName(item));
    }
    withTenantId(tenantId, tenantType) {
        return super.withTenantId(tenantId, tenantType);
    }
    withHeaders(headers) {
        return super.withHeaders(headers);
    }
    async getById(organizationId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}`, {});
    }
    async getAdmins(organizationId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/admins`, {});
    }
    async getRoles(organizationId, query) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/roles`, query || {});
    }
    async getRole(organizationId, roleId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/roles/${roleId}`);
    }
    /**
     * 获取企业信息
     *
     * @param organizationId
     */
    async getOrganizationInfo(organizationId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}`, {
            organizationId,
        });
    }
    async getOrganizationAdmins(organizationId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/admins`, {});
    }
    async getOrganizationRoles(organizationId, type, pageSize, pageToken) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/roles`, {
            type,
            pageToken,
            pageSize,
        });
    }
    async getJoinedOrganizations(userId, pageSize, pageToken) {
        return this.tws.get(`${this.urlPrefix}/v1/users/${userId}/organizations`, {
            pageToken,
            pageSize,
        });
    }
    async queryJoinedOrganizations(userId, param, pageSize, pageToken) {
        return this.tws.get(`${this.urlPrefix}/v1/users/${userId}/organizations`, {
            ...(param || {}),
            pageToken,
            pageSize,
        });
    }
    /**
     * 检查用户是否属于某个企业
     *
     * @param organizationId
     * @param userId
     */
    async memberCheckExist(organizationId, userId) {
        const result = await this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/members:checkExist`, {
            organizationId,
            _userId: userId,
        });
        return result.exist;
    }
    // SOA Organzation API
    async getOrganizationMemberByUser(_organizationId, _userId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members:getByUser?_userId=${_userId}`);
    }
    async getOrganizationMemberById(_organizationId, _memberId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members/${_memberId}`);
    }
    // ======================== SOA ORG Team API ========================
    async getOrganizationTeams(_organizationId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams?${qs.stringify(queryObject)}`);
    }
    async searchOrganizationTeams(_organizationId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams:search?${qs.stringify(queryObject)}`);
    }
    async getOrganizationMembers(_organizationId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members?${qs.stringify(queryObject)}`);
    }
    async searchOrganizationMembers(_organizationId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members:search?${qs.stringify(queryObject)}`);
    }
    async getOrganizationTeamDetail(_organizationId, _teamId) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}`);
    }
    async getOrganizationTeamMembers(_organizationId, _teamId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/members?${qs.stringify(queryObject)}`);
    }
    async searchOrganizationTeamMembers(_organizationId, _teamId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/members:search?${qs.stringify(queryObject)}`);
    }
    async getOrganizationSubTeams(_organizationId, _teamId, queryObject) {
        return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/subTeams?${qs.stringify(queryObject)}`);
    }
    async isOrgAdmin(_organizationId, _userId) {
        const NONE_ROLE_ADMIN = 0;
        const member = await this.getOrganizationMemberByUser(_organizationId, _userId);
        if (!member) {
            return false;
        }
        return member.role > NONE_ROLE_ADMIN;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaXMvb3JnYW5pemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBbUJsQyxPQUFPLEVBQUUsU0FBUyxFQUFrQixNQUFNLFVBQVUsQ0FBQztBQUVyRCxNQUFNLE9BQU8sTUFBTyxTQUFRLFNBQVM7SUFFbkMsWUFBWSxPQUF1QjtRQUNqQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFGakIsY0FBUyxHQUFHLE1BQU0sQ0FBQztJQUduQixDQUFDO0lBQ0Qsb0JBQW9CO0lBQ3BCLGFBQWEsQ0FBRSxVQUFzQjtRQUNuQyxVQUFVLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUksT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUNELGNBQWMsQ0FBRSxXQUF5QjtRQUN2QyxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsWUFBWSxDQUFDLFFBQWdCLEVBQUUsVUFBbUI7UUFDaEQsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQVcsQ0FBQztJQUM1RCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQVk7UUFDdEIsT0FBTyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBVyxDQUFDO0lBQzlDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFFLGNBQXNCO1FBQ25DLE9BQU8sSUFB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