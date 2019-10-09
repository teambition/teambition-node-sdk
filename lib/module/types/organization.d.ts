import { UserInfo, UserProfile } from './user';
/**
 * 企业信息
 */
export interface Organization {
    _id: string;
    createdAt: string;
    updatedAt: string;
    _creatorId: string;
    name: string;
    logo: string;
    location: string;
    category: string;
    description: string;
    website: string;
    background: string;
    contactPhone: string;
    desiredMemberCount: string;
    isDeleted: string;
    py: string;
    pinyin: string;
    isPublic: boolean;
    _defaultRoleId: string;
    _defaultOrgRoleId: string;
    staffTypes: string[];
    positions: string[];
    okrProgressMode: string;
    projectIds: string[];
    _defaultTeamId: string;
    openId: string;
    plan?: {
        expired: string;
        isExpired: boolean;
        days: number;
    };
}
export interface TeamMember {
    _boundToObjectId: string;
    _id: string;
    _invitorId: string;
    _roleId: string;
    _userId: string;
    alreadyExist: boolean;
    boundToObjectType: string;
    directMember: boolean;
    invited: string;
    isDisabled: boolean;
    joined: string;
    name: string;
    pinyin: string;
    profile: UserProfile;
    projectExperienceIds: string[];
    pushStatus: boolean;
    py: string;
    role: number;
    teams: UserTeams[];
    unreadCount: number;
    userInfo: UserInfo;
    visited: string;
}
export interface PageResult {
    nextPageToken: string;
    totalSize: number;
}
export interface TeamMembers extends PageResult {
    result: TeamMember[];
}
export interface MemberSearchQuery {
    q: string;
    withJoinedTeams?: boolean;
    pageToken?: string;
    pageSize?: number;
}
export interface TeamSearchQuery {
    q: string;
    withMemberCount?: boolean;
    pageToken?: string;
    pageSize?: number;
    omitSubUnit?: string;
}
export interface OrganizationMemberSearchQuery {
    q: string;
    pageToken: string;
    pageSize: number;
    withJoinedTeams: boolean;
    filter: string;
    userIds?: string[];
    teamIds?: string[];
    groupIds?: string[];
}
export interface TeamPickerQuery {
    onlyFirstLevel?: boolean;
    withMemberCount?: boolean;
    pageToken?: string;
    pageSize?: number;
    omitSubUnit?: string;
}
export interface TeamMembersQuery {
    filter?: boolean;
    orderBy?: boolean;
    pageToken?: string;
    pageSize?: number;
    omitSubUnit?: string;
}
export interface GetSubTeamQuery {
    onlyFirstLevel?: boolean;
    withMemberCount?: boolean;
    omitSubUnit?: string;
}
export interface OrgRole {
    _id: string;
    _organizationId: string;
    isDefault: boolean;
    level: number;
    name: string;
    permissions: string[];
    type: string;
}
export interface OrgRoles extends PageResult {
    result: OrgRole[];
}
export interface Organizations extends PageResult {
    result: Organization[];
}
export interface UserTeams {
    _creatorId: string;
    _id: string;
    _leaderId: string;
    _organizationId: string;
    _parentId: string;
    created: string;
    memberCount: number;
    membersCount: number;
    name: string;
    pos: number;
    style: string;
    subTeamsCount: number;
    type: string;
    updated: string;
}
export interface SoaTeam {
    _id: string;
    name: string;
    _creatorId: string;
    _organizationId: string;
    _parentId: string;
    type: string;
    style: string;
    pos: number;
    created: string;
    updated: string;
    subTeamsCount: number;
    memberCount: number;
    membersCount: number;
}
export interface SoaTeams extends PageResult {
    result: SoaTeam[];
}
export interface TeamDetail extends SoaTeam {
    _leaderId: string;
}
export interface GetSubTeams {
    result: TeamDetail[];
}
export interface GetMembers {
    result: TeamMember[];
}
export interface OrganizationQuery {
    category: string;
}
export interface OrganizationMembersQuery {
    _userIds?: string[];
    ids?: string[];
    withJoinedTeams?: boolean;
}
