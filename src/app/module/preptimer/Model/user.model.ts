export interface UserModel {
    userId: number;
    companyId: number;
    loginName: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    isActive?: boolean;
    createdOn?: string;
    modifiedOn?: string;
  }
