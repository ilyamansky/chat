import { useContext } from "react";
import { ChatContext } from "../chatState";
import Image from "next/image";
import UserImage from "../../public/contactIcons/UserImage.png";
import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import PhoneIcon from "../../public/contactIcons/PhoneIcon.png";
import WhatsAppIcon from "../../public/contactIcons/WhatsAppIcon.png";
import CrossIcon from "../ui/icons/CrossIcon";
import Select from "react-select";
import TickIcon from "../ui/icons/TickIcon";
import CrossIconButton from "../ui/icons/CrossIconButton";
import CrossIconContacts from "../ui/icons/CrossIconContacts";

export default function ChatDetails() {
  const { state } = useContext(ChatContext);
  const selectedChat = state.selectedChat;
  const contacts = state.selectedChat?.contacts;

  if (!selectedChat) return null;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "20px",
      width: "70px",
      margin: 0,
      padding: 0,
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      border: state.isFocused ? "none" : provided.border,
      ":focus": {
        outline: "none",
        boxShadow: "none",
        border: "none",
      },
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
    }),
  };

  const optionsSelect = [
    {
      value: "phone",
      //label: "Телефон",
      icon: PhoneIcon.src,
    },
    {
      value: "email",
      //label: "email",
      icon: MailIcon.src,
    },
    {
      value: "telegram",
      //label: "email",
      icon: TgIcon.src,
    },
    {
      value: "whatsapp",
      //label: "email",
      icon: WhatsAppIcon.src,
    },
  ];

  const Option = ({ data }) => (
    <div className="flex items-center gap-2 w-[50px]">
      <img src={data.icon} alt={data.label} width={16} height={16} />
      {data.label}
    </div>
  );

  const SingleValue = ({ data, ...props }) => (
    <components.SingleValue {...props}>
      <img src={data.icon} alt="j" width={18} height={18} />
    </components.SingleValue>
  );

  const components = {
    Option,
    SingleValue,
  };

  return (
    <div className="w-[300px] border-l px-[6px] overflow-y-auto">
      <nav className="flex flex-row h-[30px] py-1 items-center border-b">
        <p className="text-sm text-custom-blue border-b border-custom-blue py-1">
          Вакансия
        </p>
        <p className="text-sm text-custom-text-gray px-2">Кандидат</p>
        <p className="text-sm text-custom-text-gray">Календарь</p>
        <p className="text-sm text-custom-text-gray px-2">...</p>
      </nav>
      <div className="flex flex-row justify-between mt-2">
        <p className="text-[18px]">Информация о чате</p>
        <button>
          <CrossIcon />
        </button>
      </div>
      <div className="flex flex-col mt-2 mb-2">
        <Image
          src={UserImage}
          alt="аватар пользователя"
          width={98}
          height={98}
        />
        <p className="mt-2">{selectedChat.name}</p>
      </div>
      <p className="mt-2 text-sm">Способы связи</p>
      <div className="mt-2">
        <ul className="space-y-4">
          {Object.entries(contacts).map(([key, value]) => {
            if (!value) return null;
            let iconSrc;
            switch (key) {
              case "email":
                iconSrc = MailIcon.src; // Путь к иконке email
                break;
              case "phone":
                iconSrc = PhoneIcon.src; // Путь к иконке телефона
                break;
              case "telegram":
                iconSrc = TgIcon.src; // Путь к иконке Telegram
                break;
              case "whatsapp":
                iconSrc = WhatsAppIcon.src; // Путь к иконке WhatsApp
                break;
              default:
                iconSrc = MailIcon.src; // Путь к иконке по умолчанию
            }
            return (
              <li key={key} className="flex justify-between">
                <div className="flex flex-row gap-2">
                  <Image src={iconSrc} alt={key} width={18} height={18} />
                  <p className="text-sm text-custom-gray-dark">{value}</p>
                </div>
                <CrossIconContacts />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <div className="">
          <Select
            options={optionsSelect}
            components={components}
            placeholder=""
            styles={customStyles}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="не задано"
            className="h-[30px] w-[140px] border-custom-gray-details outline-none rounded"
          />
        </div>
        <TickIcon />
        <CrossIconButton />
      </div>
      <button className="border flex text-custom-gray-details mt-2 p-[2px] rounded">
        Добавить
      </button>
    </div>
  );
}
