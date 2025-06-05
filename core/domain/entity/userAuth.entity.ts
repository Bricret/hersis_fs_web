export interface IUserAuth {
  data: IUserAuthData;
  accessToken: string;
  role: string;
}

export interface IUserAuthData {
  id: string;
  email: string;
  sub: string;
  role: string;
  name: string;
  isActive: boolean;
}
