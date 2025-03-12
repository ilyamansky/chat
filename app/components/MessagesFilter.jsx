import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  setFilters,
  applyFilters,
  resetFilters,
  setMessageFilters,
  resetMessageFilters,
} from "../redux/chatSlice"; // Import Redux actions
import CrossIconFilter from "../ui/icons/CrossIconFilter";
import FilterIcon from "../ui/icons/FilterIcon";
import Select from "react-select";
import { customSelectStyles } from "../ui/selectStyles";
import TickIconFilter from "../ui/icons/TickIconFilter";
import CrossIconSelect from "../ui/icons/CrossIconSelect";
import clsx from "clsx";

const clientOptions = [
  {
    value: "telegram",
    label: "Telegram",
  },
  {
    value: "email",
    label: "Email",
  },
  { value: "whatsapp", label: "Whatsapp" },
];

const nameOptions = [
  { value: "semenov", label: "Сергей Семенов" },
  { value: "zosulkina", label: "Дарья Зосулькина" },
  { value: "ivanov", label: "Иван Иванов" },
  { value: "petrov", label: "Петр Петров" },
];

const MultiValueRemove = (props) => {
  return (
    <div {...props.innerProps}>
      <div className="overflow-hidden">
        <CrossIconSelect />
      </div>
    </div>
  );
};

const Option = (props) => {
  const { innerProps, isDisabled, isFocused, isSelected, data } = props;

  return (
    <div
      className={clsx("flex justify-between my-2 p-2 hover:opacity-70", {
        "bg-custom-bg-gray": isSelected,
      })}
      {...innerProps}
    >
      <div className="text-custom-gray-dark text-[15px] font-medium">
        {data.label}
      </div>
      <div>{isSelected && <TickIconFilter />}</div>
    </div>
  );
};

export default function MessagesFilter({ onClose }) {
  const dispatch = useDispatch();
  //const { selectedFilters } = useSelector((state) => state.chat); // Access Redux state
  const { messageFilters, selectedChat, messages } = useSelector(
    (state) => state.chat
  );
  const channelOptions = useSelector((state) => state.chat.knownChannels);

  const handleFilterChange = (filterType) => (selectedOptions) => {
    dispatch(setFilters({ [filterType]: selectedOptions || [] })); // Use Redux action
  };

  const handleApply = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleReset = () => {
    dispatch(resetMessageFilters());
    onClose();
  };

  const handleChannelChange = (selectedChannels) => {
    dispatch(setMessageFilters({ channels: selectedChannels }));
  };

  const handleAuthorChange = (selectedAuthors) => {
    dispatch(setMessageFilters({ authors: selectedAuthors }));
  };

  // Get unique authors from current chat's messages
  const authorOptions = useMemo(() => {
    if (!selectedChat?.id || !messages[selectedChat.id]) return [];

    const uniqueAuthors = new Map();

    messages[selectedChat.id].forEach((message) => {
      if (message.author?.id) {
        uniqueAuthors.set(message.author.id, {
          value: message.author.id,
          label: `${message.author.name} (${message.author.role})`,
        });
      }
    });

    return Array.from(uniqueAuthors.values());
  }, [selectedChat?.id, messages]);

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterButton = document.querySelector(".filter-toggle-button");
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !filterButton.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  {
    /*const applyFiltersHandler = (e) => {
    e.preventDefault();
    dispatch(
      applyFilters({
        authors: selectedFilters.authors?.map((option) => option.value) || [],
        channels: selectedFilters.channels?.map((option) => option.value) || [],
      })
    ); // Use Redux action
  };

  const resetFiltersHandler = () => {
    dispatch(resetFilters()); // Use Redux action
  }; */
  }

  return (
    <div ref={filterRef} className="flex flex-row justify-between  p-4">
      <div className="flex w-full  flex-row gap-2 pb-4">
        <div>
          <FilterIcon />
        </div>
        <div className="flex  w-full flex-col">
          <p className="font-semibold w-full text-sm text-custom-gray-dark mb-2">
            Фильтры
          </p>
          <div className="mb-4 w-full">
            <div className="text-[13px] w-full text-custom-gray-filter mb-1">
              Фильтрация по авторам сообщений
            </div>
            <Select
              isMulti
              options={authorOptions}
              value={messageFilters.authors}
              //onChange={handleFilterChange("authors")}
              //onChange={(selected) =>
              //dispatch(setMessageFilters({ authors: selected }))
              //}
              onChange={handleAuthorChange}
              placeholder="Введите имя автора"
              isClearable={false}
              //closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option, MultiValueRemove }}
              styles={customSelectStyles}
            />
          </div>
          <div>
            <div className="text-[13px] text-custom-gray-filter mb-1">
              Фильтрация по каналу
            </div>
            <Select
              isMulti
              options={channelOptions}
              value={messageFilters.channels}
              //onChange={handleFilterChange("channels")}
              //onChange={(selected) =>
              //dispatch(setMessageFilters({ channels: selected }))
              //}
              onChange={handleChannelChange}
              placeholder="Введите название канала"
              isClearable={false}
              //closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option, MultiValueRemove }}
              styles={customSelectStyles}
            />
          </div>
          <hr className="my-4" />
          <div className="space-x-2">
            <button
              //onClick={handleApply}
              onClick={onClose}
              className="px-4 py-2 bg-custom-gray-filter-dark text-sm border border-custom-gray-filter-dark text-white rounded"
            >
              Применить фильтры
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm text-custom-gray-filter-light border border-custom-gray-filter-light rounded"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      <div>
        <button onClick={onClose}>
          <CrossIconFilter />
        </button>
      </div>
    </div>
  );
}
