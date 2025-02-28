"use client";

import React, { use, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  toggleFilter,
  selectChat,
  setShowAwaitingResponse,
  fetchChats,
} from "../redux/chatSlice"; // Import Redux actions
import ChatsFilter from "./ChatsFilter";
import FilterIcon from "../ui/icons/FilterIcon";
import SearchIconChatList from "../ui/icons/SearchIconChatList";
import LogoutForm from "./LogoutForm";
import { fetchUsersTest } from "../thunks/chatThunk";
import CustomScrollbar from "../ui/CustomScrollbar";
import clsx from "clsx";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

export default function ChatList() {
  const dispatch = useDispatch();
  const {
    chats,
    filteredChats,
    appliedFilters,
    showAwaitingResponse,
    //setShowAwaitingResponse,
    selectedChat,
  } = useSelector((state) => state.chat); // Access Redux state

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [popovers, setPopovers] = useState({});

  const handleFilterToggle = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleFilterClose = () => {
    setIsDropdownOpen(false);
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
    dispatch(fetchChats()).then((result) => {
      //console.log(result[0]);
      if (result.meta.requestStatus === "fulfilled") {
        console.log("Chats data:", result.payload);
      }
    });
  }, [dispatch]);

  {
    /* useEffect(() => {
    fetchUsersTest();
    console.log("hi");
  }),[]; */
  }

  return (
    <div className="w-[320px] flex flex-col h-screen border-r relative overflow-hidden border-gray-200">
      <div className="mb-2 flex flex-col px-2">
        <div className="mb-1 flex flex-row justify-between items-center relative">
          <h2 className="text-[13px] font-bold inline-block mt-2 mr-2">Чаты</h2>
          <button
            className="filter-toggle-button1 flex items-center border border-[#6E9DD0] shadow mt-2 bg-white hover:bg-gray-100 rounded px-1 py-1"
            style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)" }}
            onClick={handleFilterToggle}
          >
            {!!appliedFilters && (
              <span className="text-custom-blue-light text-sm pr-1">
                Применено {appliedFilters} фильтра
              </span>
            )}
            <div className="">
              <FilterIcon />
            </div>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 bg-custom-bg-gray shadow-xl border border-[#6E9DD0] rounded-md p-4 w-[302px] z-30">
              <ChatsFilter onClose={handleFilterClose} />
            </div>
          )}
        </div>
      </div>
      <div className="flex border rounded px-3 py-2 mx-2 border-custom-placeholder-gray items-center gap-1 bg-white">
        <SearchIconChatList />
        <input
          type="text"
          placeholder="Поиск по контактам и сообщениям"
          className="placeholder:text-custom-placeholder-gray text-[15px] block w-full outline-none border-[#E3E3E3] rounded"
        />
      </div>

      <div className="flex items-center ml-2 mt-2 mb-2">
        <button
          className={`mr-4 text-sm ${
            !showAwaitingResponse ? "text-custom-blue" : "text-custom-text-gray"
          }`}
          //onClick={() => dispatch(toggleFilter())} // Use Redux action
          onClick={() => dispatch(setShowAwaitingResponse(false))}
        >
          Все
        </button>
        <button
          className={`text-sm flex flex-row items-center ${
            showAwaitingResponse ? "text-custom-blue" : "text-custom-text-gray"
          }`}
          //onClick={() => dispatch(toggleFilter())} // Use Redux action
          onClick={() => dispatch(setShowAwaitingResponse(true))}
        >
          <div className="text-sm">Ожидают ответа</div>
          {/*{!!chats.filter((u) => u.awaitingResponse).length && (
            <div className="flex rounded-full items-center ml-1 min-w-4 h-4 justify-center bg-custom-blue text-xs text-white">
              {chats.filter((u) => u.awaitingResponse).length}
            </div>
          )}*/}
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto ml-2 mr-2">
        {!appliedFilters &&
          chats
            .filter((user) => !showAwaitingResponse || user.awaitingResponse)
            .map((user, index) => (
              <div
                key={user.id}
                className={`flex text-sm text-custom-text-gray mb-2 p-1 rounded-md hover:bg-white cursor-pointer ${
                  selectedChat?.id === user.id ? "bg-gray-50" : ""
                }`}
                onClick={() => dispatch(selectChat(user))} // Use Redux action
              >
                <div
                  className={`w-8 h-8 m-[3px] mb-0 flex items-center justify-center rounded-full border ${
                    user.awaitingResponse
                      ? "border-custom-blue text-custom-blue bg-custom-gray-md"
                      : "border-custom-text-gray"
                  }`}
                >
                  {user.name
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex flex-col grow pl-1">
                  <div className="flex justify-between mb-0 pb-0">
                    <p
                      className={`text-sm mb-0 pb-0 ${
                        user.awaitingResponse
                          ? "text-custom-blue"
                          : "text-black"
                      }`}
                    >
                      {user.name}
                    </p>
                    <p className="text-[12px] m-0 p-0 mr-2">
                      {new Date(user.updated_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between m-0 p-0">
                    <p className=" m-0 p-0 text-[13px] text-custom-text-gray">
                      please help me find...
                    </p>
                    <div className=" m-0 p-0 flex items-center justify-between mr-2">
                      {user.unreadMessagesCount > 0 && (
                        <span className="bg-blue-500 flex w-4 h-4 items-center justify-center text-white rounded-full text-xs font-bold">
                          {user.unreadMessagesCount}
                        </span>
                      )}
                    </div>
                  </div>
                  {user.vacanciesInProcess && (
                    <div className="flex flex-row gap-1 mt-1 mb-1">
                      <div className="flex flex-row m-0 border border-custom-gray-filter-light rounded">
                        <div className="px-1 text-custom-gray-dark text-[13px]">
                          {" "}
                          {user.vacanciesInProcess[0].role}
                        </div>

                        <div className="border-l px-1 text-custom-text-gray text-[13px] border-custom-gray-filter-light">
                          {user.vacanciesInProcess[0].company}
                        </div>
                      </div>
                      <Popover
                        open={!!popovers[index]}
                        handler={() => handlePopoverToggle(index)}
                      >
                        <PopoverHandler {...triggers(index)}>
                          <div className="border border-custom-gray-filter-light px-1 rounded">
                            +{user.vacanciesInProcess.length - 1}
                          </div>
                        </PopoverHandler>
                        <PopoverContent {...triggers(index)} className="z-50">
                          <div className="flex flex-col">
                            <div className="text-custom-gray-filter">
                              В работе по {user.vacanciesInProcess.length}{" "}
                              вакансиям:
                              <hr className="my-1" />
                            </div>
                            <div className="flex flex-col">
                              {user.vacanciesInProcess.slice().map((v, i) => (
                                <div
                                  className="border flex flex-row overflow-hidden border-[#94A3B8] rounded-lg my-1 w-fit"
                                  key={`${user.id}-${i}`}
                                >
                                  <div className="p-1 text-custom-gray-dark">
                                    {v.role}
                                  </div>
                                  <div className="border-l p-1 bg-clip-padding bg-[#f9f9f9] text-custom-gray-filter">
                                    {v.company}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
      {appliedFilters > 0 &&
        filteredChats
          .filter((user) => !showAwaitingResponse || user.awaitingResponse)
          .map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                selectedChat?.id === user.id ? "bg-gray-100" : ""
              }`}
              onClick={() => dispatch(selectChat(user))} // Use Redux action
            >
              <div
                className={`w-10 h-10 mr-4 bg-${user.avatarColor} text-white flex items-center justify-center rounded-full uppercase font-semibold`}
              >
                {user.name.slice(0, 2)}
              </div>
              <div>
                <p
                  className={`font-medium ${
                    user.awaitingResponse ? "text-blue-500" : ""
                  }`}
                >
                  {user.name}
                </p>
                <p className="text-sm text-gray-600">Please help me find...</p>
              </div>
              <div className="ml-auto">
                {user.unreadMessagesCount > 0 && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {user.unreadMessagesCount}
                  </span>
                )}
              </div>
            </div>
          ))}
      <div className="w-full mt-2 absolute bottom-0 mb-2 flex items-center mx-auto">
        <LogoutForm />
      </div>
    </div>
  );
}
