// ChatWindow.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetUnreadCount,
  setReplyingTo,
  fetchMessages,
} from "../redux/chatSlice";
import clsx from "clsx";
import Image from "next/image";
import MessagesFilter from "./MessagesFilter";
import SearchIcon from "../ui/icons/SearchIcon";
import FilterIcon from "../ui/icons/FilterIcon";
import CrossIconFilter from "../ui/icons/CrossIconFilter";
import ChatInput from "./ChatInput";
import FileIcon from "../ui/icons/FileIcon";
import { formatMessageDate } from "../utils/formatDate";
import CustomScrollbar from "../ui/CustomScrollbar";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const {
    selectedChat,
    messages,
    status: chatStatus,
    error: chatError,
  } = useSelector((state) => state.chat);

  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const chatMessages = selectedChat?.id ? messages[selectedChat.id] || [] : [];
  const filteredMessages = chatMessages.filter((message) =>
    message.text.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (selectedChat?.id) {
      dispatch(fetchMessages(selectedChat.id));
      dispatch(resetUnreadCount({ chatId: selectedChat.id }));
    }
  }, [selectedChat?.id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSearchToggle = () => {
    setIsSearching((prev) => !prev);
    setFilter("");
  };

  const handleFilterToggle = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 h-full relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
          Выберите чат слева для общения
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[900px] flex-col flex-grow overflow-x-hidden relative p-6 pl-0 pr-0 pt-1 items-center h-screen bg-white">
      {/* Header */}
      <div className="w-full">
        <div className="relative bg-[#F1F5F9] p-1 mx-2 flex flex-row mb-4 rounded justify-between items-center">
          <div className="flex flex-row gap-2 items-center flex-1">
            <div className="rounded-full text-sm text-custom-gray-thin border-custom-gray-thin p-2 border">
              {selectedChat.name
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
                  {selectedChat.name} / Общение
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
                  <FilterIcon className="text-white hover:text-gray-100" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <CustomScrollbar className="flex-1 w-full">
        <div className="space-y-2 px-2">
          {chatStatus === "loading" && (
            <div className="text-center text-gray-500 py-4">
              Загрузка сообщений...
            </div>
          )}

          {chatError && (
            <div className="text-red-500 text-center py-4">
              {chatError}
              <button
                className="ml-2 text-blue-500 hover:underline"
                onClick={() => dispatch(fetchMessages(selectedChat.id))}
              >
                Попробовать снова
              </button>
            </div>
          )}

          {chatStatus === "succeeded" && filteredMessages.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Нет сообщений в этом чате
            </div>
          )}

          {filteredMessages.map((message) => (
            <div
              key={message.id}
              id={`message-${message.id}`}
              className={clsx(
                "flex flex-col ml-[10px] pl-2 mr-[10px] relative",
                {
                  "items-end": message.senderRole === "recruiter",
                }
              )}
            >
              <div className="flex items-start mb-1">
                <div className="mr-4">
                  <Image
                    src={
                      message.senderRole === "recruiter"
                        ? "/recruiter-icon.png"
                        : "/candidate-icon.png"
                    }
                    alt={message.sender}
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <div
                    className={clsx("font-medium text-[15px]", {
                      "text-[#4766FF]": message.senderRole === "candidate",
                      "text-[#B67E34]": message.senderRole === "recruiter",
                    })}
                  >
                    {message.sender}
                    <span className="ml-2 text-[13px]">
                      {formatMessageDate(new Date(message.timestamp))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-10 px-2 py-1 mt-1 border rounded bg-white">
                {message.text}
                {message.attachments?.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="mt-2 p-2 bg-gray-100 rounded flex items-center"
                  >
                    <FileIcon className="w-4 h-4" />
                    <span className="ml-2 text-sm">{attachment.name}</span>
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

              <button
                onClick={() => dispatch(setReplyingTo(message))}
                className="mt-2 ml-10 text-center hover:bg-gray-100 text-custom-gray-filter-light w-[88px] border py-1 px-2 rounded"
              >
                Ответить
              </button>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CustomScrollbar>

      <ChatInput />
    </div>
  );
}
