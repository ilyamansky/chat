import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import UserImage from "../../public/contactIcons/UserImage.png";
import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import PhoneIcon from "../../public/contactIcons/PhoneIcon.png";
import WhatsAppIcon from "../../public/contactIcons/WhatsappIcon.png";
import CrossIcon from "../ui/icons/CrossIcon";
import Select from "react-select";
import TickIcon from "../ui/icons/TickIcon";
import CrossIconButton from "../ui/icons/CrossIconButton";
import CrossIconContacts from "../ui/icons/CrossIconContacts";
import clsx from "clsx";
import { getIconSrc } from "../utils/functions";
import {
  addContact,
  removeContact,
  updateContactsAPI,
} from "../redux/chatSlice";

const parseContacts = (contactsInput) => {
  try {
    // Parse input if it's a string
    let parsedContacts;
    if (typeof contactsInput === "string") {
      parsedContacts = JSON.parse(contactsInput);
    } else if (typeof contactsInput === "object") {
      parsedContacts = contactsInput;
    } else {
      return {};
    }

    return Object.entries(parsedContacts).reduce(
      (result, [contactType, contactsList]) => {
        result[contactType] = contactsList?.map((contact) => {
          // Extract proper value based on contact type
          let content;
          switch (contactType) {
            case "phone":
              content = contact.phone;
              break;
            case "email":
              content = contact.email;
              break;
            case "whatsapp":
              content = contact.phone;
              break;
            case "telegram":
              content = contact.phone || contact.user_id;
              break;
            default:
              content = "";
          }

          return {
            content: content.toString(), // Ensure string output
            isPrimary: false,
          };
        });

        return result;
      },
      {}
    );
  } catch (error) {
    console.error("Error parsing contacts:", error);
    return {};
  }
};

export default function ChatDetails() {
  const dispatch = useDispatch();
  const { chats, selectedChat: selectedChatState } = useSelector(
    (state) => state.chat
  );

  const selectedChat = chats?.find((chat) => chat.id === selectedChatState?.id);
  const rawContacts = selectedChat?.contacts || {};
  const contacts = parseContacts(rawContacts);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  if (!contacts) return null;

  const handleAddClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const convertToBackendFormat = (contacts) => {
    return Object.entries(contacts).reduce((acc, [type, items]) => {
      acc[type] = items.map((item) => {
        switch (type) {
          case "phone":
          case "whatsapp":
            return { phone: item.content, channel_name: type };
          case "email":
            return { email: item.content, channel_name: type };
          case "telegram":
            return { user_id: item.content, channel_name: type };
          default:
            return { [type]: item.content, channel_name: type };
        }
      });
      return acc;
    }, {});
  };

  const handleAddContact = async () => {
    if (!selectedChat || !selectedOption || !inputValue) return;

    try {
      // 1. Получить текущие контакты
      const currentContacts = contacts;

      const typeKey = selectedOption.value.toLowerCase();

      // 2. Создать обновленные контакты
      const updatedContacts = {
        ...currentContacts,
        [typeKey]: [
          ...(currentContacts[typeKey] || []),
          { content: inputValue, isPrimary: false },
        ],
      };

      // 3. Отправить на сервер
      const { payload } = await dispatch(
        updateContactsAPI({
          candidateId: selectedChat.id,
          contacts: convertToBackendFormat(updatedContacts),
        })
      ).unwrap();

      // 4. Обновить UI
      dispatch({
        type: "chat/updateContactsFromServer",
        payload: {
          chatId: selectedChat.id,
          contacts: payload?.contacts,
        },
      });

      setSelectedOption(null);
      setInputValue("");
      handleClose();
    } catch (error) {
      alert("Ошибка добавления:", error);
    }
  };

  const handleRemoveContact = async (contactType, contactIndex) => {
    if (!selectedChat) return;

    try {
      // 1. Получить текущие контакты из Redux
      const currentContacts = contacts;

      // 2. Создать обновленные контакты (без лишних копий)
      const updatedContacts = {
        ...currentContacts,
        [contactType]: currentContacts[contactType].filter(
          (_, idx) => idx !== contactIndex
        ),
      };

      // 3. Отправить сразу на сервер
      const { payload } = await dispatch(
        updateContactsAPI({
          candidateId: selectedChat.id,
          contacts: convertToBackendFormat(updatedContacts),
        })
      ).unwrap();

      // 4. Обновить UI через Redux только после успешного ответа
      dispatch({
        type: "chat/updateContactsFromServer",
        payload: {
          chatId: selectedChat.id,
          contacts: payload?.contacts,
        },
      });
    } catch (error) {
      alert("Ошибка удаления:", error);
    }
  };

  if (!selectedChat) return null;

  const optionsSelect = [
    { value: "phone", icon: PhoneIcon.src },
    { value: "email", icon: MailIcon.src },
    { value: "telegram", icon: TgIcon.src },
    { value: "whatsapp", icon: WhatsAppIcon.src },
  ];

  const Option = (props) => {
    const { innerProps, data } = props;
    return (
      <div
        {...innerProps}
        className={clsx(
          "flex items-center justify-center py-4 hover:bg-gray-100 transition-colors",
          {
            "bg-gray-100": props.isFocused,
            "bg-gray-200": props.isSelected,
            "opacity-50 cursor-not-allowed": props.isDisabled,
          }
        )}
        style={{
          backgroundImage: `url(${data.icon})`,
          backgroundSize: "20px 20px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    );
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "30px",
      minHeight: "30px",
      width: "48px",
      minWidth: "48px",
      margin: 0,
      padding: 0,
      ":focus": { outline: "none" },
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
      padding: 0,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "2px",
      color: "gray",
      svg: { width: "12px", height: "12px" },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (provided) => ({
      ...provided,
      width: "48px",
      minWidth: "48px",
    }),
    option: (provided, state) => ({
      ...provided,
      width: "100%",
      padding: "4px 8px",
      backgroundColor: state.isFocused ? "#f3f4f6" : provided.backgroundColor,
      ":active": { backgroundColor: "#e5e7eb" },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      backgroundImage: `url(${state.data.icon})`,
      backgroundSize: "18px 18px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left center",
      paddingLeft: "25px",
      minHeight: "20px",
      overflow: "visible",
    }),
  };

  return (
    <div className="w-[300px]  min-w-[300px] border-l pt-2 overflow-y-auto">
      <nav className="flex flex-row h-[30px] py-1 px-4 items-center border-b">
        {/*<p className="hover:bg-gray-50 py-1 text-sm text-custom-text-gray px-1">
          Вакансия
        </p>*/}
        <p className="hover:bg-gray-50 text-sm text-custom-blue border-b border-custom-blue px-1 py-1">
          Кандидат
        </p>
        {/*<p className="text-sm py-1 px-1 hover:bg-gray-50 text-custom-text-gray">
          Календарь
        </p>
        <p className="text-sm text-custom-text-gray px-2">...</p>*/}
      </nav>

      <div className="flex flex-col px-4 mt-2 mb-2">
        <Image
          src={UserImage}
          alt="аватар пользователя"
          width={98}
          height={98}
        />
        <p className="mt-2">{selectedChat.name}</p>
      </div>

      <p className="mt-2 text-sm px-4">Способы связи</p>

      <div className="mt-2 px-2">
        <ul>
          {Object.entries(contacts).map(
            ([contactType, contactGroup]) =>
              Array.isArray(contactGroup) &&
              contactGroup.map((contact, index) => (
                <li
                  key={`${contactType}-${index}`}
                  className="flex justify-between items-center px-2 hover:bg-gray-50 py-2 rounded"
                >
                  <div className="flex flex-row gap-2">
                    <Image
                      src={getIconSrc(contactType)}
                      alt={contactType}
                      width={18}
                      height={18}
                    />
                    <p className="text-sm text-custom-gray-dark">
                      {contact.content}
                    </p>
                  </div>
                  <div className="flex flex-row items-center">
                    {contact.isPrimary && (
                      <p className="text-[13px] text-[#B0B0B0] mr-2">
                        (основной)
                      </p>
                    )}
                    <div
                      onClick={() => handleRemoveContact(contactType, index)}
                    >
                      <CrossIconContacts />
                    </div>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>

      {isOpen ? (
        <div className="flex flex-row gap-2 mx-4 mt-4">
          <div>
            <Select
              isSearchable={false}
              options={optionsSelect}
              components={{ Option }}
              placeholder=""
              styles={customStyles}
              value={selectedOption}
              onChange={setSelectedOption}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Не задано"
              className="h-[30px] w-[140px] pl-1 text-custom-gray-dark border border-[#E3E3E3] outline-none rounded"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button className="hover:bg-gray-50" onClick={handleAddContact}>
            <TickIcon />
          </button>
          <button className="hover:bg-gray-50" onClick={handleClose}>
            <CrossIconButton />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddClick}
          className="border mx-4 border-[#CACACA] hover:bg-gray-50  text-custom-gray-details mt-4 py-[2px] px-2 rounded"
        >
          Добавить
        </button>
      )}
    </div>
  );
}
