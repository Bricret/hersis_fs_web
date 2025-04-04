export interface IUserAuth {
  data: IUserAuthData;
  accessToken: string;
  role: string;
}

export interface IUserAuthData {
  email: string;
  sub: string;
  role: string;
  name: string;
  isActive: boolean;
}
