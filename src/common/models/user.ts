export interface UserAuth {
  userId: string;
  username?: string;
  email: string;
  roles: string[];
}

export interface UserInfo {
  accountId: number;
  email: string;
  roleName: string;
  status: string;
  emailConfirmed: boolean;
  fullName: string;
  roles: string;
}

export interface UserToUpdate {
  accountId: number;
  email?: string;
  roleName?: string;
  status?: string;
  emailConfirmed?: boolean;
}
