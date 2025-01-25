"use client";

import { useContext, useEffect, useState, use } from "react";
import { ChatContext } from "../../chatState";
import Head from "next/head";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import ChatDetails from "../../components/ChatDetails";
import { useRouter } from "next/navigation";

export default function ChatPage({ params }) {
  const { name } = use(params);
  //console.log(name);
  const router = useRouter();
  const [isValidUser, setIsValidUser] = useState(false);

  const validUsernames = ["krikunenko"]; // Список существующих пользователей

  useEffect(() => {
    if (validUsernames.includes(name)) {
      setIsValidUser(true);
    } else {
      router.push("/");
    }
  }, [name, router]); // Добавляем зависимости

  // Если имя пользователя не валидно, ничего не рендерим
  if (!isValidUser) {
    return null; // Или можно вернуть какой-то индикатор загрузки
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
