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
import ChatInput from "./ChatInput";
import InfoIcon2 from "../ui/icons/InfoIcon2";
import FilterIcon2 from "../ui/icons/FilterIcon2";
import CustomScrollbar from "../ui/CustomScrollbar";

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
    <div className="flex flex-col flex-grow relative p-6 pl-0 pr-0 pt-1 items-center h-screen bg-white">
      <div className="relative bg-[#F1F5F9] p-1 w-[608px] flex flex-row mb-4 rounded border justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="rounded-full text-sm text-custom-gray-thin border-custom-gray-thin p-2 border">
            {chat.name
              .split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex">
            <div className="text-sm text-custom-gray-dark">
              {isSearching ? (
                <input
                  autoFocus
                  type="text"
                  placeholder="Введите строку для поиска           "
                  className="bg-white w-full flex p-2 rounded-md focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              ) : (
                <div className="">{chat.name} / Общение </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center flex-row gap-2">
          <div onClick={handleSearchToggle}>
            {isSearching ? <CrossIconFilter /> : <SearchIcon />}
          </div>
          <button onClick={handleFilterToggle}>
            {isSearching ? (
              <div>
                <FilterIcon />
              </div>
            ) : (
              <div>
                <FilterIcon2 />
              </div>
            )}
          </button>
          <div>{isSearching ? <InfoIcon /> : <InfoIcon2 />}</div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute mt-[60px] border border-[#6E9DD0] rounded bg-custom-bg-gray z-30">
          <MessagesFilter onClose={handleFilterClose} />
        </div>
      )}
      {/* Сообщения чата */}
      <CustomScrollbar>
        <div className=" space-y-2 w-full flex flex-col items-center  mr-0 pr-0 pl-4 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={clsx("flex flex-col  relative w-[608px]", {
                //"items-end": message.senderRole === "recruiter",
              })}
            >
              {/* Иконка и информация об отправителе */}
              <div className="flex items-start mb-1">
                <div className="mr-4">
                  {message.messanger === "telegram" ? (
                    <Image
                      src={TgIcon}
                      alt="Telegram Icon"
                      style={{ width: 24 }}
                    />
                  ) : (
                    <Image
                      src={MailIcon}
                      alt="Mail Icon"
                      style={{ width: 24 }}
                    />
                  )}
                </div>
                <div>
                  <div
                    className={clsx("font-medium text-[15px]", {
                      "text-[#4766FF]": message.senderRole === "candidate",
                      "text-[#B67E34]": message.senderRole === "recruiter",
                    })}
                  >
                    {message.sender}{" "}
                    {message.senderRole === "candidate" ? (
                      <span className="text-[13px] text-[#4766FF]">
                        Сообщение от кандидата - 11:45
                      </span>
                    ) : (
                      <span className="text-[13px] text-[#B67E34]">
                        Сообщение от рекрутера - 12:30
                      </span>
                    )}{" "}
                  </div>
                </div>
              </div>

              {/* Вертикальная линия, идущая вниз от середины иконки */}
              <div className="absolute top-9 bottom-0 left-3 border-l border-gray-300" />

              {/* Тело письма */}
              <div
                className={clsx(
                  "ml-10 px-2 py-1 mt-1 border rounded w-[568px] relative",
                  {
                    "bg-custom-gray-md border-blue-500":
                      message.senderRole === "candidate",
                    "bg-custom-orange-bg border-custom-orange-border":
                      message.senderRole === "recruiter",
                  }
                )}
              >
                {message.messanger === "email" && (
                  <div className="font-semibold text-[#1E293B] text-[16px]">
                    Тема: Предложение вакансии
                  </div>
                )}
                <div className="py-1">{message.text}</div>
              </div>

              {/* Кнопка "Отправить" */}
              <button
                onClick={() => console.log("Отправляем сообщение")} // Замените на вашу логику отправки
                className="mt-2 ml-10 text-center text-custom-gray-filter-light w-[88px] border py-1 px-2 rounded"
              >
                Ответить
              </button>
            </div>
          ))}
        </div>
      </CustomScrollbar>
      <div className="ml-3 mt-2 w-[608px] sticky bottom-0 bg-white">
        <ChatInput />
      </div>
    </div>
  );
}
