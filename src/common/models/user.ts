export interface UserAuth {
  userId: string;
  username: string;
  email: string;
  roles: string[]; // Cập nhật thành mảng
}

export interface UserInfo {
  accountId: number;
  email: string;
  roleName: string;
  status: string;
  emailConfirmed : boolean;
  userName: string;
}
// Thêm:
export interface UserToCreate {
  email: string;
  roleName: string;
  password?: string;
  confirmPassword?: string;
}

export interface UserToUpdate {
  accountId: number; // ID của user để biết đang cập nhật user nào
  email?: string; // các trường optional
  roleName?: string;
  status?: string;
  emailConfirmed?: boolean;
}
