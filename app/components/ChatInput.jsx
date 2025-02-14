import { useState, useEffect } from "react";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import { LinearProgress } from "@mui/material";
import FileIcon from "../ui/icons/FileIcon";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, setReplyingTo } from "../redux/chatSlice";
import { getIconSrc } from "../utils/functions";
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

    if (!message.trim() || !selectedChat) return;

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
          className="bg-[#F1F5F9] p-2 flex justify-between items-center"
        >
          <div className="text-sm text-[#4766FF]">
            Ответ на: "{replyingTo.messanger}"
            <div>
              {replyingTo.text.length > 80
                ? replyingTo.text.substring(0, 77) + "..."
                : replyingTo.text}
            </div>
          </div>

          <button
            onClick={() => dispatch(setReplyingTo(null))}
            className="text-red-500 hover:text-red-700"
          >
            ×
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
          <div className="pr-2 mb-1">
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        {/* File attachment and submit section */}
        <div className="flex px-2 items-center mt-0 pt-0">
          <label className="cursor-pointer flex items-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.2934 7.36669L8.1667 13.4934C7.41613 14.2439 6.39815 14.6656 5.3367 14.6656C4.27524 14.6656 3.25726 14.2439 2.5067 13.4934C1.75613 12.7428 1.33447 11.7248 1.33447 10.6634C1.33447 9.6019 1.75613 8.58392 2.5067 7.83336L8.22003 2.12002C8.72041 1.61876 9.39941 1.33681 10.1077 1.33618C10.8159 1.33556 11.4954 1.61631 11.9967 2.11669C12.498 2.61706 12.7799 3.29607 12.7805 4.00433C12.7812 4.71259 12.5004 5.3921 12 5.89336L6.27336 11.6067C6.02318 11.8569 5.68385 11.9974 5.33003 11.9974C4.97621 11.9974 4.63688 11.8569 4.3867 11.6067C4.13651 11.3565 3.99596 11.0172 3.99596 10.6634C3.99596 10.3095 4.13651 9.97021 4.3867 9.72002L10.0467 4.06669"
                stroke="#939393"
                strokeWidth="0.666667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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

          <button type="submit" className="ml-auto px-2 pb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.47606 2.032C2.4161 2.00273 2.34871 1.99221 2.28268 2.0018C2.21665 2.01139 2.15505 2.04066 2.10589 2.08578C2.05674 2.1309 2.02233 2.18979 2.00713 2.25476C1.99194 2.31973 1.99668 2.38777 2.02072 2.45L3.91606 7.53467C4.02784 7.83482 4.02784 8.16518 3.91606 8.46534L2.02139 13.55C1.99747 13.6122 1.99279 13.6801 2.00798 13.7449C2.02316 13.8098 2.0575 13.8686 2.10654 13.9137C2.15557 13.9587 2.21703 13.988 2.28293 13.9977C2.34883 14.0074 2.41612 13.9971 2.47606 13.968L14.4761 8.30134C14.5331 8.27434 14.5814 8.23169 14.6152 8.17834C14.6489 8.12499 14.6669 8.06315 14.6669 8C14.6669 7.93686 14.6489 7.87502 14.6152 7.82167C14.5814 7.76832 14.5331 7.72567 14.4761 7.69867L2.47606 2.032Z"
                stroke="#D8D8D8"
                strokeWidth="0.666667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8H14.6667"
                stroke="#D8D8D8"
                strokeWidth="0.666667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
