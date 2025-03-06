import { Transaction } from './transaction';
import { UserInfo } from './user';

export interface AdminDashboardTransactionResponse {
  totalRecord: number;
  totalPage: number;
  pageIndex: number;
  data: Transaction[];
}

export interface AdminDashboardUserResponse {
    totalRecord: number;
  data: UserInfo[];
}
