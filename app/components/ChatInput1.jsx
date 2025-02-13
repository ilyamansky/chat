import { useState } from "react";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import { LinearProgress } from "@mui/material"; // You can use any progress bar library
import FileIcon from "../ui/icons/FileIcon";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import { getIconSrc } from "../utils/functions";
import Image from "next/image";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

const ChatInput = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const { chats, selectedChat: selectedChatState } = useSelector(
    (state) => state.chat
  );
  const selectedChat = chats.find((chat) => chat.id === selectedChatState?.id);
  const contacts = selectedChat?.contacts;
  const [selectedTab, setSelectedTab] = useState("Email");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const [isAttaching, setIsAttaching] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [openPopover, setOpenPopover] = useState(null);
  const handleOpen = (contactType) => {
    setOpenPopover(contactType);
  };

  {
    /*const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsAttaching(true);
      setAttachmentProgress(0);

      // Simulate file attachment process (e.g., reading the file, validating it, etc.)
      const interval = setInterval(() => {
        setAttachmentProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setIsAttaching(false);
            setFile(selectedFile); // Attach the file to the form
            return 100;
          }
          return prevProgress + 10;
        });
      }, 100); // Adjust the interval for faster/slower progress
    }
  };*/
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsAttaching(true);
      setAttachmentProgress(0);
      setUploadStatus(""); // Сбрасываем статус перед новой загрузкой

      const reader = new FileReader();
      reader.onload = () => {
        setFile(reader.result);
        setIsAttaching(false);
        setAttachmentProgress(100);
        setUploadStatus(`Файл ${selectedFile.name} успешно загружен!`);
      };

      reader.onerror = () => {
        setIsAttaching(false);
        setUploadStatus(`Ошибка при загрузке файла ${selectedFile.name}.`);
      };

      // Отслеживание прогресса чтения файла
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setAttachmentProgress(percentComplete);
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };
  // Отправка формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("message", message);
    formData.append("subject", subject);
    if (file) {
      formData.append("file", file);
    }

    try {
      // Send the form data to the server
      const response = await fetch("/api/send-message", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Form submitted successfully!");
        // Reset the form
        setMessage("");
        setSubject("");
        setFile(null);
      } else {
        console.error("Form submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded shadow-md overflow-hidden border-[#9E6D2D]"
    >
      {/* Первый блок: табы */}
      {/*<div className="flex pl-1 space-x-4 mb-1 bg-[#FCF8EC]">
        {contacts.map((tab) => (
          <button
            key={tab}
            type="button" // Prevent form submission
            className={clsx(
              "py-2 px-1 text-sm rounded-md",
              selectedTab === tab
                ? "underline text-[#B67E34]"
                : "text-[#858B97]"
            )}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>*/}

      <ul className="flex pl-1 space-x-4 mb-1 bg-[#FCF8EC]">
        {Object.entries(contacts)
          .filter(([_, group]) => group.length > 0)
          .map(([contactType, contactGroup]) => (
            <li
              key={contactType}
              className={clsx(
                "py-2 px-1 text-sm rounded-md cursor-pointer",
                selectedTab === contactType
                  ? "underline text-[#B67E34]"
                  : "text-[#858B97]"
              )}
            >
              <Popover
                open={openPopover === contactType}
                handler={setOpenPopover}
                placement="top"
                dismiss={{ ancestorScroll: true }}
              >
                <PopoverHandler
                  onMouseEnter={() => handleOpen(contactType)}
                  onMouseLeave={() => setOpenPopover(null)}
                  onClick={() => setSelectedTab(contactType)}
                >
                  <span>{contactType}</span>
                </PopoverHandler>
                <PopoverContent
                  className="z-50 min-w-[200px] p-2"
                  onMouseEnter={() => handleOpen(contactType)}
                  onMouseLeave={() => setOpenPopover(null)}
                >
                  <div className="flex flex-col gap-1">
                    {contactGroup.map((contact, index) => (
                      <div
                        key={`${contactType}-${index}`}
                        className={clsx(
                          "p-1 text-sm",
                          contact.isPrimary ? "font-medium" : "text-gray-600"
                        )}
                      >
                        {contact.content}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </li>
          ))}
      </ul>

      {selectedTab === "Email" && (
        <div className="flex flex-row items-center">
          <div className="pl-2">Тема:</div>
          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Не задано"
              className="w-full p-2 rounded-md focus:outline-none"
            />
          </div>
        </div>
      )}
      <div className="mb-0 mt-0">
        <TextareaAutosize
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите текст сообщения"
          className="w-full m-0 py-0 px-2 text-[15px] resize-none h-10 focus:outline-none"
        />
      </div>

      {/* Третий блок: иконка прикрепления файла и кнопки */}
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

          <input type="file" onChange={handleFileChange} className="hidden" />

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

      {/* Display file name, size, and progress bar */}
      {isAttaching && (
        <div className="px-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon />
              <span className="ml-2 text-[#939393] text-[13px]">
                Attaching file...
              </span>
            </div>
          </div>
          <LinearProgress variant="determinate" value={attachmentProgress} />
          {/* Сообщение о статусе загрузки */}
          <p>{uploadStatus}</p>
        </div>
      )}

      {file && !isAttaching && (
        <div className="px-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon />
              <span className="ml-2 text-[#939393] text-[13px]">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <button onClick={() => setFile(null)} className="text-red-500">
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
    </form>
  );
};

export default ChatInput;

<div className="flex flex-row gap-2">
  <Image
    src={getIconSrc(contactType)}
    alt={contactType}
    width={18}
    height={18}
  />
  <p className="text-sm text-custom-gray-dark">{contact.content}</p>
</div>;

<div className="mr-4">
  {message.messenger === "telegram" && (
    <Image src={TgIcon} alt="Telegram Icon" style={{ width: 24 }} />
  )}
  {message.messenger === "whatsapp" && (
    <Image src={WhatsappIcon} alt="WhatsApp Icon" style={{ width: 24 }} />
  )}
  {message.messenger === "phone" && (
    <Image src={PhoneIcon} alt="Phone Icon" style={{ width: 24 }} />
  )}
  {message.messenger === "email" && (
    <Image src={MailIcon} alt="Mail Icon" style={{ width: 24 }} />
  )}
</div>;
