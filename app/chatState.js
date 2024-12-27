//"use client";

import React, { createContext, useReducer } from "react";

const initialState = {
  chats: [
    {
      id: 1,
      name: "Сергей Семенов",
      avatarColor: "blue-500",
      unreadMessagesCount: 0,
      awaitingResponse: false,
      contacts: {
        telegram: "@sergeysemenov",
        email: "sergey@semenov.com",
        whatsapp: "+7 999 123-45-67",
        phone: "+7 888 987-65-43",
      },
      vacancies: ["designer", "intern", "manager", "juniorBackend"],
      recruiters: ["ivanov"],
      clients: ["tbank", "alfabank"],
    },
    {
      id: 2,
      name: "Иван Иванов",
      avatarColor: "green-500",
      unreadMessagesCount: 2,
      awaitingResponse: true,
      contacts: {
        telegram: "@ivanivanov",
        email: "ivan@ivanov.com",
        whatsapp: "+7 999 123-45-67",
        phone: "+7 888 987-65-43",
      },
      vacancies: ["developer", "devOps", "juniorBackend", "manager"],
      recruiters: ["you"],
      clients: ["tbank", "alfabank", "rosbank"],
    },
    {
      id: 3,
      name: "Павел Николаев",
      avatarColor: "purple-500",
      unreadMessagesCount: 1,
      awaitingResponse: true,
      contacts: {
        telegram: "@pavelnikolaev",
        email: "pavel@nikolaev.com",
        whatsapp: "+7 999 123-45-67",
        phone: "+7 888 987-65-43",
      },
      vacancies: ["manager", "devOps", "seniorFrontend", "designer"],
      recruiters: ["you"],
      clients: ["alfabank", "vtb"],
    },
    {
      id: 4,
      name: "Анна Козлова",
      avatarColor: "red-500",
      unreadMessagesCount: 0,
      awaitingResponse: false,
      contacts: {
        telegram: "@annakozlova",
        email: "anna@kozlova.com",
        whatsapp: "+7 999 123-45-67",
        phone: "+7 888 987-65-43",
      },
      vacancies: ["manager, juniorBackender, designer"],
      recruiters: ["petrov"],
      clients: ["tbank", "sberbank", "vtb"],
    },
    {
      id: 5,
      name: "Максим Петров",
      avatarColor: "indigo-500",
      unreadMessagesCount: 3,
      awaitingResponse: true,
      contacts: {
        telegram: "@maksimpetrov",
        email: "maksim@petrov.com",
        whatsapp: "+7 999 123-45-67",
        phone: "+7 888 987-65-43",
      },
      vacancies: ["developer", "seniorFrontend", "juniorBackend", "manager"],
      recruiters: ["you"],
      clients: ["alfabank"],
    },
  ],
  selectedFilters: {
    vacancies: [],
    recruiters: [],
    clients: [],
  },
  filteredChats: [],
  messages: {
    1: [
      {
        id: 1,
        text: "Привет!",
        sender: "Иван Иванов",
        timestamp: "2023-01-01T00:00:00.000Z",
        isUnread: true,
      },
      {
        id: 2,
        text: "Как дела?",
        sender: "Сергей Семенов",
        timestamp: "2023-02-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 3,
        text: "Отлично, а тебя?",
        sender: "Иван Иванов",
        timestamp: "2023-03-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 4,
        text: "Тоже неплохо, чем могу помочь?",
        sender: "Сергей Семенов",
        timestamp: "2023-04-01T00:00:00.000Z",
        isUnread: false,
      },
    ],
    2: [
      {
        id: 11,
        text: "Приветствую!",
        sender: "Анна Козлова",
        timestamp: "2023-05-01T00:00:00.000Z",
        isUnread: true,
      },
      {
        id: 12,
        text: "Здравствуйте, что случилось?",
        sender: "Максим Петров",
        timestamp: "2023-06-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 13,
        text: "Ничего особенного, просто хотела узнать, как у тебя дела.",
        sender: "Анна Козлова",
        timestamp: "2023-07-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 14,
        text: "Спасибо, все нормально. А у тебя какие планы на выходные?",
        sender: "Максим Петров",
        timestamp: "2023-08-01T00:00:00.000Z",
        isUnread: false,
      },
    ],
    3: [
      {
        id: 21,
        text: "Добрый день!",
        sender: "Павел Николаев",
        timestamp: "2023-09-01T00:00:00.000Z",
        isUnread: true,
      },
      {
        id: 22,
        text: "Здравствуйте, как ваши дела?",
        sender: "Иван Иванов",
        timestamp: "2023-10-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 23,
        text: "Все отлично, спасибо за интерес. Как ваше настроение?",
        sender: "Павел Николаев",
        timestamp: "2023-11-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 24,
        text: "Настроение хорошее, рад слышать, что у вас тоже все хорошо.",
        sender: "Иван Иванов",
        timestamp: "2023-12-01T00:00:00.000Z",
        isUnread: false,
      },
    ],
    4: [
      {
        id: 31,
        text: "Привет!",
        sender: "Сергей Семенов",
        timestamp: "2024-01-01T00:00:00.000Z",
        isUnread: true,
      },
      {
        id: 32,
        text: "Привет-привет! Как жизнь?",
        sender: "Павел Николаев",
        timestamp: "2024-02-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 33,
        text: "Жизнь кипит, работа, семья... А вы как?",
        sender: "Сергей Семенов",
        timestamp: "2024-03-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 34,
        text: "Работаю, учусь, стараюсь успевать везде. Рад был услышать от вас!",
        sender: "Павел Николаев",
        timestamp: "2024-04-01T00:00:00.000Z",
        isUnread: false,
      },
    ],
    5: [
      {
        id: 41,
        text: "Доброго времени суток!",
        sender: "Анна Козлова",
        timestamp: "2024-05-01T00:00:00.000Z",
        isUnread: true,
      },
      {
        id: 42,
        text: "Здравствуйте! Что нового?",
        sender: "Максим Петров",
        timestamp: "2024-06-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 43,
        text: "Новые проекты, новые возможности. А у вас?",
        sender: "Анна Козлова",
        timestamp: "2024-07-01T00:00:00.000Z",
        isUnread: false,
      },
      {
        id: 44,
        text: "У меня все стабильно, рад за ваши успехи!",
        sender: "Максим Петров",
        timestamp: "2024-08-01T00:00:00.000Z",
        isUnread: false,
      },
    ],
  },
  appliedFilters: 0,
  showAwaitingResponse: false,
  selectedChat: null,
};

export const ChatContext = createContext();

// Функция редуктора
const reducer = (state, action) => {
  switch (action.type) {
    case "APPLY_FILTERS":
      const { selectedFilters } = state;
      const appliedFilters = Object.values(selectedFilters).filter(
        (arr) => arr.length > 0
      ).length;
      const { vacancies, recruiters, clients } = action.payload;

      const filteredChats = state.chats.filter((chat) => {
        const matchesVacancy = vacancies.length
          ? vacancies.includes(chat.vacancy)
          : true;
        const matchesRecruiter = recruiters.length
          ? recruiters.includes(chat.recruiter)
          : true;
        const matchesClients = clients.length
          ? clients.some((client) => chat.clients?.includes(client))
          : true;

        return matchesVacancy && matchesRecruiter && matchesClients;
      });

      return {
        ...state,
        filteredChats,
        appliedFilters,
        //selectedFilters: action.payload,
      };
    case "TOGGLE_FILTER":
      return {
        ...state,
        showAwaitingResponse: !state.showAwaitingResponse,
      };
    case "SELECT_CHAT":
      return {
        ...state,
        selectedChat: action.payload,
      };
    case "RESET_FILTERS":
      return {
        ...state,
        selectedFilters: {
          vacancies: [],
          recruiters: [],
          clients: [],
        },
        appliedFilters: 0,
      };
    case "SET_FILTERS":
      return {
        ...state,
        selectedFilters: {
          ...state.selectedFilters,
          ...action.payload,
        },
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: [
            ...state.messages[action.payload.chatId],
            action.payload.message,
          ],
        },
      };
    case "RESET_UNREAD_COUNT":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                unreadMessagesCount: 0,
                awaitingResponse: false, // Сбрасываем флаг ожидания ответа
              }
            : chat
        ),
        filteredChats: state.filteredChats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                unreadMessagesCount: 0,
                awaitingResponse: false, // Сбрасываем флаг ожидания ответа
              }
            : chat
        ),
        messages: {
          ...state.messages,
          [action.payload.chatId]: state.messages[action.payload.chatId].map(
            (message) => ({
              ...message,
              isUnread: false,
            })
          ),
        },
      };
    default:
      return state;
  }
};

// Компонент провайдера контекста
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Функция для добавления сообщения
  const addMessage = (chatId, message) => {
    dispatch({
      type: "ADD_MESSAGE",
      payload: { chatId, message },
    });
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
}
