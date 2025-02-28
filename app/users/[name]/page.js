"use client";

import { useContext, useEffect, useState, use } from "react";
import { ChatContext } from "../../chatState";
import Head from "next/head";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import ChatDetails from "../../components/ChatDetails";
import ChatInput from "@/app/components/ChatInput";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ChatPage({ params }) {
  const { name } = use(params);
  //console.log(name);
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  //const [isValidUser, setIsValidUser] = useState(false);

  //const validUsernames = ["krikunenko"]; // Список существующих пользователей

  {
    /*useEffect(() => {
    if (validUsernames.includes(name)) {
      setIsValidUser(true);
    } else {
      router.push("/");
    }
  }, [name, router]); // Добавляем зависимости

  // Если имя пользователя не валидно, ничего не рендерим
  if (!isValidUser) {
    return null; // Или можно вернуть какой-то индикатор загрузки
  }*/
  }

  useEffect(() => {
    // Redirect if no token or incorrect user
    const storedToken = localStorage.getItem("jwtToken");
    if (!token && !storedToken) {
      router.push("/");
    }

    // If you want to validate the username from the token:
    // const decodedToken = jwtDecode(storedToken);
    // if (decodedToken.name !== name) {
    //   router.push("/login");
    // }
  }, [token, name, router]);

  if (!token) {
    return null; // Loading state
  }

  return (
    <div className="h-screen flex items-center justify-center bg-custom-bg-gray">
      <div className="w-screen h-screen shadow-xl flex">
        {/* Левая панель с чатом */}
        <ChatList />
        {/*<SearchableDropdown />*/}

        {/* Правая панель с сообщениями */}
        <ChatWindow />

        <ChatDetails />
      </div>
    </div>
  );
}
