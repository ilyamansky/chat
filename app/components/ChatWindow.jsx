"use client";

import { useState, useEffect, useRef, use } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  resetUnreadCount,
  setReplyingTo,
  fetchMessages,
  sendHardcodedMessage,
  resetUnreadCountMessages,
} from "../redux/chatSlice"; // Import Redux actions
import clsx from "clsx";
import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import PhoneIcon from "../../public/contactIcons/PhoneIcon.png";
import WhatsappIcon from "../../public/contactIcons/WhatsappIcon.png";
import Image from "next/image";
import MessagesFilter from "./MessagesFilter";
import SearchIcon from "../ui/icons/SearchIcon";
import FilterIcon from "../ui/icons/FilterIcon";
import InfoIcon from "../ui/icons/InfoIcon";
import CrossIconButton from "../ui/icons/CrossIconButton";
import CrossIconFilter from "../ui/icons/CrossIconFilter";
import ChatInput from "./ChatInput";
import FilterIcon2 from "../ui/icons/FilterIcon2";
import InfoIcon2 from "../ui/icons/InfoIcon2";
import FileIcon from "../ui/icons/FileIcon";
import { formatMessageDate } from "../utils/formatDate";
import CustomScrollbar from "../ui/CustomScrollbar";
import TestSocket from "./TestSocket";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { selectedChat, messages, replyingTo } = useSelector(
    (state) => state.chat
  ); // Access Redux state
  const chat = selectedChat;
  const chatMessages = messages[chat?.id] || [];

  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add scroll ref
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const chatInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //useEffect(() => {
  //dispatch(sendHardcodedMessage());
  // }, []);

  {
    /*useEffect(() => {
    if (selectedChat?.id) {
      dispatch(fetchMessages(selectedChat.id));
      dispatch(resetUnreadCount({ chatId: selectedChat.id }));
    }
  }, [selectedChat?.id, dispatch]); */
  }

  useEffect(() => {
    if (selectedChat?.id) {
      dispatch(fetchMessages(selectedChat.id));

      // Отправка PATCH-запроса через Redux Thunk
      dispatch(resetUnreadCountMessages(selectedChat.id));
    }
  }, [selectedChat?.id, dispatch]);

  // Add scroll effect
  //useEffect(() => {
  //scrollToBottom();
  //}, [selectedChat, messages]); // Scroll when chat or messages change

  useEffect(() => {
    if (replyingTo) {
      chatInputRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [replyingTo, chatMessages]);

  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
    setFilter(""); // Reset filter when toggling search
  };

  const handleFilterToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleFilterClose = () => {
    setIsDropdownOpen(false);
  };

  // Reset unread count when a chat is selected
  useEffect(() => {
    if (chat) {
      dispatch(resetUnreadCount({ chatId: chat.id })); // Use Redux action
    }
  }, [chat, dispatch]);

  if (!chatMessages) {
    return (
      <div className="flex-1 h-full">
        <div>Нет сообщений</div>
      </div>
    );
  }
  console.log(selectedChat?.messages, "messagesLength");

  const filteredMessages = chatMessages.filter((message) =>
    message?.text?.toLowerCase().includes(filter.toLowerCase())
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

  console.log(selectedChat.contacts, "contacts!!!!!");

  return (
    <div className="flex max-w-[900px] flex-col flex-grow overflow-x-hidden relative p-6 pl-0 pr-0 pt-1 items-center h-screen bg-white">
      <div className="w-full">
        <div className="relative bg-[#F1F5F9] p-1 mx-2 flex flex-row mb-4 rounded justify-between items-center">
          <div className="flex flex-row gap-2 items-center flex-1">
            <div className="rounded-full text-sm text-custom-gray-thin border-custom-gray-thin p-2 border">
              {chat.name
                .split(" ")
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1">
              {isSearching ? (
                <div className="relative w-full">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Введите строку для поиска"
                    className="bg-white w-full flex p-2 rounded-md focus:outline-none pr-8"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <div
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer pr-0"
                    onClick={handleSearchToggle}
                  >
                    <CrossIconFilter />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-custom-gray-dark">
                  {chat.name} / Общение
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center flex-row gap-2">
            {!isSearching && (
              <>
                <div onClick={handleSearchToggle}>
                  <SearchIcon />
                </div>
                <button
                  className="filter-toggle-button"
                  onClick={handleFilterToggle}
                >
                  <FilterIcon2 className="text-white hover:text-gray-100" />
                </button>
                <div>
                  <InfoIcon2 className="text-white hover:text-gray-100" />
                </div>
              </>
            )}
            {isSearching && (
              <>
                <button
                  className="filter-toggle-button"
                  onClick={handleFilterToggle}
                >
                  <FilterIcon />
                </button>
                <div>
                  <InfoIcon />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute mt-[60px] w-full  z-30">
          <div className="border border-[#6E9DD0] rounded  bg-custom-bg-gray mx-2">
            <MessagesFilter onClose={handleFilterClose} />
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {/*<CustomScrollbar
        className="border border-blue-600 w-[608px] overflow-x-hidden"
        style={{ width: "calc(100% - 1rem)" }}
      >*/}

      <div
        ref={scrollContainerRef}
        className="space-y-2 flex flex-col w-full mr-0 pr-0  overflow-x-hidden overflow-y-auto"
      >
        {filteredMessages.map((message) => (
          <div
            key={`message-${message.id}`}
            id={message.id} // Add ID here
            className={clsx(
              "flex flex-col ml-[10px] pl-2 mr-[10px]  relative",
              {
                //"items-end": message.senderRole === "recruiter",
              }
            )}
          >
            {/* Sender Icon and Info */}
            <div className="flex items-start mb-1">
              <div className="mr-4">
                {message.messanger === "telegram" && (
                  <Image
                    src={TgIcon}
                    alt="Telegram Icon"
                    style={{ width: 24 }}
                  />
                )}
                {message.messanger === "email" && (
                  <Image src={MailIcon} alt="Mail Icon" style={{ width: 24 }} />
                )}
                {message.messanger === "phone" && (
                  <Image
                    src={PhoneIcon}
                    alt="Phone Icon"
                    style={{ width: 24 }}
                  />
                )}
                {message.messanger === "whatsapp" && (
                  <Image
                    src={WhatsappIcon}
                    alt="Whatsapp Icon"
                    style={{ width: 24 }}
                  />
                )}
              </div>
              <div>
                <div
                  className={clsx("font-medium text-[15px]", {
                    "text-[#4766FF]": message.author.role === "candidate",
                    "text-[#B67E34]": message.author.role === "recruiter",
                  })}
                >
                  {message?.author.name}{" "}
                  {message.author.role === "candidate" ? (
                    <span className="text-[13px] text-[#4766FF]">
                      Сообщение от кандидата -{" "}
                      {formatMessageDate(message.timestamp)}
                    </span>
                  ) : (
                    <span className="text-[13px] text-[#B67E34]">
                      Сообщение от рекрутера -{" "}
                      {formatMessageDate(message.timestamp)}
                    </span>
                  )}{" "}
                </div>
                <button
                  onClick={() => {
                    console.log(message.messanger);
                  }}
                >
                  HIIIII
                </button>
              </div>
            </div>
            {/* Vertical Line */}
            <div className="absolute top-9 bottom-0 left-[18px] border-l border-gray-300" />
            {/*{message.replyTo && (
              <div className="mt-1 ml-10 p-2 bg-[#F1F5F9] rounded text-sm text-gray-600 border-l-4 border-blue-500">
                <div className="font-medium">{replyingTo?.sender}</div>
                {chatMessages.find((m) => m.id === message.replyTo)?.text}
              </div>
            )}*/}

            {message.replyTo && (
              <div className="mt-1 ml-10 p-2 bg-[#F1F5F9] rounded text-sm text-gray-600 border-l-4 border-blue-500">
                <div className="font-medium">
                  Ответ на сообщение через {message.replyTo.channel_name}
                </div>
                <div>{message.replyTo?.text?.substring(0, 50)}...</div>
              </div>
            )}

            {/* Message Body */}
            <div
              className={clsx("ml-10 px-2 py-1 mt-1 border rounded  relative", {
                "bg-custom-gray-md border-blue-500":
                  message.author.role === "candidate",
                "bg-custom-orange-bg border-custom-orange-border":
                  message.author.role === "recruiter",
              })}
            >
              {message.messanger === "email" && (
                <div className="font-semibold text-[#1E293B] text-[16px]">
                  {message.subject || "Тема не задана"}{" "}
                </div>
              )}
              <div className="py-1">{message.text}</div>
              {message.attachments?.map((attachment, idx) => (
                <div
                  key={idx}
                  className="mt-2 p-2 bg-gray-100 rounded flex items-center"
                >
                  <FileIcon className="w-4 h-4" />
                  <span className="ml-2 text-sm">
                    {attachment.name} ({(attachment.size / 1024).toFixed(1)}KB)
                  </span>
                  <a
                    href={attachment.preview}
                    download
                    className="ml-2 hover:underline text-sm"
                  >
                    Скачать
                  </a>
                </div>
              ))}
            </div>

            {/* Reply Button */}
            <button
              //onClick={() => dispatch(setReplyingTo(message))} // Replace with your send logic
              onClick={() => {
                dispatch(
                  setReplyingTo({
                    id: message.id,
                    text: message.text,
                    messanger: message.messanger,
                    author: message.author,
                    timestamp: message.timestamp,
                  })
                );

                // Прокрутка к форме ввода
                setTimeout(() => {
                  document
                    .querySelector(".chat-input-container")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "end",
                    });
                }, 100);
              }}
              className="mt-2 ml-10 text-center hover:bg-gray-100 text-custom-gray-filter-light w-[88px] border py-1 px-2 rounded"
            >
              Ответить
            </button>
          </div>
        ))}

        <div ref={messagesEndRef}></div>
      </div>
      <div className=" mt-auto w-full mb-0 bottom-0 bg-white chat-input-container ref={chatInputRef}">
        <div className="mx-2">{<ChatInput />}</div>
      </div>
    </div>
  );
}
