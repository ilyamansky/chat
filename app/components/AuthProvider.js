// components/AuthProvider.js
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      dispatch(setCredentials(storedToken));
    }
  }, [dispatch]);

  return children;
}
