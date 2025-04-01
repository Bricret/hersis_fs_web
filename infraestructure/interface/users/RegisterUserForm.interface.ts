export interface RegisterUserForm {
  name: string;
  username: string;
  email: string;
  rol: string;
  sucursal: string;
  password?: string;
  generatePassword?: boolean;
}

export const inititalRegisterUser: RegisterUserForm = {
  name: "",
  username: "",
  email: "",
  rol: "",
  sucursal: "",
  password: "",
  generatePassword: true,
};
