"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import LogoutIcon from "../ui/icons/LogoutIcon";

export default function LogoutForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem("jwtToken");

      // Clear auth state in Redux
      dispatch(logout());

      // Redirect to login page
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="text-[#64748B] py-2 ml-2 rounded">
      <div className="flex items-center hover:bg-gray-50 p-1 rounded">
        <LogoutIcon />
        <div className="pl-1">Выйти</div>
      </div>
    </button>
  );
}
