"use client";

import { useState, useEffect, useContext } from "react";
import { mockMessages } from "../mockData/mockMessages";
import { ChatContext } from "../chatState";
import clsx from "clsx";
import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import Image from "next/image";

export default function ChatWindow() {
  const { state, dispatch } = useContext(ChatContext);
  const chat = state.selectedChat;
  const messages = state.messages[chat?.id] || [];
  console.log(messages);
  //const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

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
    <div className="flex-1 h-full p-6 overflow-y-scroll overflow-x-hidden bg-white">
      <h2 className="text-xl font-bold mb-4">Chat with {chat.name}</h2>

      {/* Поле поиска */}
      <input
        type="text"
        placeholder="Поиск по сообщениям..."
        className="mb-4 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

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
