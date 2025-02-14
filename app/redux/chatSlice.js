import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [
    {
      id: 1,
      name: "Сергей Семенов",
      avatarColor: "blue-500",
      unreadMessagesCount: 0,
      awaitingResponse: false,
      contacts: {
        Telegram: [
          {
            content: "@sergeysemenov",
            isPrimary: true,
            //label: "Telegram",
          },
        ],
        Email: [
          {
            content: "sergey@semenov.com",
            isPrimary: false,
            //label: "Email",
          },
        ],
        WA: [
          {
            content: "+7 999 123-45-67",
            isPrimary: false,
            //label: "WA",
          },
        ],
        SMS: [
          {
            content: "+7 888 987-65-43",
            isPrimary: true,
            //label: "SMS",
          },
        ],
      },
      vacancies: ["designer", "intern", "manager", "juniorBackend"],
      recruiters: ["ivanov"],
      clients: ["tbank", "alfabank"],
      vacanciesInProcess: [
        { role: "Java developer", company: "Sberbank" },
        { role: "Python developer", company: "Sberbank" },
        { role: "Java developer", company: "Alfa bank" },
        { role: "Java developer", company: "T-bank" },
      ],
      vacanciesInProcessId: 475,
    },
    {
      id: 2,
      name: "Иван Иванов",
      avatarColor: "green-500",
      unreadMessagesCount: 2,
      awaitingResponse: true,
      contacts: {
        Telegram: [
          {
            content: "@ivanivanov",
            isPrimary: true,
            //label: "Telegram",
          },
        ],
        Email: [
          {
            content: "ivan@ivanov.com",
            isPrimary: false,
            //label: "Email",
          },
        ],
        WA: [
          {
            content: "+7 999 678-00-45",
            isPrimary: false,
            //label: "WA",
          },
        ],
        SMS: [
          {
            content: "+7 347 798-12-67",
            isPrimary: true,
            //label: "SMS",
          },
        ],
      },
      vacancies: ["developer", "devOps", "juniorBackend", "manager"],
      recruiters: ["you"],
      clients: ["tbank", "alfabank", "rosbank"],
      vacanciesInProcess: [
        { role: "JS developer", company: "Roskosmos" },
        { role: "C# developer", company: "Sberbank" },
        { role: "Python developer", company: "Alfa bank" },
        { role: "Java developer", company: "T-bank" },
      ],
      vacanciesInProcessId: 6741,
    },
    {
      id: 3,
      name: "Павел Николаев",
      avatarColor: "purple-500",
      unreadMessagesCount: 1,
      awaitingResponse: true,
      contacts: {
        Telegram: [
          {
            content: "@pavelnikolaev",
            isPrimary: true,
            //label: "Telegram",
          },
        ],
        Email: [
          {
            content: "pavel@nikolaev.com",
            isPrimary: false,
            //label: "Email",
          },
        ],
        WA: [
          {
            content: "+7 956 214-87-90",
            isPrimary: false,
            //label: "WA",
          },
        ],
        SMS: [
          {
            content: "+7 888 690-12-09",
            isPrimary: true,
            //label: "SMS",
          },
        ],
      },
      vacancies: ["manager", "devOps", "seniorFrontend", "designer"],
      recruiters: ["you"],
      clients: ["alfabank", "vtb"],
      vacanciesInProcess: [
        { role: "ML engineer", company: "VTB" },
        { role: "C# developer", company: "Sberbank" },
        { role: "Python developer", company: "Alfa bank" },
        { role: "Java developer", company: "T-bank" },
      ],
      vacanciesInProcessId: 1678,
    },
    {
      id: 4,
      name: "Анна Козлова",
      avatarColor: "red-500",
      unreadMessagesCount: 0,
      awaitingResponse: false,
      contacts: {
        Telegram: [
          {
            content: "@annakozlova",
            isPrimary: true,
            //label: "Telegram",
          },
        ],
        Email: [
          {
            content: "anna@kozlova.com",
            isPrimary: false,
            //label: "Email",
          },
        ],
        WA: [
          {
            content: "+7 345 76-15-90",
            isPrimary: false,
            //label: "WA",
          },
        ],
        SMS: [
          {
            content: "+7 456 90-12-89",
            isPrimary: true,
            //label: "SMS",
          },
        ],
      },
      vacancies: ["manager, juniorBackender, designer"],
      recruiters: ["petrov"],
      clients: ["tbank", "sberbank", "vtb"],
      vacanciesInProcess: [
        { role: "C++ developer", company: "VTB" },
        { role: "C# developer", company: "Sberbank" },
        { role: "Python developer", company: "Alfa bank" },
        { role: "Java developer", company: "T-bank" },
      ],
      vacanciesInProcessId: 678,
    },
    {
      id: 5,
      name: "Максим Петров",
      avatarColor: "indigo-500",
      unreadMessagesCount: 3,
      awaitingResponse: true,
      contacts: {
        Telegram: [
          {
            content: "@maksimpetrov",
            isPrimary: true,
            //label: "Telegram",
          },
        ],
        Email: [
          {
            content: "maksim@petrov.com",
            isPrimary: false,
            //label: "Email",
          },
        ],
        WA: [
          {
            content: "+7 876 165-87-12",
            isPrimary: false,
            //label: "WA",
          },
        ],
        SMS: [
          {
            content: "+7 678 234-98-12",
            isPrimary: true,
            label: "SMS",
          },
        ],
      },
      vacancies: ["developer", "seniorFrontend", "juniorBackend", "manager"],
      recruiters: ["you"],
      clients: ["alfabank"],
      vacanciesInProcess: [
        { role: "C# developer", company: "Rosbank" },
        { role: "C# developer", company: "Sberbank" },
        { role: "Go developer", company: "Alfa Bank" },
        { role: "Java developer", company: "T-bank" },
      ],
      vacanciesInProcessId: 6750,
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
        subject: "Вакансия",
        sender: "Сергей Семенов",
        timestamp: "2023-01-01T00:00:00.000Z",
        isUnread: true,
        senderRole: "candidate",
        messanger: "Email",
      },
      {
        id: 2,
        text: "Как дела?",
        subject: "Вакансия",
        sender: "Дарья Зовулькина",
        timestamp: "2023-02-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "Email",
      },
      {
        id: 3,
        text: "Отлично, а тебя?",
        sender: "Сергей Семенов",
        timestamp: "2023-03-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "Telegram",
      },
      {
        id: 4,
        text: "Тоже неплохо, чем могу помочь?",
        sender: "Дарья Зовулькина",
        timestamp: "2023-04-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "SMS",
      },
    ],
    2: [
      {
        id: 11,
        text: "Приветствую!",
        sender: "Дарья Зовулькина",
        timestamp: "2023-05-01T00:00:00.000Z",
        isUnread: true,
        senderRole: "recruiter",
        messanger: "Telegram",
      },
      {
        id: 12,
        text: "Здравствуйте, что случилось?",
        sender: "Максим Петров",
        timestamp: "2023-06-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "WA",
      },
      {
        id: 13,
        text: "Ничего особенного, просто хотела узнать, как у тебя дела.",
        sender: "Дарья Зовулькина",
        timestamp: "2023-07-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "Email",
      },
      {
        id: 14,
        text: "Спасибо, все нормально. А у тебя какие планы на выходные?",
        sender: "Максим Петров",
        timestamp: "2023-08-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "Email",
      },
    ],
    3: [
      {
        id: 21,
        text: "Добрый день!",
        sender: "Павел Николаев",
        timestamp: "2023-09-01T00:00:00.000Z",
        isUnread: true,
        senderRole: "candidate",
        messanger: "Email",
      },
      {
        id: 22,
        text: "Здравствуйте, как ваши дела?",
        sender: "Дарья Зовулькина",
        timestamp: "2023-10-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "SMS",
      },
      {
        id: 23,
        text: "Все отлично, спасибо за интерес. Как ваше настроение?",
        sender: "Павел Николаев",
        timestamp: "2023-11-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "WA",
      },
      {
        id: 24,
        text: "Настроение хорошее, рад слышать, что у вас тоже все хорошо.",
        sender: "Дарья Зовулькина",
        timestamp: "2023-12-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "SMS",
      },
    ],
    4: [
      {
        id: 31,
        text: "Привет!",
        sender: "Анна Козлова",
        timestamp: "2024-01-01T00:00:00.000Z",
        isUnread: true,
        senderRole: "candidate",
        messanger: "Email",
      },
      {
        id: 32,
        text: "Привет-привет! Как жизнь?",
        sender: "Дарья Зовулькина",
        timestamp: "2024-02-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "Email",
      },
      {
        id: 33,
        text: "Жизнь кипит, работа, семья... А вы как?",
        sender: "Анна Козлова",
        timestamp: "2024-03-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "WA",
      },
      {
        id: 34,
        text: "Работаю, учусь, стараюсь успевать везде. Рад был услышать от вас!",
        sender: "Дарья Зовулькина",
        timestamp: "2024-04-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "Telegram",
      },
    ],
    5: [
      {
        id: 41,
        text: "Доброго времени суток!",
        sender: "Дарья Зовулькина",
        timestamp: "2024-05-01T00:11:25.000Z",
        isUnread: true,
        senderRole: "recruiter",
        messanger: "Email",
      },
      {
        id: 42,
        text: "Здравствуйте! Что нового?",
        sender: "Максим Петров",
        timestamp: "2024-06-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "Telegram",
      },
      {
        id: 43,
        text: "Новые проекты, новые возможности. А у вас?",
        sender: "Дарья Зовулькина",
        timestamp: "2024-07-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "recruiter",
        messanger: "Telegram",
      },
      {
        id: 44,
        text: "У меня все стабильно, рад за ваши успехи!",
        sender: "Максим Петров",
        timestamp: "2024-08-01T00:00:00.000Z",
        isUnread: false,
        senderRole: "candidate",
        messanger: "Telegram",
      },
    ],
  },
  appliedFilters: 0,
  showAwaitingResponse: false,
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleIsOpen(state) {
      state.isOpen = !state.isOpen;
    },
    applyFilters(state) {
      {
        /*const { vacancies, recruiters, clients } = action.payload;
      state.filteredChats = state.chats.filter((chat) => {
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
      }); */
      }
      state.appliedFilters = Object.values(state.selectedFilters).filter(
        (arr) => arr.length > 0
      ).length;
    },
    toggleFilter(state) {
      state.showAwaitingResponse = !state.showAwaitingResponse;
    },
    setShowAwaitingResponse: (state, action) => {
      state.showAwaitingResponse = action.payload;
    },
    selectChat(state, action) {
      state.selectedChat = action.payload;
    },
    resetFilters(state) {
      state.selectedFilters = { vacancies: [], recruiters: [], clients: [] };
      state.appliedFilters = 0;
    },
    setFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    addMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    resetUnreadCount(state, action) {
      const { chatId } = action.payload;
      state.chats = state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, unreadMessagesCount: 0, awaitingResponse: false }
          : chat
      );
      state.filteredChats = state.filteredChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, unreadMessagesCount: 0, awaitingResponse: false }
          : chat
      );
      state.messages[chatId] = state.messages[chatId].map((message) => ({
        ...message,
        isUnread: false,
      }));
    },
    // New reducer to add a contact
    addContact(state, action) {
      const { chatId, contactType, contact } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);
      if (chat) {
        if (!chat.contacts[contactType]) {
          chat.contacts[contactType] = [];
        }
        chat.contacts[contactType].push(contact);
      }
    },

    // New reducer to remove a contact
    // In removeContact reducer
    removeContact(state, action) {
      const { chatId, contactType, contactIndex } = action.payload;
      const chat = state.chats.find((chat) => chat.id === chatId);
      if (chat && chat.contacts[contactType]) {
        chat.contacts[contactType].splice(contactIndex, 1);

        // Clear reply if contact type becomes empty
        if (
          chat.contacts[contactType].length === 0 &&
          state.replyingTo?.messanger === contactType
        ) {
          state.replyingTo = null;
        }
      }
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
  },
});

export const {
  toggleIsOpen,
  applyFilters,
  toggleFilter,
  setShowAwaitingResponse,
  selectChat,
  resetFilters,
  setFilters,
  addMessage,
  resetUnreadCount,
  addContact,
  removeContact,
  setReplyingTo,
} = chatSlice.actions;

export default chatSlice.reducer;
