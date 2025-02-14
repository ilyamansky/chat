"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { resetUnreadCount, setReplyingTo } from "../redux/chatSlice"; // Import Redux actions
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
import InfoIcon2 from "../ui/icons/InfoIcon2";
import FilterIcon2 from "../ui/icons/FilterIcon2";
import FileIcon from "../ui/icons/FileIcon";
import { formatMessageDate } from "../utils/formatDate";
import CustomScrollbar from "../ui/CustomScrollbar";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add scroll effect
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]); // Scroll when chat or messages change

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

  const filteredMessages = chatMessages.filter((message) =>
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

  console.log(selectedChat.contacts, "contacts!!!!!");

  return (
    <div className="flex flex-col flex-grow overflow-x-hidden relative p-6 pl-0 pr-0 pt-1 items-center h-screen bg-white">
      <div className="w-full">
        <div className="relative bg-[#F1F5F9] p-1 mx-16 flex flex-row mb-4 rounded justify-between items-center">
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
                  <FilterIcon2 />
                </button>
                <div>
                  <InfoIcon2 />
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
          <div className="border border-[#6E9DD0] rounded  bg-custom-bg-gray mx-16">
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
            key={message.id}
            id={`message-${message.id}`} // Add ID here
            className={clsx("flex flex-col ml-16 mr-12  relative", {
              //"items-end": message.senderRole === "recruiter",
            })}
          >
            {/* Sender Icon and Info */}
            <div className="flex items-start mb-1">
              <div className="mr-4">
                {message.messanger === "Telegram" && (
                  <Image
                    src={TgIcon}
                    alt="Telegram Icon"
                    style={{ width: 24 }}
                  />
                )}
                {message.messanger === "Email" && (
                  <Image src={MailIcon} alt="Mail Icon" style={{ width: 24 }} />
                )}
                {message.messanger === "SMS" && (
                  <Image
                    src={PhoneIcon}
                    alt="Phone Icon"
                    style={{ width: 24 }}
                  />
                )}
                {message.messanger === "WA" && (
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
                    "text-[#4766FF]": message.senderRole === "candidate",
                    "text-[#B67E34]": message.senderRole === "recruiter",
                  })}
                >
                  {message.sender}{" "}
                  {message.senderRole === "candidate" ? (
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
              </div>
            </div>
            {/* Vertical Line */}
            <div className="absolute top-9 bottom-0 left-3 border-l border-gray-300" />
            {message.replyTo && (
              <div className="mt-1 ml-10 p-2 bg-gray-100 rounded text-sm text-gray-600 border-l-4 border-blue-500">
                <div className="font-medium">{replyingTo?.sender}</div>
                {chatMessages.find((m) => m.id === message.replyTo)?.text}
              </div>
            )}

            {/* Message Body */}
            <div
              className={clsx("ml-10 px-2 py-1 mt-1 border rounded  relative", {
                "bg-custom-gray-md border-blue-500":
                  message.senderRole === "candidate",
                "bg-custom-orange-bg border-custom-orange-border":
                  message.senderRole === "recruiter",
              })}
            >
              {message.messanger === "Email" && (
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
              onClick={() => dispatch(setReplyingTo(message))} // Replace with your send logic
              className="mt-2 ml-10 text-center hover:bg-gray-100 text-custom-gray-filter-light w-[88px] border py-1 px-2 rounded"
            >
              Ответить
            </button>
          </div>
        ))}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Chat Input */}
      <div className=" mt-2 w-full sticky bottom-0 bg-white">
        <div className="mx-16">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
