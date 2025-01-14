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
    isConfirmed: boolean;
  }
  