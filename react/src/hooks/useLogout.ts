import { logout } from "../api";

const useLogout = () => ({ onLogout: () => logout() });

export default useLogout;
