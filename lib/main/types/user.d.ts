export interface UserInfo {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    title: string;
    email: string;
    openId: string;
    source: string;
    aliyunPK: string;
    _appId: string;
    _userId: string;
    _id: string;
    phone: string;
    emails: any[];
}
export interface AccessTokenInfo {
    user_id: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
    error: string;
}
export interface UserProfile {
    _id: string;
    birthday: string;
    city: string;
    country: string;
    email: string;
    entryTime: string;
    name: string;
    phone: string;
    pinyin: string;
    position: string;
    province: string;
    py: string;
    staffType: string;
}
