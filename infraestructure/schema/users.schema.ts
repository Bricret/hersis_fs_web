import { z } from "zod";
import { Roles } from "../interface/users/rols.interface";

export const userSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  email: z.string().email("Email Invalido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(Object.values(Roles) as [string, ...string[]], {
    message: "El rol es obligatorio",
  }),
  branch: z.string().min(1, "La sucursal es obligatoria"),
});

export type UserSchema = z.infer<typeof userSchema>;
