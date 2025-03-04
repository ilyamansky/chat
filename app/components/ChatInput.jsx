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

        result[normalizedType] = contactsArray
          .map((contact) => {
            let content;
            switch (normalizedType) {
              case "phone":
              case "whatsapp":
                content = contact.phone;
                break;
              case "email":
                content = contact.email;
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

  useEffect(() => {
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
  }, [replyingTo, contacts, dispatch]);

  {
    /*useEffect(() => {
    if (replyingTo) {
      const messenger = replyingTo.messanger.toLowerCase();
      setSelectedTab(messenger.charAt(0).toUpperCase() + messenger.slice(1));
    }
  }, [replyingTo]);*/
  }

  {
    /*useEffect(() => {
    if (replyingTo && !selectedTab.startsWith(replyingTo.messanger)) {
      dispatch(setReplyingTo(null));
    }
  }, [selectedTab, dispatch, replyingTo]);*/
  }

  useEffect(() => {
    if (replyingTo) {
      const originalMessage = chats
        .flatMap((chat) => messages[chat.id] || [])
        .find((msg) => msg.id === replyingTo.id);

      if (originalMessage?.messanger === "Email") {
        setSubject(originalMessage.subject?.replace("Тема: ", "") || "");
      }
    } else {
      setSubject("");
    }
  }, [replyingTo, chats, messages]);

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

  // ChatInput.jsx
  // ... остальной код

  {
    /*const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateMessenger() || (!message.trim() && !file) || !selectedChat)
      return;

    try {
      // Формируем данные для отправки
      const messageData = {
        candidate_chat: selectedChat.id,
        text: message,
        "subject-tema": subject || "",
        file: file || null,
      };

      // Добавляем reply_on_message
      if (replyingTo) {
        messageData.reply_on_message = JSON.stringify({
          id: replyingTo.id,
          text: replyingTo.text,
          channel_name: replyingTo.messanger,
        });
      }

       Добавляем used_contact
      const [contactType] = selectedTab.split(" ");
      const contactGroup = contacts[contactType];
      const contactIndex = parseInt(selectedTab.match(/\d+$/)?.[0] || 1);
      const contact = contactGroup[contactIndex - 1]?.content;

      //messageData.used_contact = JSON.stringify({
        //channel_name: contactType.toLowerCase(),
        //contact:
         // typeof contact === "string"
           // ? contact
           // : contact?.user_id || contact?.user_name,
      //});
      messageData.contacts = {

      }

      // Отправляем через Redux
      await dispatch(createMessage(messageData)).unwrap();

      // Обновляем локальное состояние
      setMessage("");
      setSubject("");
      setFile(null);
      dispatch(setReplyingTo(null));
      dispatch(fetchChats()); // Обновляем список чатов

      alert("Сообщение успешно отправлено!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert(`Ошибка отправки сообщения: ${error}`);
    }
  }; */
  } // prev version

  {
    /*const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log(contacts[selectedTab], "Wooow");
    if (!validateMessenger() || (!message.trim() && !file) || !selectedChat)
      return;
    const typeofcontact = selectedTab;
    const index = Number([typeofcontact]);
    //const [contactType] = selectedTab; // Получаем тип (email, phone и т.д.)
    //const contactIndex = Number(selectedTab);
    //const contactGroup = selectedChat.contacts[contactType];
    //const contact = contactGroup?.[contactIndex];
    try {
      // Формируем контакты
      const getContactData = () => {
        if (!selectedTab || !selectedChat?.contacts) return null;

        const [contactType] = selectedTab; // Получаем тип (email, phone и т.д.)
        const contactIndex = Number(selectedTab);
        const contactGroup = selectedChat.contacts[contactType];
        const contact = contactGroup?.[contactIndex];

        if (!contact) return null;

        // Формируем объект согласно требованиям API
        switch (contactType.toLowerCase()) {
          case "email":
            return {
              email: contact.content,
              channel_name: "email",
            };

          case "phone":
            return {
              phone: contact.content,
              channel_name: "phone",
            };

          case "whatsapp":
            return {
              phone: contact.content,
              channel_name: "whatsapp",
            };

          case "telegram":
            return {
              user_id: contact.content, // Или user_name в зависимости от данных
              user_name: contact.content,
              channel_name: "telegram",
            };

          default:
            return null;
        }
      };

      // Формируем данные для отправки
      const messageData = {
        candidate_chat: selectedChat.id,
        text: message,
        "subject-tema": subject || undefined,
        file: file || null,
        reply_on_message: "",
        //used_contact: getContactData(), // Сериализуем контакт
      };

      messageData.used_contact = JSON.stringify({
        user_id: "5605060378",
        channel_name: "telegram",
      });

      // Добавляем reply_on_message
      if (replyingTo) {
        messageData.reply_on_message = JSON.stringify({
          id: replyingTo.id,
          text: replyingTo.text,
          channel_name: replyingTo.messanger,
        });
      }

      // Отправляем через Redux
      await dispatch(createMessage(messageData)).unwrap();

      // Обновляем локальное состояние
      setMessage("");
      setSubject("");
      setFile(null);
      //console.log("wooow", selectedTab);
      dispatch(setReplyingTo(null));
      dispatch(fetchChats());
    } catch (error) {
      console.log(index, "wooow", contacts[typeofcontact][0].content);
      console.error("Error sending message:", error);
      alert(`Ошибка отправки сообщения: ${error.message}`);
    }
  }; */
  }

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
      {/*} {replyingTo && (
        <div
          className="bg-[#F1F5F9] hover:bg-gray-200 p-2 flex justify-between items-start"
          onClick={() => {
            const messageElement = document.getElementById(
              `message-${replyingTo.id}`
            );
            messageElement?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        >
          <div className="flex">
            <div className="ml-0 relative">
              <ReplyToIcon />
              <div className="absolute top-5 bottom-0 left-2.5 border-l border-[#4766FF]" />
            </div>
            <div className="text-sm ml-2 text-[#4766FF]">
              Ответ на: "{replyingTo.messanger}"
              <div className="text-black">
                {replyingTo.text.length > 80
                  ? `${replyingTo.text.substring(0, 77)}...`
                  : replyingTo.text}
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
      )} */}
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
                };
              })
            )
            .map(({ type, displayName, contact, index }) => (
              <li
                key={`${type}-${index}`}
                className={clsx(
                  "py-2 px-1 text-sm rounded-md cursor-pointer",
                  selectedTab === displayName
                    ? "underline text-[#B67E34]"
                    : "text-[#858B97]"
                )}
              >
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
