"use client";

import { useState, useEffect, useContext } from "react";
import { mockMessages } from "../mockData/mockMessages";
import { ChatContext } from "../chatState";

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
    <div className="flex-1 h-full p-6">
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
      <div className="space-y-4 overflow-auto flex-grow">
        {filteredMessages.map((message) => (
          <div
            key={message.timestamp}
            className={`flex items-start mb-4 ${
              message.sender !== "You" && "justify-end"
            }`}
          >
            {message.sender !== "You" && (
              <div
                className={`w-10 h-10 mr-4 bg-${chat.avatarColor} text-white flex items-center justify-center rounded-full uppercase font-semibold`}
              >
                {chat.name.slice(0, 2)}
              </div>
            )}
            <div>
              <p className="font-medium">{message.sender}:</p>
              <p className="text-sm text-gray-600">{message.text}</p>
              {message.isUnread && (
                <span className="absolute top-0 right-0 -mt-3 mr-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  New
                </span>
              )}
            </div>
            {message.sender === "You" && (
              <div className="w-10 h-10 ml-4 bg-blue-500 text-white flex items-center justify-center rounded-full uppercase font-semibold">
                YO
              </div>
            )}
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
