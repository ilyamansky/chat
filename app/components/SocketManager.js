"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket } from "../lib/socket";
import { addMessage } from "../redux/chatSlice";

export default function SocketManager() {
  const dispatch = useDispatch();
  const activeChatId = useSelector((state) => state.chat.selectedChat?.id);

  function safeJsonParse(jsonString) {
    if (jsonString !== undefined && jsonString !== typeof Object) {
      try {
        console.log(jsonString, "6");
        return JSON.parse(jsonString) || null;
        //return jsonString; // Возвращаем значение по умолчанию
      } catch (error) {
        console.error("Ошибка при парсинге JSON:", error);
        return null; // Возвращаем null или значения по умолчанию
      }
    }
  }

  useEffect(() => {
    const socket = initSocket();

    const handleNewMessage = (data) => {
      const messageData = JSON.parse(data);
      const chatId = messageData.candidate_id;
      if (!chatId) {
        console.log("candidate_id", messageData.text);
        console.log("Type of messageData:", typeof messageData);
        console.error("Received message without candidate_id:", messageData);
        return;
      }
      const formattedMessage = {
        id: messageData.id?.toString(),
        text: messageData.text,
        timestamp: messageData.created_at
          ? new Date(messageData.created_at).toISOString()
          : "Некорректная дата",
        author: messageData.author || {
          id: null,
          name: "Неизвестный автор",
          role: "unknown",
        },
        //messanger: messageData.used_contact.channel_name,
        subject: messageData.subject_tema,
        replyTo: messageData.reply_on_message,
        status: messageData.status,
        channel_message_id: messageData.channel_message_id,
      };

      dispatch(
        addMessage({
          chatId: messageData.candidate_id?.toString(),
          message: formattedMessage,
        })
      );
    };

    socket.on("telegram_received", handleNewMessage);

    return () => {
      socket.off("telegram_received", handleNewMessage);
    };
  }, [dispatch, activeChatId]);

  return null;
}
