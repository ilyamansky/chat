"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChat,
  setShowAwaitingResponse,
  fetchChats,
  getCandidateByUrl,
  addCandidate,
  updateChatState,
} from "../redux/chatSlice";
import ChatsFilter from "./ChatsFilter";
import FilterIcon from "../ui/icons/FilterIcon";
import SearchIconChatList from "../ui/icons/SearchIconChatList";
import LogoutForm from "./LogoutForm";
import CustomScrollbar from "../ui/CustomScrollbar";
import TestSocket from "./TestSocket";
//import SocketManager from "./SocketManager";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import SocketManager from "./SocketManager";

export default function ChatList() {
  const dispatch = useDispatch();
  const {
    chats,
    filteredChats,
    appliedFilters,
    showAwaitingResponse,
    selectedChat,
    searchedCandidate,
  } = useSelector((state) => state.chat);
  //const { chats } = useSelector((state) => state.chat.chats);
  const { awaiting_response } = useSelector((state) => state.chat.meta);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [popovers, setPopovers] = useState({});
  const [activePopoverIndex, setActivePopoverIndex] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Фильтрация по имени
  const filteredBySearch = (chats) => {
    if (!searchInput) return chats;

    const searchTerm = searchInput.toLowerCase();
    return chats.filter((user) => user.name.toLowerCase().includes(searchTerm));
  };

  const displayedChats = filteredBySearch(
    (appliedFilters ? filteredChats : chats).filter((user) => {
      if (!showAwaitingResponse) return true; // Все чаты

      // Чаты, ожидающие ответа (unread_count > 0)
      return user.unread_count > 0;
    })
  );

  // Обработчик изменения поиска
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    {
      /*if (value.startsWith("https://app.friend.work/Candidate/Profile/")) {
      dispatch(getCandidateByUrl(value));
    } else {
      //dispatch(clearSearchedCandidate());
    }*/
    }
    if (searchTimeout) clearTimeout(searchTimeout);

    // Устанавливаем новый таймер
    const newTimeout = setTimeout(() => {
      if (value.startsWith("https://app.friend.work/Candidate/Profile/")) {
        dispatch(getCandidateByUrl(value));
      }
      // Добавьте else блок если нужно обрабатывать другие случаи
    }, 1000); // Задержка 500 мс

    setSearchTimeout(newTimeout);
  };

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  // Рендер кандидата из поиска
  const renderSearchedCandidate = () => {
    if (!searchedCandidate) return null;

    return (
      <div className="flex p-1 mb-2 rounded-md cursor-pointer">
        <div className="w-8 h-8 m-[3px] flex items-center justify-center rounded-full border border-[#8B9CBE] bg-custom-bg-gray">
          {searchedCandidate.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>

        <div className="flex-1 pl-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-black max-w-[60%] truncate">
              {searchedCandidate.name}
            </p>
            <button
              onClick={async () => {
                try {
                  await dispatch(
                    addCandidate(searchedCandidate.candidate_id)
                  ).unwrap();
                  dispatch(fetchChats());
                  setSearchInput("");
                } catch (error) {
                  alert(`Ошибка: ${error}`);
                }
              }}
              className="ml-2  px-2 py-1 rounded text-sm border-[#CACACA] hover:bg-gray-50 flex text-custom-gray-details"
            >
              Добавить
            </button>
          </div>
          <div className="text-[13px] text-custom-text-gray">
            ID: {searchedCandidate.candidate_id}
          </div>
        </div>
      </div>
    );
  };

  const handlePopoverToggle = (index) => {
    setPopovers({
      ...popovers,
      [index]: !popovers[index],
    });
  };

  const triggers = (index) => ({
    onMouseEnter: () => handlePopoverToggle(index),
    onMouseLeave: () => handlePopoverToggle(index),
  });

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <div className="w-[320px] min-w-[320px] flex flex-col h-screen border-r relative overflow-hidden border-gray-200">
      {/* Header and Filter Section */}
      <div className="mb-2 flex flex-col px-2">
        <div className="mb-1 flex flex-row justify-between items-center relative">
          <h2 className="text-[13px] font-bold inline-block mt-2 mr-2">Чаты</h2>
          <button
            className="filter-toggle-button1 flex items-center border border-[#6E9DD0] shadow mt-2 bg-white hover:bg-gray-100 rounded px-1 py-1"
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)" }}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            {!!appliedFilters && (
              <span className="text-custom-blue-light text-sm pr-1">
                Применено {appliedFilters} фильтра
              </span>
            )}
            <FilterIcon />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 bg-custom-bg-gray shadow-xl border border-[#6E9DD0] rounded-md p-4 w-[302px] z-30">
              <ChatsFilter onClose={() => setIsDropdownOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex border rounded px-3 py-2 mx-2 border-custom-placeholder-gray items-center gap-1 bg-white">
        <SearchIconChatList />
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Поиск по контактам и сообщениям"
          className="placeholder:text-custom-placeholder-gray text-[15px] block w-full outline-none border-[#E3E3E3] rounded"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center ml-2 mt-2 mb-2">
        <button
          className={`mr-4 text-sm ${
            !showAwaitingResponse ? "text-custom-blue" : "text-custom-text-gray"
          }`}
          onClick={() => dispatch(setShowAwaitingResponse(false))}
        >
          Все
        </button>
        <button
          className={`text-sm flex flex-row items-center ${
            showAwaitingResponse ? "text-custom-blue" : "text-custom-text-gray"
          }`}
          onClick={() => dispatch(setShowAwaitingResponse(true))}
        >
          Ожидают ответа
          {/*{awaiting_response > 0 && (
            <div className="ml-1 bg-custom-blue text-white rounded-full min-w-4 h-4 flex items-center justify-center text-xs">
              {awaiting_response}
            </div>
          )}*/}
          {awaiting_response > 0 && (
            <div
              className={`ml-1 bg-custom-blue text-white ${
                awaiting_response > 99 ? "rounded-md px-2" : "rounded-full px-1"
              } min-w-[1rem] h-4 flex items-center justify-center text-xs`}
            >
              {awaiting_response}
            </div>
          )}
        </button>
      </div>
      <div>{renderSearchedCandidate()}</div>

      {/* Chat List */}
      <CustomScrollbar>
        <div className="flex flex-col ml-2 mr-2">
          {displayedChats.map((user, index) => {
            const vacancies = user.vacancies;

            return (
              <div
                key={user.id}
                className={`flex p-1 mb-2 rounded-md hover:bg-white cursor-pointer ${
                  selectedChat?.id === user.id ? "bg-gray-50" : ""
                }`}
                onClick={() => dispatch(selectChat(user))}
              >
                <div
                  className={`w-8 h-8 m-[3px] flex items-center justify-center rounded-full border ${
                    user.unread_count > 0
                      ? "border-custom-blue text-custom-blue bg-custom-gray-md"
                      : "border-custom-text-gray text-custom-text-gray"
                  }`}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>

                {/* Chat Info */}
                <div className="flex-1 pl-1">
                  <div className="flex justify-between">
                    <p
                      className={`text-sm max-w-[60%] truncate ${
                        user.unread_count > 0
                          ? "text-custom-blue"
                          : "text-black"
                      }`}
                    >
                      {user.name}
                    </p>
                    <span className="text-[12px] text-custom-text-gray mr-2">
                      {new Date(user.lastActive).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-[13px] text-custom-text-gray truncate max-w-[220px]">
                      {user.last_message_text || "please help me find..."}
                    </p>
                    {/*{Number(user.unread_count) > 0 && (
                      <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {Number(user.unread_count)}
                      </span>
                    )}*/}
                    {Number(user.unread_count) > 0 && (
                      <span
                        className={`bg-blue-500 text-white ${
                          user.unread_count > 99
                            ? "rounded-md px-2"
                            : "rounded-full px-1"
                        } min-w-[1rem] h-4 flex items-center justify-center text-xs`}
                      >
                        {Number(user.unread_count)}
                      </span>
                    )}
                  </div>

                  {vacancies.length > 0 && (
                    <div className="my-1 flex gap-1">
                      <div className="flex border border-[#94A3B8] rounded overflow-hidden max-w-[240px]">
                        {/* Вакансия */}
                        <div className="px-1 py-0.5 text-[13px] text-custom-gray-dark truncate max-w-[120px]">
                          {vacancies[0].name}
                        </div>

                        {/* Компания */}
                        {vacancies[0].Employer_name && (
                          <div className="border-l px-1 py-0.5 text-[13px] bg-[#f9f9f9] text-custom-gray-filter truncate max-w-[120px]">
                            {vacancies[0].Employer_name}
                          </div>
                        )}
                      </div>

                      {vacancies.length > 1 && (
                        <Popover
                          open={activePopoverIndex === index}
                          handler={(isOpen) =>
                            setActivePopoverIndex(isOpen ? index : null)
                          }
                        >
                          <PopoverHandler
                            onMouseEnter={() => setActivePopoverIndex(index)}
                            onMouseLeave={() => setActivePopoverIndex(null)}
                          >
                            <div className="flex items-center border border-custom-gray-filter-light text-[#858B97] text-[13px] font-normal px-1 rounded">
                              +{vacancies?.length - 1 || 0}
                            </div>
                          </PopoverHandler>
                          <PopoverContent
                            className="z-50"
                            onMouseEnter={() => setActivePopoverIndex(index)}
                            onMouseLeave={() => setActivePopoverIndex(null)}
                          >
                            <div className="flex flex-col">
                              <div className="text-custom-gray-filter">
                                В работе по {vacancies?.length || 0} вакансиям:
                                <hr className="my-1" />
                              </div>
                              <div className="flex flex-col">
                                {vacancies?.map((vacancy, i) => (
                                  <div
                                    key={`${user.id}-${i}`}
                                    className="border flex flex-row overflow-hidden border-[#94A3B8] rounded-lg my-1 w-fit"
                                  >
                                    <div className="p-1 text-custom-gray-dark">
                                      {vacancy.name}
                                    </div>
                                    {vacancy.Employer_name && (
                                      <div className="border-l p-1 bg-clip-padding bg-[#f9f9f9] text-custom-gray-filter">
                                        {vacancy.Employer_name}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CustomScrollbar>

      <div className="mt-auto pt-4 pb-1">
        <LogoutForm />
        <SocketManager />
      </div>
    </div>
  );
}
