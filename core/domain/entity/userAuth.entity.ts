export interface IUserAuth {
  data: IUserAuthData;
  accessToken: string;
  role: string;
}

export interface IUserAuthData {
  sub: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
}
