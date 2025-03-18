"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket } from "../lib/socket";
import { addMessage, updateChatState } from "../redux/chatSlice";

export default function SocketManager() {
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

  const dispatch = useDispatch();
  const activeChatId = useSelector((state) => state.chat.selectedChat?.id);

  useEffect(() => {
    const socket = initSocket();
    const messageEvents = [
      "telegram_sent",
      "telegram_received",
      "whatsapp_sent",
      "whatsapp_received",
      "email_sent",
      "email_received",
    ];

    const handleIncomingMessage = (data) => {
      try {
        const messageData = typeof data === "string" ? JSON.parse(data) : data;
        {
          /*const parsedAttachments =
          safeJsonParse(messageData.attachments)?.attachments || [];
        const formattedAttachments = parsedAttachments.map((att) => ({
          name: att.name,
          id: att.attachment_id,
        }));*/
        }
        const parsedAttachments = messageData.attachments?.attachments || [];
        const formattedAttachments = parsedAttachments.map((att) => ({
          name: att.name,
          // Используем правильное поле для ID
          id: att.attachment_id || att.id,
        }));
        const usedContact = messageData.used_contact || {};

        const formattedMessage = {
          id: messageData.id?.toString(),
          candidate_id: messageData.candidate_id?.toString(),
          text: messageData.text,
          timestamp: messageData.created_at
            ? new Date(messageData.created_at).toISOString()
            : new Date().toISOString(),
          author: messageData.author || {
            id: null,
            name: "Unknown Author",
            role: "unknown",
          },
          messanger:
            messageData.used_contact?.channel_name || "Неизвестный мессенджер",
          usedContact: {
            // Сохраняем структурированные данные
            channel_name: usedContact?.channel_name,
            email: usedContact?.email,
            phone: usedContact?.phone,
            user_id: messageData.used_contact?.user_id,
            user_name: usedContact?.user_name,
          },
          unreadCount: messageData.unread_count,
          //attachments: messageData.attachments,
          //attachment_name: messageData.attachments?.attachments?.[0]?.name,
          //attachment_id:
          // messageData.attachments?.attachments?.[0]?.attachment_id,
          attachments: formattedAttachments,
          subject: messageData.subject_tema,
          replyTo: messageData.reply_on_message,
          status: messageData.status,
          channel_message_id: messageData.channel_message_id,
          direction: messageData.event_type?.endsWith("_sent")
            ? "outgoing"
            : "incoming",
        };

        dispatch(
          addMessage({
            chatId: messageData.candidate_id?.toString(),
            message: formattedMessage,
            //usedContact: messageData.usedContact,
          })
        );
        dispatch(
          updateChatState({
            chatId: messageData.candidate_id?.toString(),
            unreadCount: messageData.unread_count,
            lastMessage: formattedMessage.text,
            timestamp: formattedMessage.timestamp,
          })
        );
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    // Register all message event listeners
    messageEvents.forEach((event) => {
      socket.on(event, handleIncomingMessage);
    });

    // Cleanup function
    return () => {
      messageEvents.forEach((event) => {
        socket.off(event, handleIncomingMessage);
      });
    };
  }, [dispatch, activeChatId]);

  return null;
}
