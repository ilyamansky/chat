import { useState } from "react";
import clsx from "clsx";

const ChatInput = () => {
  const [selectedTab, setSelectedTab] = useState("Email");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className=" bg-white border rounded shadow-md overflow-hidden border-[#9E6D2D]">
      {/* Первый блок: табы */}
      <div className="flex pl-1 space-x-4 mb-1 bg-[#FCF8EC]">
        {["Email", "Telegram", "WA", "SMS"].map((tab) => (
          <button
            key={tab}
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
      </div>

      {selectedTab === "Email" && (
        <div className="flex flex-row items-center">
          <div className="pl-2">Тема:</div>
          <div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Не задано"
              className=" w-full p-2 rounded-md focus:outline-none"
            />
          </div>
        </div>
      )}
      <div className="mb-0 mt-0">
        <textarea
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите текст сообщения"
          className="w-full m-0 py-0 px-2 text-[15px] resize-none h-10 focus:outline-none"
        />
      </div>

      {/* Третий блок: иконка прикрепления файла и кнопки */}
      <div className="flex px-2 items-center mt-0 pt-0">
        <label className="cursor-pointer">
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
            className="mt-0 hidden"
          />
        </label>
        <span className="ml-2 mt-0 pt-0 text-[#939393] text-[13px]">
          Прикрепить файл
        </span>
        <button className="ml-auto px-2 pb-2">
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
  );
};

export default ChatInput;
