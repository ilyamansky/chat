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
        //ttpconst messageData = JSON.parse(data);

        // Validate required fields
        //if (!messageData.candidate_id || !messageData.used_contact) {
        //console.error("Invalid message format:", messageData);
        //return;
        //}

        // const unreadCount = messageData.unread_count;
        //console.log("unread_count:", unreadCount);
        console.log("Message received:", messageData);
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
          subject: messageData.subject_tema,
          replyTo: messageData.reply_on_message,
          status: messageData.status,
          channel_message_id: messageData.channel_message_id,
          direction: messageData.event_type?.endsWith("_sent")
            ? "outgoing"
            : "incoming",
        };
        //console.log("unreadCount from messageData:", messageData);

        dispatch(
          addMessage({
            chatId: messageData.candidate_id?.toString(),
            message: formattedMessage,
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

/*"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initSocket } from "../lib/socket";
import { addMessage } from "../redux/chatSlice";

export default function SocketManager() {
  const dispatch = useDispatch();
  const activeChatId = useSelector((state) => state.chat.selectedChat?.id);

  function enhancedJsonParse(input) {
    try {
      // If input is already an object, return it
      if (typeof input === "object" && input !== null) return input;

      // Clean up common formatting issues
      const cleanedString = String(input)
        .replace(/\n/g, "") // Remove newlines
        .replace(/\t/g, "") // Remove tabs
        .replace(/\r/g, "") // Remove carriage returns
        .replace(/\\"/g, '"') // Unescape quotes
        .replace(/'/g, '"') // Replace single quotes
        .replace(/,\s*}/g, "}") // Fix trailing commas
        .replace(/,\s*]/g, "]"); // Fix trailing commas in arrays

      return JSON.parse(cleanedString);
    } catch (error) {
      console.error("JSON parse error:", error.message, "Content:", input);
      return null;
    }
  }

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

    const handleIncomingMessage = (rawData) => {
      try {
        // Initial parse of socket data
        const messageData =
          typeof rawData === "string" ? enhancedJsonParse(rawData) : rawData;

        // Validate essential fields
        if (!messageData?.candidate_id) {
          console.error("Invalid message structure:", messageData);
          return;
        }

        // Deep parse of nested JSON strings
        const parsedContact = enhancedJsonParse(messageData.used_contact);
        const parsedAuthor = enhancedJsonParse(messageData.author);
        const parsedReply = enhancedJsonParse(messageData.reply_on_message);

        // Construct normalized message
        const formattedMessage = {
          id: String(messageData.id),
          candidate_id: String(messageData.candidate_id),
          text: messageData.text || "",
          timestamp: messageData.created_at
            ? new Date(messageData.created_at).toISOString()
            : new Date().toISOString(),
          author: parsedAuthor || {
            id: null,
            name: "Unknown Author",
            role: "unknown",
          },
          messanger: parsedContact?.channel_name?.toLowerCase() || "unknown",
          subject: messageData.subject_tema,
          replyTo: parsedReply,
          status: messageData.status,
          channel_message_id: messageData.channel_message_id,
          direction: messageData.event_type?.endsWith("_sent")
            ? "outgoing"
            : "incoming",
          rawData: messageData, // Keep original data for debugging
        };

        // Dispatch to Redux store
        dispatch(
          addMessage({
            chatId: String(messageData.candidate_id),
            message: formattedMessage,
          })
        );
      } catch (error) {
        console.error("Message processing failed:", error);
      }
    };

    // Register event listeners
    messageEvents.forEach((event) => {
      socket.on(event, handleIncomingMessage);
    });

    return () => {
      // Cleanup listeners
      messageEvents.forEach((event) => {
        socket.off(event, handleIncomingMessage);
      });
    };
  }, [dispatch, activeChatId]);

  return null;
} */

{
  /*"use client";
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
        messanger: messageData.used_contact.channel_name,
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
} */
}
