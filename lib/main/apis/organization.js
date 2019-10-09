"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const qs = __importStar(require("querystring"));
const client_1 = require("./client");
class OrgApi extends client_1.ApiClient {
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
    getById(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}`, {});
        });
    }
    getAdmins(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/admins`, {});
        });
    }
    getRoles(organizationId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/roles`, query || {});
        });
    }
    getRole(organizationId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/roles/${roleId}`);
        });
    }
    /**
     * 获取企业信息
     *
     * @param organizationId
     */
    getOrganizationInfo(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}`, {
                organizationId,
            });
        });
    }
    getOrganizationAdmins(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/admins`, {});
        });
    }
    getOrganizationRoles(organizationId, type, pageSize, pageToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/roles`, {
                type,
                pageToken,
                pageSize,
            });
        });
    }
    getJoinedOrganizations(userId, pageSize, pageToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/users/${userId}/organizations`, {
                pageToken,
                pageSize,
            });
        });
    }
    queryJoinedOrganizations(userId, param, pageSize, pageToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/users/${userId}/organizations`, Object.assign(Object.assign({}, (param || {})), { pageToken,
                pageSize }));
        });
    }
    /**
     * 检查用户是否属于某个企业
     *
     * @param organizationId
     * @param userId
     */
    memberCheckExist(organizationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.tws.get(`${this.urlPrefix}/v1/organizations/${organizationId}/members:checkExist`, {
                organizationId,
                _userId: userId,
            });
            return result.exist;
        });
    }
    // SOA Organzation API
    getOrganizationMemberByUser(_organizationId, _userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members:getByUser?_userId=${_userId}`);
        });
    }
    getOrganizationMemberById(_organizationId, _memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members/${_memberId}`);
        });
    }
    // ======================== SOA ORG Team API ========================
    getOrganizationTeams(_organizationId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams?${qs.stringify(queryObject)}`);
        });
    }
    searchOrganizationTeams(_organizationId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams:search?${qs.stringify(queryObject)}`);
        });
    }
    getOrganizationMembers(_organizationId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members?${qs.stringify(queryObject)}`);
        });
    }
    searchOrganizationMembers(_organizationId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/members:search?${qs.stringify(queryObject)}`);
        });
    }
    getOrganizationTeamDetail(_organizationId, _teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}`);
        });
    }
    getOrganizationTeamMembers(_organizationId, _teamId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/members?${qs.stringify(queryObject)}`);
        });
    }
    searchOrganizationTeamMembers(_organizationId, _teamId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/members:search?${qs.stringify(queryObject)}`);
        });
    }
    getOrganizationSubTeams(_organizationId, _teamId, queryObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tws.get(`${this.urlPrefix}/v1/organizations/${_organizationId}/teams/${_teamId}/subTeams?${qs.stringify(queryObject)}`);
        });
    }
    isOrgAdmin(_organizationId, _userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const NONE_ROLE_ADMIN = 0;
            const member = yield this.getOrganizationMemberByUser(_organizationId, _userId);
            if (!member) {
                return false;
            }
            return member.role > NONE_ROLE_ADMIN;
        });
    }
}
exports.OrgApi = OrgApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaXMvb3JnYW5pemF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUFrQztBQW1CbEMscUNBQXFEO0FBRXJELE1BQWEsTUFBTyxTQUFRLGtCQUFTO0lBRW5DLFlBQVksT0FBdUI7UUFDakMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRmpCLGNBQVMsR0FBRyxNQUFNLENBQUM7SUFHbkIsQ0FBQztJQUNELG9CQUFvQjtJQUNwQixhQUFhLENBQUUsVUFBc0I7UUFDbkMsVUFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFJLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFDRCxjQUFjLENBQUUsV0FBeUI7UUFDdkMsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELFlBQVksQ0FBQyxRQUFnQixFQUFFLFVBQW1CO1FBQ2hELE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFXLENBQUM7SUFDNUQsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQVcsQ0FBQztJQUM5QyxDQUFDO0lBRUssT0FBTyxDQUFFLGNBQXNCOztZQUNuQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUNqQixHQUFHLElBQUksQ0FBQyxTQUFT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