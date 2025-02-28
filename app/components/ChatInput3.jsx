import { useState, useEffect } from "react";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import { LinearProgress } from "@mui/material";
import FileIcon from "../ui/icons/FileIcon";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setReplyingTo } from "../redux/chatSlice";
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

const ChatInput = () => {
  const dispatch = useDispatch();
  //const { selectedChat } = useSelector((state) => state.chat);
  //const contacts = selectedChat?.contacts || {};
  const {
    chats,
    selectedChat: selectedChatState,
    messages,
  } = useSelector((state) => state.chat);
  const selectedChat = chats.find((chat) => chat.id === selectedChatState?.id);
  const contacts = selectedChat?.contacts;
  const chatMessages = messages[selectedChat?.id] || [];
  //const messanger = chatMessages[id];
  //console.log(messanger, "messanger");
  console.log("messages", messages);
  const { replyingTo } = useSelector((state) => state.chat);
  const [selectedTab, setSelectedTab] = useState("Email");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const [isAttaching, setIsAttaching] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [openPopover, setOpenPopover] = useState(null);

  const validateMessenger = () => {
    if (!selectedChat) return false;

    // Extract base contact type without number
    const baseType = selectedTab.replace(/\s\d+$/, "");
    const hasContacts = contacts[baseType]?.length > 0;

    if (!hasContacts) {
      alert(
        `Нет доступных контактов для ${baseType}. Добавьте контакт сначала!`
      );
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (replyingTo) {
      const originalMessenger = replyingTo.messanger;
      const isValid = selectedChat?.contacts[originalMessenger]?.length > 0;

      if (!isValid) {
        alert("Контакт для ответа был удален!");
        dispatch(setReplyingTo(null));
        return;
      }

      setSelectedTab(
        originalMessenger.charAt(0).toUpperCase() + originalMessenger.slice(1)
      );
    }
  }, [replyingTo, selectedChat]);

  useEffect(() => {
    if (replyingTo && !selectedTab.startsWith(replyingTo.messanger)) {
      dispatch(setReplyingTo(null));
    }
  }, [selectedTab]);

  useEffect(() => {
    if (replyingTo) {
      // Find original message in all chats
      const originalMessage = chats
        .flatMap((chat) => messages[chat.id] || [])
        .find((msg) => msg.id === replyingTo.id);

      if (originalMessage?.messanger === "Email") {
        setSubject(originalMessage.subject?.replace("Тема: ", "") || "");
      }
    } else {
      setSubject(""); // Reset subject when reply is canceled
    }
  }, [replyingTo, chats, messages]);

  useEffect(() => {
    if (replyingTo) {
      const originalMessage = chats
        .flatMap((chat) => chatMessages[chat.id] || [])
        .find((msg) => msg.id === replyingTo.id);

      if (originalMessage) {
        setSelectedTab(
          originalMessage.messanger.charAt(0).toUpperCase() +
            originalMessage.messanger.slice(1)
        );
      }
    }
  }, [replyingTo]);

  const handleOpen = (contactType) => {
    setOpenPopover(contactType);
  };

  const hasContent = !!message.trim() || !!file;

  // In ChatInput.js - Update file handling
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsAttaching(true);
      setAttachmentProgress(0);
      setUploadStatus("");

      // Simulate upload progress
      const interval = setInterval(() => {
        setAttachmentProgress((prev) => {
          if (prev >= 95) {
            // Stop at 95% for realistic simulation
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Complete simulation after 2 seconds
      setTimeout(() => {
        clearInterval(interval);
        setAttachmentProgress(100);
        setIsAttaching(false);
        setFile(selectedFile); // This was missing - actually set the file
        setUploadStatus(`Файл ${selectedFile.name} успешно загружен!`);
      }, 2000);
    }
  };

  // In ChatInput.js - modify handleSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateMessenger()) return;

    //if (!message.trim() || !selectedChat) return;
    if ((!message.trim() && !file) || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      subject:
        selectedTab === "Email" && subject
          ? `Тема: ${subject}`
          : "Тема не задана",
      text: message,
      //selectedTab === "Email" && subject
      //? `Тема: ${subject}\n${message}`
      //: message,
      replyTo: replyingTo?.id,
      sender: "Дарья Зовулькина",
      timestamp: new Date().toISOString(),
      isUnread: false,
      senderRole: "recruiter",
      //messanger: selectedTab,
      messanger: selectedTab.replace(/\s\d+$/, ""), // Store base type without number
      // Add file metadata
      attachments: file
        ? [
            {
              name: file.name,
              size: file.size,
              type: file.type,
              preview: URL.createObjectURL(file), // Create preview URL
            },
          ]
        : [],
    };

    dispatch(
      addMessage({
        chatId: selectedChat.id,
        message: newMessage,
      })
    );

    setMessage("");
    setSubject("");
    setFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white mt-1 rounded overflow-hidden "
    >
      {replyingTo && (
        <div
          onClick={() => {
            const messageElement = document.getElementById(
              `message-${replyingTo.id}`
            );
            if (messageElement) {
              messageElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
          className="bg-[#F1F5F9] hover:bg-gray-200 p-2  flex justify-between items-start"
        >
          {" "}
          <div className="flex">
            <div className="ml-0 relative">
              <ReplyToIcon />
              <div className="absolute  top-5 bottom-0 left-2.5 border-l border-[#4766FF]" />
            </div>

            <div className="text-sm ml-2 text-[#4766FF]">
              Ответ на: "{replyingTo.messanger}"
              <div className="text-black">
                {replyingTo.text.length > 80
                  ? replyingTo.text.substring(0, 77) + "..."
                  : replyingTo.text}
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(setReplyingTo(null))}
            className="text-red-500 hover:text-red-700"
          >
            {" "}
            <div className="mr-1 mt-1">
              <ChatInputCrossIcon />
            </div>
          </button>
        </div>
      )}
      {/* Contact tabs */}
      <div className="border-[#9E6D2D] border rounded">
        <ul className="flex pl-1 space-x-4 mb-1 rounded  bg-[#FCF8EC]">
          {Object.entries(contacts)
            .filter(([_, group]) => group.length > 0)
            .flatMap(([contactType, contactGroup]) =>
              contactGroup.map((contact, index) => ({
                type: contactType,
                contact,
                displayName:
                  contactGroup.length > 1
                    ? `${contactType} ${index + 1}`
                    : contactType,
              }))
            )
            .map(({ type, displayName, contact }) => (
              <li
                key={`${type}-${contact.content}`}
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
                  dismiss={{ enabled: false }} // Disable auto-dismiss
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
                      <span>{contact.content}</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            ))}
        </ul>
        {/* Email subject field */}
        {selectedTab === "Email" && contacts.Email?.length > 0 && (
          <div className="flex flex-row items-center">
            <div className="pl-2 text-[15px]">Тема:</div>
            <div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Не задано"
                className="w-full p-2 text-[15px] rounded-md focus:outline-none"
                readOnly={replyingTo?.messanger === "Email"} // Add readOnly for replies
              />
            </div>
          </div>
        )}
        {/* Message input */}
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
        {/* File upload status */}
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
        {/* Attached file display */}
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
        {/* File attachment and submit section */}
        <div className="flex px-2 items-center mt-0 pt-0">
          <label className="cursor-pointer flex items-center">
            <FileAttachIcon />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              key={file ? "file-selected" : "no-file"} // Force re-render
            />
            <span className="ml-2 text-[#939393] text-[13px]">
              Прикрепить файл
            </span>
          </label>

          <button type="submit" className="ml-auto" disabled={!hasContent}>
            {hasContent ? (
              <ArrowSendEnabled className="text-white hover:text-black" />
            ) : (
              <ArrowSendDisabled />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
