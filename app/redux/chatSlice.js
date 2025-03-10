import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

{
  /*function safeJsonParse(jsonString) {
  if (jsonString !== undefined) {
    try {
      console.log(jsonString, "6");
      return JSON.parse(jsonString) || {};
      //return jsonString; // Возвращаем значение по умолчанию
    } catch (error) {
      console.error("Ошибка при парсинге JSON:", error);
      return null; // Возвращаем null или значения по умолчанию
    }
  }
}*/
}

function safeJsonParse(jsonString) {
  if (jsonString !== undefined && jsonString !== null) {
    try {
      // Проверяем, что строка не пустая
      if (jsonString.trim() === "") {
        return {}; // Возвращаем объект по умолчанию
      }

      // Пытаемся распарсить строку
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Ошибка при парсинге JSON:", jsonString);
      return null; // Возвращаем null или значения по умолчанию
    }
  }
  return null; // Возвращаем null, если jsonString не определен или равен null
}

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  // { getState }
  //const token = getState().auth.token;
  //const token = localStorage.getItem("jwtToken");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTgyNjQwNjAyOCwiaWF0IjoxNzQwMDA2MDI4fQ.7_NyQj5R-lgESKV1V50h0IK5Iw0KHjmDBPUBUFnkQVs";

  const baseUrl = "https://prokrinilik.beget.app/webhook/get_chats";
  //const vacancyIds = ["2222", "3333"];
  //const userIds = ["4444", "5555"];
  const vacancyIds = [];
  const userIds = [];

  // Формирование параметров запроса

  const params = new URLSearchParams({
    vacancy_ids: JSON.stringify(vacancyIds),
    user_ids: JSON.stringify(userIds),
  });

  // Формирование полного URL
  const url = `${baseUrl}?${params.toString()}`;
  //const urlParams = new URLSearchParams();
  //const url =
  //"https://prokrinilik.beget.app/webhook/get_vacancies?customerid=83174";
  //const url = "https://prokrinilik.beget.app/webhook/get_users";
  //const url = "https://prokrinilik.beget.app/webhook/get_companies";
  //const url = "https://prokrinilik.beget.app/webhook/get_companies";
  //const url = "https://prokrinilik.beget.app/webhook/get_vacancies";
  //const url =
  //"https://prokrinilik.beget.app/webhook/get_messages?candidate_id=5";
  //const url = "https://prokrinilik.beget.app/webhook/get_chats";

  //const url =
  // "https://prokrinilik.beget.app/webhook/get_chats?vacancy_ids=%5B%22222%22%2C%22333%22%5D&user_ids=%5B%22444%22%2C%22555%22%5D";
  console.log("token", token);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      //"Content-Type": "text/plain",
      //"Content-Type": "application/json",
    },
    //body: JSON.stringify(filters),
  });

  if (!response.ok) throw new Error("Ошибка загрузки чатов");
  const data = await response.json();
  console.log("data", data.chats);
  return data;
});

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (candidateId, { getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://prokrinilik.beget.app/webhook/get_messages?candidate_id=${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch messages");
      }

      const messages = await response.json();
      return {
        chatId: candidateId,
        messages: messages.map((msg) => {
          return {
            id: msg.id,
            text: msg.text,
            timestamp: msg.created_at
              ? new Date(msg.created_at).toISOString()
              : "Некорректная дата",
            sender: msg.user_id ? "Recruiter" : "Candidate",
            senderRole: msg.user_id ? "recruiter" : "candidate",
            messanger:
              safeJsonParse(msg.used_contact)?.channel_name ||
              "Неизвестный мессенджер",
            subject: msg.subject_tema,
            attachments: [],
            author: safeJsonParse(msg.author) || {
              id: null,
              name: "Неизвестный автор",
              role: "unknown",
            },
            replyTo: safeJsonParse(msg.reply_on_message), // Можно добавить это поле, если нужно
          };
        }),
      };
    } catch (error) {
      console.error("Message fetch error:", error);
      throw error;
    }
  }
);

export const getCandidateByUrl = createAsyncThunk(
  "chat/getCandidateByUrl",
  async (candidateUrl, { getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://prokrinilik.beget.app/webhook/get_candidate_by_url?candidate_url=${encodeURIComponent(
          candidateUrl
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        let errorMessage = "Произошла ошибка";

        // Особый случай для 409 ошибки
        if (response.status === 409) {
          errorMessage = "Кандидат уже существует в базе";

          // Пытаемся получить кастомное сообщение от сервера
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Если не получилось распарсить JSON, используем дефолтное сообщение
          }
        }
        // Для остальных ошибок
        else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || `Ошибка: ${response.status}`;
          } catch (e) {
            errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
          }
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      //console.error("Error in getCandidateByUrl:", error.message);
      alert(error.message);
      //throw error;
    }
  }
);

export const addCandidate = createAsyncThunk(
  "chat/addCandidate",
  async (candidateId, { getState }) => {
    const token = getState().auth.token || localStorage.getItem("jwtToken");
    const response = await fetch(
      `https://prokrinilik.beget.app/webhook/create_candidate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_url: candidateId,
        }),
      }
    );
    if (!response.ok) throw new Error("Failed to add candidate");
    return await response.json();
  }
);

export const fetchUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await fetch(
      "https://prokrinilik.beget.app/webhook/get_users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Ошибка загрузки пользователей");
    const data = await response.json();
    return data[0].users;
  }
);
export const fetchCompanies = createAsyncThunk(
  "chat/fetchCompanies",
  async (_, { getState }) => {
    //const token = getState().auth.token || localStorage.getItem("jwtToken");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTgyNjQwNjAyOCwiaWF0IjoxNzQwMDA2MDI4fQ.7_NyQj5R-lgESKV1V50h0IK5Iw0KHjmDBPUBUFnkQVs";
    const response = await fetch(
      "https://prokrinilik.beget.app/webhook/get_companies",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch companies");
    const data = await response.json();
    return data; // Assuming response is array of { customerid, name, ... }
  }
);
export const fetchVacancies = createAsyncThunk(
  "chat/fetchVacancies",
  async (customerIds, { getState }) => {
    //const token = getState().auth.token || localStorage.getItem("jwtToken");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTgyNjQwNjAyOCwiaWF0IjoxNzQwMDA2MDI4fQ.7_NyQj5R-lgESKV1V50h0IK5Iw0KHjmDBPUBUFnkQVs";
    const params = new URLSearchParams();
    customerIds.forEach((id) => params.append("customerid", id));

    const response = await fetch(
      `https://prokrinilik.beget.app/webhook/get_vacancies?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch vacancies");
    const data = await response.json();
    return data; // Assuming response is array of { id, name, customerid, ... }
  }
);

// chatSlice.js
// chatSlice.js

export const resetUnreadCountMessages = createAsyncThunk(
  "chat/resetUnreadCountMessages",
  async (chatId, { getState, rejectWithValue }) => {
    try {
      //const token = getState().auth.token;
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTgyNjQwNjAyOCwiaWF0IjoxNzQwMDA2MDI4fQ.7_NyQj5R-lgESKV1V50h0IK5Iw0KHjmDBPUBUFnkQVs";

      const response = await fetch(
        `https://prokrinilik.beget.app/webhook/reset_list_of_unread`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `candidate_id=${chatId}`,
        }
      );

      if (!response.ok) throw new Error("Ошибка сброса счетчика");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactsAPI = createAsyncThunk(
  "chat/updateContacts",
  async ({ candidateId, contacts }, { rejectWithValue }) => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTgyNjQwNjAyOCwiaWF0IjoxNzQwMDA2MDI4fQ.7_NyQj5R-lgESKV1V50h0IK5Iw0KHjmDBPUBUFnkQVs";
      const formData = new FormData();
      formData.append("candidate_id", candidateId);
      formData.append("updated_contact", JSON.stringify(contacts));

      const response = await fetch(
        "https://prokrinilik.beget.app/webhook/edit_contact",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      return {
        id: candidateId,
        contacts: JSON.parse(data.contacts),
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFilteredChats = createAsyncThunk(
  "chat/fetchFilteredChats",
  async (filters, { getState }) => {
    //const token = getState().auth.token;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImV4cCI6MTgyNjQwNjAyOCwiaWF0IjoxNzQwMDA2MDI4fQ.7_NyQj5R-lgESKV1V50h0IK5Iw0KHjmDBPUBUFnkQVs";

    const params = new URLSearchParams({
      vacancy_ids: JSON.stringify(filters.vacancyIds || []),
      user_ids: JSON.stringify(filters.userIds || []),
      employers_ids: JSON.stringify(filters.employerIds || []),
    });

    const response = await fetch(
      `https://prokrinilik.beget.app/webhook/get_chats?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch filtered chats");
    return response.json();
  }
);

export const applyFilters = createAsyncThunk(
  "chat/applyFilters",
  async (_, { getState, dispatch }) => {
    const { selectedFilters } = getState().chat;
    const filters = {
      employerIds: selectedFilters.clients.map((c) => c.value),
      vacancyIds: selectedFilters.vacancies.map((v) => v.value),
      userIds: selectedFilters.recruiters.map((r) => r.value),
    };

    await dispatch(fetchFilteredChats(filters));
    return filters;
  }
);

export const resetFilters = createAsyncThunk(
  "chat/resetFilters",
  async (_, { dispatch }) => {
    await dispatch(fetchChats());
    return null;
  }
);

export const createMessage = createAsyncThunk(
  "chat/createMessage",
  async (messageData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("jwtToken");
      const formData = new FormData();

      // Добавляем основные поля
      Object.entries(messageData).forEach(([key, value]) => {
        if (key === "file" && value) {
          formData.append("attachement", value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        "https://prokrinilik.beget.app/webhook/create_message",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      //return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  searchedCandidate: null,
  addCandidateStatus: "idle",
  error: null,
  users: [],
  chats: [],
  meta: {
    awaiting_response: 0,
  },

  selectedFilters: {
    vacancies: [],
    recruiters: [],
    clients: [],
  },
  filteredChats: [],
  messages: [],
  appliedFilters: 0,
  showAwaitingResponse: false,
  selectedChat: null,
  messageFilters: {
    channels: [],
    authors: [],
  },
  knownChannels: [
    { value: "telegram", label: "Telegram" },
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "phone", label: "Phone" },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleIsOpen(state) {
      state.isOpen = !state.isOpen;
    },
    updateChatState: (state, action) => {
      const { chatId, unreadCount, lastMessage, timestamp } = action.payload;

      console.log("[Redux] UpdateChatState payload:", action.payload);

      //const chatIndex = state.chats.findIndex((c) => c.chatId === chatId);
      const chatIndex = state.chats.findIndex((c) => {
        //console.log("Сравниваем c.chatId:", c.id, "с chatId:", chatId);
        return c.id == chatId;
      });

      if (chatIndex === -1) return;
      //console.log("[Redux] UpdateChatState chatIndex:", chatIndex);

      state.chats[chatIndex] = {
        ...state.chats[chatIndex],
        unread_count: Number(unreadCount),
        last_message_text: lastMessage,
        lastActive: timestamp,
        //status:
        //state.chats[chatIndex]?.last_message?.author?.role === "candidate"
        //? "unanswered"
        //: "answered",
      };
      // Пересчитываем общий счетчик
      state.meta.awaiting_response = state.chats.filter(
        (chat) => chat.unread_count > 0
      ).length;
      //console.log(state, "statechats");
      console.log("New state after update:", {
        updatedChat: { ...state.chats[chatIndex] }, // Копия обновленного чата
        awaitingResponse: state.meta.awaiting_response, // Новое значение счетчика
      });
    },

    setMessageFilters: (state, action) => {
      state.messageFilters = {
        ...state.messageFilters, // Keep existing filters
        ...action.payload, // Merge with new filters
      };
    },
    resetMessageFilters: (state) => {
      state.messageFilters = initialState.messageFilters;
    },
    //resetMessageFilters: (state) => {
    //state.messageFilters = { channels: [], authors: [] };
    //},

    /*
    applyFilters: (state) => {
      const { vacancies, recruiters, clients } = state.selectedFilters;
      const vacancyIds = vacancies.map((v) => v.value);
      const userIds = recruiters.map((r) => r.value);
      const employerIds = clients.map((c) => c.value);

      // Dispatch the filtered fetch
      dispatch(fetchFilteredChats({ vacancyIds, userIds, employerIds }));

      // Optional: Update local state if needed
      state.appliedFilters = [vacancies, recruiters, clients].filter(
        (arr) => arr.length
      ).length;
      console.log("filtersLength", state.appliedFilters);
    }, */

    /*resetFilters: (state) => {
      state.selectedFilters = { vacancies: [], recruiters: [], clients: [] };
      state.appliedFilters = 0;
      dispatch(fetchChats()); // Refetch original chats
    }, */

    toggleFilter(state) {
      state.showAwaitingResponse = !state.showAwaitingResponse;
    },
    setShowAwaitingResponse: (state, action) => {
      state.showAwaitingResponse = action.payload;
    },
    selectChat(state, action) {
      state.selectedChat = action.payload;
    },

    setFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    //addMessage(state, action) {
    //const { chatId, message } = action.payload;
    //if (!state.messages[chatId]) {
    //state.messages[chatId] = [];
    //}
    // state.messages[chatId].push(message);
    //},
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      console.log(action.payload, "actionPayload");

      // Create array if not exists
      // if (!state.messages[chatId]) {
      // state.messages[chatId] = [];
      // }

      // Check for duplicates using unique ID
      const messageExists = state.messages[chatId]?.some(
        (m) => m.id === message.id
      );

      if (!messageExists) {
        state.messages[chatId]?.push({
          ...message,
          senderRole:
            message.author.role === "candidate" ? "candidate" : "recruiter",
          messanger: message.messanger,
          attachments: [],
        });

        // Auto-increment unread count if not active chat
        //if (state.selectedChat?.id !== chatId) {
        //const chatIndex = state.chats.findIndex(c => c.id === chatId);
        //if (chatIndex > -1) {
        //state.chats[chatIndex].unread_count += 1;
        // }
        //}
      }
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
      state.messages[chatId] = state.messages[chatId]?.map((message) => ({
        ...message,
        isUnread: false,
      }));
    },
    // New reducer to add a contact
    addContact: (state, action) => {
      const { chatId, contactType, contact } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        const typeKey = contactType.toLowerCase();
        if (!chat.contacts[typeKey]) chat.contacts[typeKey] = [];
        chat.contacts[typeKey].push(contact);
      }
    },
    removeContact: (state, action) => {
      const { chatId, contactType, contactIndex } = action.payload;
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat && chat.contacts[contactType]) {
        chat.contacts[contactType].splice(contactIndex, 1);
      }
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
      // Автоматически выбираем соответствующий мессенджер
      if (action.payload) {
        const messenger = action.payload.messanger.toLowerCase();
        state.selectedTab =
          messenger.charAt(0).toUpperCase() + messenger.slice(1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload.chats;
        state.meta.awaiting_response = action.payload.meta.awaiting_response;
        console.log(action.payload);
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchFilteredChats.fulfilled, (state, action) => {
        state.filteredChats = action.payload.chats; // Make sure payload structure matches
        state.meta.awaiting_response =
          action.payload.meta?.awaiting_response || 0;
      })
      .addCase(updateContactsAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateContactsAPI.fulfilled, (state, action) => {
        state.status = "succeeded";
        const chat = state.chats.find((c) => c.id === action.payload.id);
        if (chat) {
          chat.contacts = action.payload.contacts;
        }
      })
      .addCase(updateContactsAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getCandidateByUrl.fulfilled, (state, action) => {
        state.searchedCandidate = action.payload;
      })
      .addCase(getCandidateByUrl.rejected, (state, action) => {
        state.searchedCandidate = null;
        state.error = action.error.message;
      })
      .addCase(addCandidate.pending, (state) => {
        state.addCandidateStatus = "loading";
      })
      .addCase(addCandidate.fulfilled, (state) => {
        state.addCandidateStatus = "succeeded";
        state.searchedCandidate = null;
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.addCandidateStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(createMessage.pending, (state) => {
        state.messageStatus = "sending";
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.messageStatus = "succeeded";
        // Здесь можно обновить состояние чата
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.messageStatus = "failed";
        state.error = action.payload;
      })
      .addCase(resetUnreadCountMessages.fulfilled, (state, action) => {
        // Обновляем метаданные
        state.meta.awaiting_response = action.payload.meta.awaiting_response;

        // Обновляем чаты из массива ответа
        action.payload.chats.forEach((updatedChat) => {
          const index = state.chats.findIndex((c) => c.id === updatedChat.id);
          if (index !== -1) {
            state.chats[index] = {
              ...state.chats[index], // Сохраняем остальные поля
              unread_count: updatedChat.unread_count,
              unread_messages: updatedChat.unread_messages,
            };
          }
        });
      })
      .addCase(applyFilters.fulfilled, (state, action) => {
        console.log(action, "stateFilters");
        state.appliedFilters = [
          action.payload.employerIds,
          action.payload.vacancyIds,
          action.payload.userIds,
        ].filter((arr) => arr?.length).length;
      })
      .addCase(resetFilters.fulfilled, (state) => {
        state.appliedFilters = 0;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });

    {
      /*}.addCase(fetchClients.fulfilled, (state, action) => {
        state.clients = action.payload;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.vacancies = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      }); */
    }
  },
});

export const {
  toggleIsOpen,
  //applyFilters,
  toggleFilter,
  setShowAwaitingResponse,
  selectChat,
  //resetFilters,
  setFilters,
  addMessage,
  resetUnreadCount,
  addContact,
  removeContact,
  setReplyingTo,
  setMessageFilters,
  resetMessageFilters,
  updateChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
