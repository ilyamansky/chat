"use client";

import { useState, useEffect, useContext } from "react";
import { mockMessages } from "../mockData/mockMessages";
import { ChatContext } from "../chatState";
import clsx from "clsx";
import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import Image from "next/image";
import MessagesFilter from "./MessagesFilter";
import SearchIcon from "../ui/icons/SearchIcon";
import FilterIcon from "../ui/icons/FilterIcon";
import InfoIcon from "../ui/icons/InfoIcon";
import CrossIconButton from "../ui/icons/CrossIconButton";
import CrossIconFilter from "../ui/icons/CrossIconFilter";

export default function ChatWindow() {
  const { state, dispatch } = useContext(ChatContext);
  const chat = state.selectedChat;
  const messages = state.messages[chat?.id] || [];
  console.log(messages);
  //const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState("");
  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
    setFilter(""); // Сбросить фильтр при переключении
  };

  // Логика для сброса счетчика непрочитанных сообщений
  useEffect(() => {
    if (chat) {
      dispatch({
        type: "RESET_UNREAD_COUNT",
        payload: {
          chatId: chat.id,
        },
      });
    }
  }, [chat]);

  /*useEffect(() => {
    if (chat) {
      const messages = mockMessages[chat.id];
      setMessages(messages);
      console.log(chat);
      console.log(messages);
    }
  }, [chat]); */
  // Функция для отметки всех сообщений как прочитанных
  /*const markAllAsRead = () => {
    const readMessages = messages.map((msg) => ({
      ...msg,
      isUnread: false,
    }));
    setMessages(readMessages);
  };*/

  /*const handleSubmit = async (event) => {
    event.preventDefault();

    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: "You",
        timestamp: new Date().toISOString(),
        isUnread: false,
      };

      try {
        const response = await fetch(`/api/messages/${chat.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        if (response.ok) {
          const updatedMessages = [...messages, newMessage];
          setMessages(updatedMessages);
          setMessage(""); // Очистка поля ввода после успешной отправки
        } else {
          console.error("Ошибка отправки сообщения");
        }
      } catch (error) {
        console.error("Ошибка отправки сообщения:", error);
      }
    }
  }; */

  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(filter.toLowerCase())
  );

  // Состояние для управления видимостью выпадающего меню
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFilterToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Функция для закрытия выпадающего меню
  const handleFilterClose = () => {
    setIsDropdownOpen(false);
  };

  if (!chat) {
    return (
      <div className="flex-1 h-full relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
          Выберите чат слева для общения
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full p-6 overflow-y-scroll overflow-x-hidden relative bg-white">
      <div className=" relative flex flex-row mb-4 p-2 bg-custom-bg-gray rounded border justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="rounded-full text-sm text-custom-gray-thin border-custom-gray-thin p-2 border">
            {chat.name
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase()}
          </div>
          <div className="font-semibold text-sm text-custom-gray-dark">
            {isSearching ? (
              <input
                type="text"
                placeholder="Поиск по сообщениям..."
                className="mb-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            ) : (
              <span>{chat.name} / Общение</span>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div onClick={handleSearchToggle}>
            {isSearching ? <CrossIconFilter /> : <SearchIcon />}
          </div>
          <button onClick={handleFilterToggle}>
            <FilterIcon />
          </button>
          <div>
            <InfoIcon />
          </div>
        </div>
      </div>

      {/* Поле поиска */}
      {/*<input
        type="text"
        placeholder="Поиск по сообщениям..."
        className="mb-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />*/}
      {isDropdownOpen && (
        <div className="absolute bg-custom-bg-gray z-30">
          <MessagesFilter onClose={handleFilterClose} />
        </div>
      )}
      {/* Сообщения чата */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={clsx("flex flex-col", {
              //"items-end": message.senderRole === "recruiter",
            })}
          >
            {/* Иконка и информация об отправителе */}
            <div className="flex items-center mb-4">
              <div>
                {message.messanger === "telegram" ? (
                  <Image src={TgIcon} alt="Telegram Icon" />
                ) : (
                  <Image src={MailIcon} alt="Mail Icon" />
                )}
              </div>
              <div className="ml-4">
                <div
                  className={clsx("font-medium", {
                    "text-blue-500": message.senderRole === "candidate",
                    "text-orange-500": message.senderRole === "recruiter",
                  })}
                >
                  {message.sender}{" "}
                  {message.senderRole === "candidate"
                    ? "Сообщение от кандидата"
                    : "Сообщение от рекрутера"}{" "}
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            {/* Тело письма */}
            <div
              className={clsx("ml-4 p-4 border rounded-lg w-full relative", {
                "bg-custom-gray-md border-blue-500":
                  message.senderRole === "candidate",
                "bg-custom-orange-bg border-custom-orange-border":
                  message.senderRole === "recruiter",
              })}
            >
              {message.messanger === "email" && (
                <div className="mb-2 font-semibold">
                  Тема: Предложение вакансии
                </div>
              )}
              <div className=" p-2 rounded-md">{message.text}</div>
            </div>

            {/* Кнопка "Отправить" */}
            <button
              onClick={() => console.log("Отправляем сообщение")} // Замените на вашу логику отправки
              className="mt-2 ml-4 text-center text-custom-gray-filter-light w-[88px] border py-2 px-2 rounded"
            >
              Ответить
            </button>
          </div>
        ))}
      </div>

      {/* Форма отправки сообщения */}
      {/*<div className="mt-4">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ваше сообщение..."
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Отправить
          </button>
        </form> 
      </div>*/}
    </div>
  );
}
