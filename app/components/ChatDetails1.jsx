import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
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
import { addContact, removeContact } from "../redux/chatSlice"; // Import the new actions

export default function ChatDetails() {
  //const { selectedChat } = useSelector((state) => state.chat); // Access Redux state

  const dispatch = useDispatch(); // Initialize dispatch
  const { chats, selectedChat: selectedChatState } = useSelector(
    (state) => state.chat
  );
  const selectedChat = chats?.find((chat) => chat.id === selectedChatState?.id);
  const contacts = selectedChat?.contacts;
  console.log("new contacts", contacts);
  //const { contacts } = useSelector((state) => state.chat?.contacts);
  console.log("selectedChatFirsr", selectedChat);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (contacts) {
      console.log("Updated Contacts:", contacts);
    }
  }, [contacts]);

  const handleAddClick = () => {
    setIsOpen(true); // Show the Select block
  };

  const handleClose = () => {
    setIsOpen(false); // Hide the Select block
  };

  const handleAddContact = () => {
    if (selectedOption && inputValue) {
      const newContact = {
        content: inputValue,
        isPrimary: false,
      };
      console.log(newContact);
      console.log(contacts);
      console.log(selectedOption.value, "selected option value");
      console.log(inputValue, "input value");
      console.log(selectedChat.id, "selected chat id");
      dispatch(
        addContact({
          chatId: selectedChat.id,
          contactType: selectedOption.value,
          contact: newContact,
        }),
        console.log(contacts, "newcontactlist")
      );
      console.log(contacts, "contacts");
      setSelectedOption(null);
      setInputValue("");
      handleClose();
    }
  };

  const handleRemoveContact = (contactType, contactIndex) => {
    dispatch(
      removeContact({
        chatId: selectedChat.id,
        contactType,
        contactIndex,
      })
    );
    console.log(contacts, "contacts");
  };

  if (!contacts) return null;

  const optionsSelect = [
    {
      value: "SMS",
      icon: PhoneIcon.src,
      //label: "SMS",
    },
    {
      value: "Email",
      icon: MailIcon.src,
      //label: "Email",
    },
    {
      value: "Telegram",
      icon: TgIcon.src,
      //label: "Telegram",
    },
    {
      value: "WA",
      icon: WhatsAppIcon.src,
      //label: "WA",
    },
  ];

  const Option = (props) => {
    const { innerProps, isDisabled, isFocused, isSelected, data } = props;

    return (
      <div
        className={clsx(
          "flex items-center justify-center py-4 hover:bg-gray-100 transition-colors", // Center the icon and add hover effect
          {
            "bg-gray-100": isFocused, // Apply background color when focused
            "bg-gray-200": isSelected, // Apply background color when selected
            "opacity-50 cursor-not-allowed": isDisabled, // Disable interaction if the option is disabled
          }
        )}
        style={{
          backgroundImage: `url(${data.icon})`, // Set the background image dynamically
          backgroundSize: "20px 20px", // Adjust the size of the icon
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        {...innerProps}
      ></div>
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "30px",
      minHeight: "30px",
      width: "48px",
      minWidth: "48px",
      margin: 0,
      padding: 0,
      ":focus": {
        outline: "none",
      },
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
      svg: {
        width: "12px",
        height: "12px",
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
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
      ":active": {
        backgroundColor: "#e5e7eb",
      },
      "&:hover": {
        backgroundColor: "#f3f4f6",
        border: "1px solid #d1d5db",
      },
    }),
    singleValue: (provided, state) => {
      const icon = state.data.icon; // Access the icon from the selected option
      return {
        ...provided,
        display: "flex", // Ensure the container is a flexbox
        backgroundImage: `url(${icon})`,
        backgroundSize: "18px 18px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        paddingLeft: "25px", // Add padding to prevent text overlap
        minHeight: "20px", // Ensure the container has a minimum height
        overflow: "visible",
      };
    },
    placeholder: (provided) => ({
      ...provided,
    }),
  };

  return (
    <div className="w-[300px] border-l  pt-2 overflow-y-auto">
      <nav className="flex flex-row h-[30px] py-1 px-4 items-center border-b">
        <p className=" hover:bg-gray-50 py-1 text-sm text-custom-text-gray px-1">
          Вакансия
        </p>
        <p className=" hover:bg-gray-50  text-sm text-custom-blue border-b border-custom-blue px-1 py-1">
          Кандидат
        </p>
        <p className="text-sm py-1 px-1 hover:bg-gray-50 text-custom-text-gray">
          Календарь
        </p>
        <p className="text-sm text-custom-text-gray px-2">...</p>
      </nav>
      <div className="flex flex-row px-4 justify-between mt-2">
        <p className="text-[18px]">Информация о чате</p>
      </div>
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
        <ul className="">
          {Object.entries(contacts).map(([contactType, contactGroup]) =>
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
                    className=""
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
      {isOpen && (
        <div className="flex flex-row gap-2 mx-4 mt-4">
          <div className="">
            <Select
              isSearchable={false}
              options={optionsSelect}
              components={{
                Option,
              }}
              placeholder=""
              styles={customStyles}
              value={selectedOption}
              onChange={setSelectedOption}
            />
          </div>
          <div className="">
            <input
              type="text"
              placeholder="Hе задано"
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
      )}
      {!isOpen && (
        <button
          onClick={handleAddClick}
          className="border mx-4 border-[#CACACA] hover:bg-gray-50 flex text-custom-gray-details mt-4 py-[2px] px-2 rounded"
        >
          Добавить
        </button>
      )}
    </div>
  );
}
