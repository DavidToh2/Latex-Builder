export interface userSocialData {
    email: string,
    groups: string[],
    bio: string,
    joinDate: string
}

export interface userData {
    username: string
    socialData: userSocialData,
    accountStatus: string,
    questions: string[]
}

const emptyUserSocialData = {
    email: '',
    groups: <string[]>[],
    bio: '',
    joinDate: ''
}

const emptyUserData = {
    username: '',
    socialData: emptyUserSocialData,
    accountStatus: '',
    questions: <string[]>[]
} as userData

export interface userPerms {
    owner: string,
    canModifyUsers: string[],
    canModifyGroups: string[],
    canReadUsers: string[],
    canReadGroups: string[],
    canAccessPublic: boolean
}

const emptyUserPerms = {
    owner: '',
    canModifyUsers: <string[]>[],
    canModifyGroups: <string[]>[],
    canReadUsers: <string[]>[],
    canReadGroups: <string[]>[],
    canAccessPublic: false
} as userPerms

export { emptyUserData, emptyUserPerms }