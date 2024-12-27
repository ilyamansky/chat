"use client";

import { useState, useEffect } from "react";
import { mockMessages } from "../mockData/mockMessages";

export default function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (chat) {
      const messages = mockMessages[chat.id];
      setMessages(messages);
      console.log(chat);
      console.log(messages);
    }
  }, [chat]);
  // Функция для отметки всех сообщений как прочитанных
  const markAllAsRead = () => {
    const readMessages = messages.map((msg) => ({
      ...msg,
      isUnread: false,
    }));
    setMessages(readMessages);
  };

  const handleSubmit = async (event) => {
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
  };

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
      <div className="mt-4">
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
      </div>
    </div>
  );
}




import { useState } from "react";

const ChatsFilter = ({ onClose }) => {
  const [clientFilter, setClientFilter] = useState([]);
  const [vacancyFilter, setVacancyFilter] = useState("");
  const [recruiterFilter, setRecruiterFilter] = useState("");

  // Функция для применения фильтров
  const handleApplyFilters = () => {
    console.log(
      Применены //фильтры: Клиенты - ${clientFilter.join(", ")}, Вакансии - ${vacancyFilter}, Рекрутеры - ${recruiterFilter}
    );
    // Здесь нужно добавить логику для применения фильтров к списку чатов
  };

  // Функция для сброса фильтров
  const handleResetFilters = () => {
    setClientFilter([]);
    setVacancyFilter("");
    setRecruiterFilter("");
    console.log("Фильтры сброшены");
    // Здесь нужно добавить логику для сброса фильтров в списке чатов
  };

  // Функция для добавления клиента в фильтр
  const handleAddClient = (e) => {
    const selectedClient = e.target.value;
    if (selectedClient && !clientFilter.includes(selectedClient)) {
      setClientFilter([...clientFilter, selectedClient]);
    }
    e.target.value = ""; // Сбрасываем выбор после добавления
  };

  // Функция для удаления клиента из фильтра
  const handleRemoveClient = (clientToRemove) => {
    setClientFilter(clientFilter.filter((client) => client !== clientToRemove));
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md filter-component">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-xl">Фильтры</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 transition duration-200"
        >
          ×
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="client-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Фильтрация по клиентам:
        </label>
        <select
          id="client-filter"
          onChange={handleAddClient}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          <option value="">Выберите клиента</option>
          <option value="Сбербанк">Сбербанк</option>
          <option value="Альфа Банк">Альфа Банк</option>
          <option value="Т-банк">Т-банк</option>
        </select>
      </div>

      <div className="mb-4">
        <h5 className="font-medium text-lg">Выбранные клиенты:</h5>
        <div className="flex flex-wrap">
          {clientFilter.map((client) => (
            <span
              key={client}
              className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
            >
              {client}
              <button
                onClick={() => handleRemoveClient(client)}
                className="ml-2 text-blue-600 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="vacancy-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Фильтрация по вакансиям:
        </label>
        <select
          id="vacancy-filter"
          value={vacancyFilter}
          onChange={(e) => setVacancyFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="Активные">Активные</option>
          <option value="Закрытые">Закрытые</option>
          <option value="Архивированные">Архивированные</option>
        </select>
      </div>

      <div className="mb-8">
        <label
          htmlFor="recruiter-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Фильтрация по рекрутерам:
        </label>
        <select
          id="recruiter-filter"
          value={recruiterFilter}
          onChange={(e) => setRecruiterFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="Все">Все</option>
          <option value="Рекрутер А">Рекрутер А</option>
          <option value="Рекрутер Б">Рекрутер Б</option>
          <option value="Рекрутер В">Рекрутер В</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApplyFilters}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:visible:ring-2 focus:visible:ring-white focus:visible:ring-opacity-75 transition duration-200"
        >
          Применить фильтры
        </button>
        <button
          onClick={handleResetFilters}
          className="py-2 px-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:visible:ring-2 focus:visible:ring-white focus:visible:ring-opacity-75 transition duration-200"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};
export default ChatsFilter;




import React, { useState } from "react";
import Select from "react-select";

// Опции для селекторов
const clientOptions = [
  { value: "sberbank", label: "Сбербанк" },
  { value: "alfabank", label: "Альфа Банк" },
  { value: "tbank", label: "Т-банк" },
];

const vacancyOptions = [
  { value: "developer", label: "Разработчик" },
  { value: "designer", label: "Дизайнер" },
  { value: "manager", label: "Менеджер" },
];

const recruiterOptions = [
  { value: "ivanov", label: "Иванов И.И." },
  { value: "petrov", label: "Петров П.П." },
  { value: "sidorov", label: "Сидоров С.С." },
];

const ChatsFilter = ({ onClose }) => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedVacancies, setSelectedVacancies] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);

  const handleClientChange = (selectedOptions) => {
    setSelectedClients(selectedOptions);
  };

  const handleVacancyChange = (selectedOptions) => {
    setSelectedVacancies(selectedOptions);
  };

  const handleRecruiterChange = (selectedOptions) => {
    setSelectedRecruiters(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {
      clients: selectedClients,
      vacancies: selectedVacancies,
      recruiters: selectedRecruiters,
    };
    console.log(filters);
    // Здесь вы можете добавить логику для обработки фильтров
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-xl">Фильтры</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 transition duration-200"
        >
          ×
        </button>
      </div>
      <div>
        <h3>Выберите клиентов</h3>
        <Select
          isMulti
          options={clientOptions}
          value={selectedClients}
          onChange={handleClientChange}
          placeholder="Выберите клиентов"
        />
      </div>

      <div>
        <h3>Выберите вакансии</h3>
        <Select
          isMulti
          options={vacancyOptions}
          value={selectedVacancies}
          onChange={handleVacancyChange}
          placeholder="Выберите вакансии"
        />
      </div>

      <div>
        <h3>Выберите рекрутеров</h3>
        <Select
          isMulti
          options={recruiterOptions}
          value={selectedRecruiters}
          onChange={handleRecruiterChange}
          placeholder="Выберите рекрутеров"
        />
      </div>

      <button type="submit">Применить</button>
    </form>
  );
};

export default ChatsFilter;



{state.chats
  .filter((user) => !state.showAwaitingResponse || user.awaitingResponse)
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


