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
  emailConfirmed : boolean;
  userName: string;
  roles: string;
}
export interface UserToCreate {
  email: string;
  roleName: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserToUpdate {
  accountId: number; 
  email?: string; 
  roleName?: string;
  status?: string;
  emailConfirmed?: boolean;
}
