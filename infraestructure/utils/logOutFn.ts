import Cookies from "js-cookie";
import router from "next/navigation";

//Cualquier fn para log out ira aqui
export const logOutFn = () => {
  Cookies.remove("token");
};
