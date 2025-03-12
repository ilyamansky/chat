import { useState, useEffect } from "react";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import { LinearProgress } from "@mui/material";
import FileIcon from "../ui/icons/FileIcon";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setReplyingTo, createMessage } from "../redux/chatSlice";
import { getIconSrc } from "../utils/functions";
import ChatInputCrossIcon from "../ui/icons/ChatInputCrossIcon";
import ReplyToIcon from "../ui/icons/ReplyToIcon";
import ArrowSendDisabled from "../ui/icons/ArrowSendDisabled";
import ArrowSendEnabled from "../ui/icons/ArrowSendEnabled";
import FileAttachmentCloseIcon from "../ui/icons/FileAttachmentCloseIcon";
import FileAttachIcon from "../ui/icons/FileAttachIcon";
import Image from "next/image";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

const parseContacts = (contactsInput) => {
  try {
    let parsedContacts;
    if (typeof contactsInput === "string") {
      parsedContacts = JSON.parse(contactsInput);
    } else if (typeof contactsInput === "object") {
      parsedContacts = contactsInput;
    } else {
      return {};
    }

    return Object.entries(parsedContacts).reduce(
      (result, [contactType, contactList]) => {
        const normalizedType = contactType.toLowerCase();
        const contactsArray = Array.isArray(contactList)
          ? contactList
          : [contactList];

        {
          /*result[normalizedType] = contactsArray
          .map((contact) => {
            let content;
            switch (normalizedType) {
              case "phone":
              case "whatsapp":
                content = contact.phone;
                break;
              case "email":
                content = contact.email || contact.content;
                break;
              case "telegram":
                content = contact.user_id || contact.user_name || "";
                break;
              default:
                content = "";
            }
            return { content: content?.toString() || "", isPrimary: false };
          }) */
        }
        result[normalizedType] = contactsArray
          .map((contact) => {
            let content;
            switch (normalizedType) {
              case "phone":
              case "whatsapp":
                content = contact.phone;
                break;
              case "email":
                content = contact.email; // Remove fallback to .content
                break;
              case "telegram":
                content = contact.user_id || contact.user_name || "";
                break;
              default:
                content = "";
            }
            return { content: content?.toString() || "", isPrimary: false };
          })
          .filter((contact) => contact.content);

        return result;
      },
      {}
    );
  } catch (error) {
    console.error("Error parsing contacts:", error);
    return {};
  }
};

const ChatInput = () => {
  const dispatch = useDispatch();
  const {
    chats,
    selectedChat: selectedChatState,
    messages,
    replyingTo,
  } = useSelector((state) => state.chat);

  const selectedChat = chats.find((chat) => chat.id === selectedChatState?.id);
  const rawContacts = selectedChat?.contacts || {};
  const contacts = parseContacts(rawContacts);
  const chatMessages = messages[selectedChat?.id] || [];

  const [selectedTab, setSelectedTab] = useState(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const [isAttaching, setIsAttaching] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [openPopover, setOpenPopover] = useState(null);

  const validateMessenger = () => {
    if (!selectedChat) return false;
    const baseType = selectedTab.replace(/\s\d+$/, "");
    return Array.isArray(contacts[baseType]) && contacts[baseType].length > 0;
  };

  useEffect(() => {
    const firstTab = Object.entries(contacts)
      .filter(([_, group]) => group.length > 0)
      .flatMap(([type, group]) =>
        group.map((_, index) => ({
          displayName: group.length > 1 ? `${type} ${index + 1}` : type,
        }))
      )[0]?.displayName;

    // Set first contact as default selected if no selection exists
    if (firstTab && !selectedTab) {
      setSelectedTab(firstTab);
    }
  }, [contacts]);

  {
    /*useEffect(() => {
    if (replyingTo) {
      const originalMessenger = replyingTo.messanger;
      if (!contacts[originalMessenger]?.length) {
        alert("Контакт для ответа был удален!");
        dispatch(setReplyingTo(null));
        return;
      }
      setSelectedTab(
        //originalMessenger.charAt(0).toUpperCase() + originalMessenger.slice(1)
        originalMessenger
      );
      console.log("replyingTo", replyingTo);
    }
  }, [replyingTo, contacts, dispatch]); */
  }

  // В ChatInput.jsx замените текущий useEffect для replyingTo на:
  {
    /*useEffect(() => {
    if (replyingTo?.usedContact) {
      const channel = replyingTo.usedContact.channel_name?.toLowerCase();
      const targetValue = {
        telegram:
          replyingTo.usedContact.user_id || replyingTo.usedContact.user_name,
        email: replyingTo.usedContact.email,
        whatsapp: replyingTo.usedContact.phone,
        phone: replyingTo.usedContact.phone,
      }[channel];

      // 1. Проверка существования канала
      const contactGroup = contacts[channel] || [];
      if (contactGroup.length === 0) {
        alert("Контакт для ответа был удален!");
        dispatch(setReplyingTo(null));
        return;
      }

      // 2. Поиск конкретного контакта
      const contactIndex = contactGroup.findIndex(
        (c) => c.content === targetValue
      );

      if (contactIndex === -1) {
        alert("Контакт для ответа был изменен!");
        dispatch(setReplyingTo(null));
        return;
      }

      // 3. Установка таба
      const displayName =
        contactGroup.length > 1 ? `${channel} ${contactIndex + 1}` : channel;

      setSelectedTab(displayName);
    }
  }, [replyingTo, contacts, dispatch]); */
  }
  {
    /* last version useEffect(() => {
    if (replyingTo?.contactIdentifier) {
      const { channel, value } = replyingTo.contactIdentifier;
      const contactGroup = contacts[channel] || [];

      // Ищем контакт по значению
      const contactExists = contactGroup.some((c) => c.content === value);

      if (!contactExists) {
        alert("Контакт для ответа был удален или изменен!");
        dispatch(setReplyingTo(null));
        return;
      }

      // Всегда используем актуальный индекс
      const contactIndex = contactGroup.findIndex((c) => c.content === value);
      const displayName =
        contactGroup.length > 1 ? `${channel} ${contactIndex + 1}` : channel;

      setSelectedTab(displayName);
    }
  }, [replyingTo, contacts, dispatch]); */
  }
  useEffect(() => {
    if (replyingTo?.contactIdentifier) {
      const { channel, value } = replyingTo.contactIdentifier;

      // Debug: Выводим искомые значения
      console.log("[DEBUG] Searching contact:", {
        channel,
        storedValue: value,
        currentTime: new Date().toISOString(),
      });

      const contactGroup = contacts[channel] || [];

      // Debug: Показываем текущие контакты
      console.log("[DEBUG] Current contacts in channel:", {
        channel,
        contacts: contactGroup.map((c) => c.content),
        contactCount: contactGroup.length,
      });

      const contactExists = contactGroup.some((c) => {
        const isMatch = c.content === value;

        // Debug: Проверка каждого элемента
        console.log(
          `[DEBUG] Checking contact: ${c.content} = ${value} → ${isMatch}`
        );

        return isMatch;
      });

      if (!contactExists) {
        // Debug: Детали ошибки
        console.error("[ERROR] Contact mismatch!", {
          reason: "Value not found in contacts",
          storedValue: value,
          existingValues: contactGroup.map((c) => c.content),
          contactGroupJSON: JSON.stringify(contactGroup),
        });

        alert("Контакт для ответа был удален или изменен!");
        dispatch(setReplyingTo(null));
        return;
      }

      const contactIndex = contactGroup.findIndex((c) => c.content === value);

      // Debug: Результаты поиска
      console.log("[DEBUG] Contact found at index:", contactIndex + 1);

      const displayName =
        contactGroup.length > 1 ? `${channel} ${contactIndex + 1}` : channel;

      setSelectedTab(displayName);
    }
  }, [replyingTo, contacts, dispatch]);

  {
    /*useEffect(() => {
    if (replyingTo) {
      const originalDisplayName = replyingTo.contactDisplayName;
      const contactType = originalDisplayName?.split(" ")[0].toLowerCase();

      // Check if contact exists
      if (!contacts[contactType]?.length) {
        alert("Contact for reply was removed!");
        dispatch(setReplyingTo(null));
        return;
      }

      setSelectedTab(originalDisplayName);
    }
  }, [replyingTo, contacts, dispatch]); */
  }

  useEffect(() => {
    if (replyingTo) {
      const originalMessage = chats
        .flatMap((chat) => messages[chat.id] || [])
        .find((msg) => msg.id === replyingTo.id);

      if (originalMessage?.messanger === "email") {
        setSubject(originalMessage.subject?.replace("Тема: ", "") || "");
      }
    } else {
      setSubject("");
    }
  }, [replyingTo, chats, messages]);

  /*useEffect(() => {
    if (replyingTo?.usedContact) {
      const channel = replyingTo.usedContact.channel_name?.toLowerCase();
      const contactsList = contacts[channel] || [];

      // Ищем точное совпадение контакта
      const contactIndex = contactsList.findIndex((c) => {
        switch (channel) {
          case "telegram":
            return c.content === replyingTo.usedContact.user_id;
          case "email":
            return c.content === replyingTo.usedContact.email;
          case "whatsapp":
          case "phone":
            return c.content === replyingTo.usedContact.phone;
          default:
            return false;
        }
      });

      if (contactIndex === -1) return;

      const displayName =
        contactsList.length > 1 ? `${channel} ${contactIndex + 1}` : channel;

      setSelectedTab(displayName);
    }
  }, [replyingTo, contacts, dispatch]); */

  {
    /*useEffect(() => {
    if (replyingTo?.usedContact) {
      const channel = replyingTo.usedContact.channel_name?.toLowerCase();
      const targetValue = {
        telegram: replyingTo.usedContact.user_id,
        email: replyingTo.usedContact.email,
        whatsapp: replyingTo.usedContact.phone,
        phone: replyingTo.usedContact.phone,
      }[channel];

      const contactGroup = contacts[channel] || [];

      // Находим индекс по точному совпадению
      const contactIndex = contactGroup.findIndex(
        (c) => c.content === targetValue
      );

      const displayName =
        contactIndex >= 0
          ? contactGroup.length > 1
            ? `${channel} ${contactIndex + 1}`
            : channel
          : channel;

      setSelectedTab(displayName);
    }
  }, [replyingTo, contacts]);*/
  }
  useEffect(() => {
    if (replyingTo?.usedContact) {
      const channel = replyingTo.usedContact.channel_name?.toLowerCase();
      const targetValue = {
        telegram:
          replyingTo.usedContact.user_id || replyingTo.usedContact.user_name,
        email: replyingTo.usedContact.email,
        whatsapp: replyingTo.usedContact.phone,
        phone: replyingTo.usedContact.phone,
      }[channel];

      const contactGroup = contacts[channel] || [];
      const contactIndex = contactGroup.findIndex(
        (c) => c.content === targetValue
      );

      const displayName =
        contactIndex >= 0
          ? contactGroup.length > 1
            ? `${channel} ${contactIndex + 1}`
            : channel
          : channel;

      setSelectedTab(displayName);
    }
  }, [replyingTo, contacts]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsAttaching(true);
      setAttachmentProgress(0);
      setUploadStatus("");

      const interval = setInterval(() => {
        setAttachmentProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setAttachmentProgress(100);
        setIsAttaching(false);
        setFile(selectedFile);
        setUploadStatus(`Файл ${selectedFile.name} успешно загружен!`);
      }, 2000);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateMessenger() || (!message.trim() && !file) || !selectedChat)
      return;

    // Clear form state
    setMessage("");
    setSubject("");
    setFile(null);
    dispatch(setReplyingTo(null));

    try {
      // Parse contact type and index from selectedTab
      const parts = selectedTab.split(" ");
      const contactType = parts[0].toLowerCase();
      const contactIndex = parts.length > 1 ? parseInt(parts[1], 10) : 1;

      // Get contact group and validate
      const contactGroup = contacts[contactType];
      if (!contactGroup || contactGroup.length < contactIndex) {
        throw new Error(`Invalid contact: ${selectedTab}`);
      }

      // Get actual contact info
      const contactInfo = contactGroup[contactIndex - 1].content;

      // Prepare used_contact payload
      let usedContact;
      switch (contactType) {
        case "email":
          usedContact = { email: contactInfo, channel_name: "email" };
          break;
        case "phone":
        case "whatsapp":
          usedContact = { phone: contactInfo, channel_name: contactType };
          break;
        case "telegram":
          usedContact = {
            user_id: contactInfo,
            user_name: contactInfo,
            channel_name: "telegram",
          };
          break;
        default:
          throw new Error(`Unsupported contact type: ${contactType}`);
      }

      // Prepare message data
      const messageData = {
        candidate_chat: selectedChat.id,
        text: message,
        "subject-tema": subject || undefined,
        file: file || null,
        used_contact: JSON.stringify(usedContact),
        reply_on_message: "",
      };

      // Add reply metadata if needed
      if (replyingTo) {
        messageData.reply_on_message = JSON.stringify({
          id: replyingTo.id,
          text: replyingTo.text,
          channel_name: replyingTo.messanger,
        });
      }

      // Dispatch message creation
      await dispatch(createMessage(messageData)).unwrap();
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`Ошибка отправки: ${error}`);
    }
  };

  // ... остальной рендеринг

  const hasContent = !!message.trim() || !!file;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white mt-1 rounded overflow-hidden"
    >
      {replyingTo && (
        <div className="bg-[#F1F5F9] hover:bg-gray-200 p-2 flex justify-between items-start">
          <div className="flex">
            <div className="ml-0 relative">
              <ReplyToIcon />
              <div className="absolute top-5 bottom-0 left-2.5 border-l border-[#4766FF]" />
            </div>
            <div className="text-sm ml-2 text-[#4766FF]">
              Ответ на сообщение через {replyingTo.messanger}
              <div className="text-black">
                {replyingTo.author.name}: {replyingTo.text.substring(0, 50)}...
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(setReplyingTo(null))}
            className="mr-1 mt-1"
          >
            <ChatInputCrossIcon />
          </button>
        </div>
      )}

      <div className="border-[#9E6D2D] border rounded">
        <ul className="flex pl-1 space-x-4 mb-1 rounded bg-[#FCF8EC]">
          {Object.entries(contacts)
            .filter(([_, group]) => group.length > 0)
            .flatMap(([contactType, contactGroup]) =>
              contactGroup.map((contact, index) => {
                const displayName =
                  contactGroup.length > 1
                    ? `${contactType} ${index + 1}`
                    : contactType;

                return {
                  type: contactType,
                  contact,
                  displayName,
                  index,
                  // Добавляем уникальный идентификатор
                  uniqueKey: `${contactType}-${contact.content}`,
                };
              })
            )
            .map(({ type, displayName, contact, index, uniqueKey }) => (
              <li
                key={uniqueKey}
                className={clsx(
                  "py-2 px-1 text-sm rounded-md cursor-pointer",
                  selectedTab?.toLowerCase() === displayName.toLowerCase()
                    ? "underline text-[#B67E34]"
                    : "text-[#858B97]"
                )}
              >
                {/*{Object.entries(contacts)
            .filter(([_, group]) => group.length > 0)
            .flatMap(([contactType, contactGroup]) =>
              contactGroup.map((contact, index) => {
                const displayName =
                  contactGroup.length > 1
                    ? `${contactType} ${index + 1}`
                    : contactType;

                return {
                  type: contactType,
                  contact,
                  displayName,
                  index,
                };
              })
            )
            .map(({ type, displayName, contact, index }) => (
              <li
                key={`${type}-${index}`}
                className={clsx(
                  "py-2 px-1 text-sm rounded-md cursor-pointer",
                  selectedTab?.replace(/\s/g, "").toLowerCase() ===
                    displayName.replace(/\s/g, "").toLowerCase()
                    ? "underline text-[#B67E34]"
                    : "text-[#858B97]"
                )}
              >
                {/*<li
                key={`${type}-${index}`}
                className={clsx(
                  "py-2 px-1 text-sm rounded-md cursor-pointer",
                  selectedTab === displayName
                    ? "underline text-[#B67E34]"
                    : "text-[#858B97]"
                )}
              >*/}

                <Popover
                  open={openPopover === displayName}
                  handler={setOpenPopover}
                  placement="top"
                >
                  <PopoverHandler
                    onMouseEnter={() => setOpenPopover(displayName)}
                    onMouseLeave={() => setOpenPopover(null)}
                    onClick={() => {
                      if (
                        replyingTo &&
                        !displayName.startsWith(replyingTo.messanger)
                      ) {
                        dispatch(setReplyingTo(null));
                      }
                      setSelectedTab(displayName);
                    }}
                  >
                    <span>{displayName}</span>
                  </PopoverHandler>
                  <PopoverContent className="z-50 p-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={getIconSrc(type)}
                        alt={type}
                        width={18}
                        height={18}
                      />
                      <span className="text-sm">{contact.content}</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            ))}
        </ul>

        {/*{selectedTab.toLowerCase() === "email" &&
          contacts.email?.length > 0 && (
            <div className="flex flex-row items-center">
              <div className="pl-2 text-[15px]">Тема:</div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Не задано"
                className="w-full p-2 text-[15px] rounded-md focus:outline-none"
                readOnly={!!replyingTo}
              />
            </div>
          )} */}
        {selectedTab?.toLowerCase().startsWith("email") &&
          contacts.email?.length > 0 && (
            <div className="flex flex-row items-center">
              <div className="pl-2 text-[15px]">Тема:</div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Не задано"
                className="w-full p-2 text-[15px] rounded-md focus:outline-none"
                readOnly={!!replyingTo}
              />
            </div>
          )}

        <div className="mb-0 mt-0">
          <TextareaAutosize
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите текст сообщения"
            className="w-full m-0 py-0 px-2 text-[15px] resize-none h-10 focus:outline-none"
            minRows={1}
            maxRows={10}
          />
        </div>

        {isAttaching && (
          <div className="pr-2 mb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon />
                <span className="ml-2 text-[#939393] text-[13px]">
                  Attaching file...
                </span>
              </div>
            </div>
            <LinearProgress
              variant="determinate"
              value={attachmentProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  backgroundColor: "#3b82f6",
                },
              }}
            />
            <p>{uploadStatus}</p>
          </div>
        )}

        {file && !isAttaching && (
          <div className="pr-0 mb-1">
            <div className="text-[13px] text-[#858585] pl-2">
              Прикрепленные файлы
            </div>
            <div className="flex items-center justify-between p-1 pr-2 rounded">
              <div className="flex items-center">
                <FileIcon className="w-4 h-4" />
                <span className="ml-2 text-sm">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button onClick={() => setFile(null)} className="text-[#9E6D2D]">
                <FileAttachmentCloseIcon />
              </button>
            </div>
          </div>
        )}

        <div className="flex px-2 items-center mt-0 pt-0">
          <label className="cursor-pointer flex items-center">
            <FileAttachIcon />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              key={file ? "file-selected" : "no-file"}
            />
            <span className="ml-2 text-[#939393] text-[13px]">
              Прикрепить файл
            </span>
          </label>
          <button type="submit" className="ml-auto" disabled={!hasContent}>
            {hasContent ? <ArrowSendEnabled /> : <ArrowSendDisabled />}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
