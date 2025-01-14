export interface LoginForm {
    email: string;
    password: string;
  }
  
  export interface EmailForm {
    email: string;
  }
  
  export interface VerificationForm {
    email: string;
    otpCode: string;
  }
  
  export interface ResetForm {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface UpdatePasswordForm {
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface AddressFormInterface {
    logo?: string;
    name: string;
    managerEmail: string;
    address: string;
    provinceId: number;
    districtId: number;
    wardId: number;
  }
  