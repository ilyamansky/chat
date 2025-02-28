import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./redux/chatSlice";
import authReducer from "./redux/authSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
});

export default store;
