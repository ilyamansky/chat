import React, { useContext, useState } from "react";
import { ChatContext } from "../chatState";
import ChatsFilter from "./ChatsFilter";
import FilterIcon from "../ui/icons/FilterIcon";

import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

export default function ChatList() {
  const { state, dispatch } = useContext(ChatContext);

  // Состояние для управления видимостью выпадающего меню
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFilterToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Функция для закрытия выпадающего меню
  const handleFilterClose = () => {
    setIsDropdownOpen(false);
  };

  {
    /*const [openPopover, setOpenPopover] = useState(false);

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };*/
  }
  // Функционал
  const [popovers, setPopovers] = useState({});

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

  return (
    <div className="w-[320px] h-full border-r relative  border-gray-200 p-2 overflow-y-auto">
      <div className="mb-2 flex flex-col">
        <div className="mb-1 flex flex-row justify-between items-center relative">
          <h2 className="text-[13px] font-bold inline-block mr-2">Чаты</h2>
          <button
            className="flex items-center border rounded-lg px-2 py-1"
            onClick={handleFilterToggle}
          >
            <span className="text-custom-blue-light text-sm pr-2">
              Применено {state.appliedFilters} фильтра
            </span>
            <div className="pr-2">
              <FilterIcon />
            </div>
          </button>
          {/* Выпадающее меню для фильтров */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 bg-custom-bg-gray shadow-xl border rounded-md p-4 w-[302px] z-30">
              <ChatsFilter onClose={handleFilterClose} />
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Поиск по контактам и сообщениям"
        className="text-[15px] block w-full mb-3 px-3 py-2 outline-none border border-gray-300 rounded"
      />

      <div className="flex mb-4">
        <button
          className={`mr-4 text-sm ${
            !state.showAwaitingResponse
              ? "text-custom-blue"
              : "text-custom-text-gray"
          }`}
          onClick={() => dispatch({ type: "TOGGLE_FILTER" })}
        >
          Все
        </button>
        <button
          className={`text-sm ${
            state.showAwaitingResponse
              ? "text-custom-blue"
              : "text-custom-text-gray"
          }`}
          onClick={() => dispatch({ type: "TOGGLE_FILTER" })}
        >
          Ожидают ответа
          <span className="rounded-full items-center w-[8px] ml-1 h-[15px] px-2 py-1 justify-center bg-custom-blue text-xs text-white">
            {state.chats.filter((u) => u.awaitingResponse).length}
          </span>
        </button>
      </div>

      {/* Карточки чатов */}
      {!state.appliedFilters &&
        state.chats
          .filter(
            (user) => !state.showAwaitingResponse || user.awaitingResponse
          )
          .map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center text-sm text-custom-text-gray p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                state.selectedChat?.id === user.id ? "bg-gray-100" : ""
              }`}
              onClick={() => dispatch({ type: "SELECT_CHAT", payload: user })}
            >
              <div
                className={`w-10 h-10 mr-4 flex items-center justify-center rounded-full border ${
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
              <div>
                <p
                  className={`font-medium ${
                    user.awaitingResponse ? "text-custom-blue" : "text-black"
                  }`}
                >
                  {user.name}
                </p>
                <p className="text-sm text-gray-600">Please help me find...</p>
                {user.vacanciesInProcess && (
                  <div className="flex flex-row gap-1">
                    <div className="flex flex-row m-0 border p-1 rounded-lg">
                      <div className="pr-1">
                        {" "}
                        {user.vacanciesInProcess[0].role}
                      </div>

                      <div className="border-l-2 pl-1">
                        {user.vacanciesInProcess[0].company}
                      </div>
                    </div>
                    <Popover
                      open={!!popovers[index]}
                      handler={() => handlePopoverToggle(index)}
                    >
                      <PopoverHandler {...triggers(index)}>
                        <div className="border p-1 rounded-lg">
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
                          {user.vacanciesInProcess.slice(1).map((v, i) => (
                            <div
                              className="border rounded-lg my-1"
                              key={`${user.id}-${i}`}
                            >
                              <div className="flex flex-row">
                                <div className="p-1 text-custom-gray-dark">
                                  {v.role}
                                </div>
                                <div className="border-l-2 p-1 text-custom-gray-filter">
                                  {v.company}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
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
      {state.appliedFilters > 0 &&
        state.filteredChats
          .filter(
            (user) => !state.showAwaitingResponse || user.awaitingResponse
          )
          .map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                state.selectedChat?.id === user.id ? "bg-gray-100" : ""
              }`}
              onClick={() => dispatch({ type: "SELECT_CHAT", payload: user })}
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
    </div>
  );
}
