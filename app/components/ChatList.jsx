import React, { useContext, useState } from "react";
import { ChatContext } from "../chatState";
import ChatsFilter from "./ChatsFilter";
import FilterIcon from "../ui/icons/FilterIcon";
import TooltipButton from "./TooltopButton";

export default function ChatList() {
  const { state, dispatch } = useContext(ChatContext);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };
  console.log(state);

  return (
    <div className="w-[320px] h-full border-r border-gray-200 p-2 overflow-y-auto">
      <div className="mb-2 flex flex-col">
        <div className="mb-1 flex flex-row justify-between items-center">
          <h2 className="text-[13px] font-bold inline-block mr-2">Чаты</h2>
          <div className="flex flex-row items-center border rounded-lg">
            <span className="text-custom-blue-light text-sm p-2">
              Применено {state.appliedFilters} фильтра
            </span>
            <button className="pr-2" onClick={handleFilterOpen}>
              <FilterIcon />
            </button>
          </div>
        </div>
        {/* Отображение формы фильтра, если она открыта */}
        {isFilterOpen && <ChatsFilter onClose={handleFilterClose} />}
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
          .map((user) => (
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
