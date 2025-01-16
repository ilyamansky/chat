"use client";
import React, { useContext, useState } from "react";
import Select from "react-select";
import { ChatContext } from "../chatState";
import CrossIconFilter from "../ui/icons/CrossIconFilter";
import CrossIconSelect from "../ui/icons/CrossIconSelect";
import { customSelectStyles } from "../ui/selectStyles";
import TickIconFilter from "../ui/icons/TickIconFilter";
import clsx from "clsx";

// Опции для селекторов
const clientOptions = [
  {
    value: "sberbank",
    label: "Сбер",
    description: "Крупнейший банк России, отделения по всей стране",
  },
  {
    value: "alfabank",
    label: "Альфа Банк",
    description: "Топ 6 банков Росии по собственному капиталу",
  },
  {
    value: "tbank",
    label: "Т-банк",
    description: "Мы - инновационная финтех компания Росиии",
  },
  {
    value: "vtb",
    label: "ВТБ Банк",
    description: "Крупнейший банк России, отделения по всей стране",
  },
  {
    value: "rosbank",
    label: "Росбанк",
    description: "Крупнейший банк России, отделения по всей стране",
  },
];

const vacancyOptions = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "devOps", label: "Devops" },
  { value: "seniorFrontend", label: "Senior Frontender" },
  { value: "juniorBackend", label: "Junior Backender" },
  { value: "intern", label: "intern" },
];

const recruiterOptions = [
  { value: "ivanov", label: "Иванов И.И." },
  { value: "petrov", label: "Петров П.П." },
  { value: "you", label: "Вы" },
];

const MultiValueRemove = (props) => {
  return (
    <div className="m-0 p-0" {...props.innerProps}>
      <div className=" m-0 p-0 overflow-hidden">
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
      <div className="text-custom-gray-dark text-[15px] font-medium overflow-hidden">
        {data.label}
        {data.description && (
          <div className="truncate text-[13px] overflow-hidden whitespace-nowrap text-ellipsis">
            {data.description}
          </div>
        )}
      </div>
      <div>{isSelected && <TickIconFilter />}</div>
    </div>
  );
};

const ChatsFilter = ({ onClose }) => {
  const { state, dispatch } = useContext(ChatContext);
  const handleFilterChange = (filterType) => (selectedOptions) => {
    dispatch({
      type: "SET_FILTERS",
      payload: {
        [filterType]: selectedOptions || [],
      },
    });
  };
  const applyFiltersHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: "APPLY_FILTERS",
      payload: {
        clients: state.selectedFilters.clients.map((option) => option.value), // Получаем значения
        vacancies: state.selectedFilters.vacancies.map(
          (option) => option.value
        ), // Получаем значения
        recruiters: state.selectedFilters.recruiters.map(
          (option) => option.value
        ), // Получаем значения
      },
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState([]); // Состояние для хранения выбранных значений

  const handleRemoveValue = (removedValue) => {
    setValue(value.filter((v) => v.value !== removedValue.value)); // Удаляем значение из массива
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const setIsOpenFilter = (e) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_IS_OPEN" });
  };

  return (
    <form className="space-y-2 flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <div className="text-custom-gray-dark text-[15px]  font-semibold">
          Фильтры
        </div>
        <button className="text-custom-gray-dark" onClick={onClose}>
          <CrossIconFilter />
        </button>
      </div>
      <div>
        <div className="text-[13px] mb-1 text-custom-gray-filter">
          Фильтрация по клиентам
        </div>
        <div className="relative w-full">
          <button
            className="w-full m-h-10 flex flex-wrap p-1 rounded bg-white border"
            onClick={(e) => {
              e.preventDefault(), setIsOpen((prev) => !prev);
            }}
          >
            {value.length > 0 ? (
              value.map((v) => (
                <div
                  key={v.value}
                  className="flex flex-row overflow-hidden flex-start ml-1 my-1  items-center text-[#64748B] text-[13px] border border-[#94A3B8] rounded"
                >
                  <div className="p-[2px] px-1">{v.label}</div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Останавливаем всплытие события, чтобы не закрыть меню
                      handleRemoveValue(v);
                    }}
                    className="cursor-pointer border-l border-[#94A3B8] py-[2px] bg-[#f9f9f9]"
                  >
                    <CrossIconSelect />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-left pl-1 py-1 text-[#CACACA] text-[15px]">
                Все по умолчанию
              </div>
            )}
          </button>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute w-full mt-1 z-20">
                <Select
                  isMulti
                  autoFocus
                  menuIsOpen
                  options={clientOptions}
                  value={value}
                  controlShouldRenderValue={false}
                  //value={state.selectedFilters.clients}
                  //onChange={handleFilterChange("clients")}
                  placeholder="Поиск по названию или клиенту"
                  isClearable={false}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option, MultiValueRemove }}
                  isSearchable={true}
                  onChange={(selectedOptions) => {
                    setValue(selectedOptions); // Сохраняем массив выбранных значений
                    setIsOpen(false);
                  }}
                  styles={{
                    ...customSelectStyles, // Расширяем существующие стили
                    control: (provided, state) => ({
                      ...provided,
                      marginTop: 0, // Устраняем верхний отступ
                      borderRadius: 0, // Устраняем скругление углов
                      outline: "none",
                      border: "custom-bg-gray",
                      boxShadow: "none",
                      backgroundColor: "white",

                      borderColor: state.isFocused ? "inherit" : "inherit",
                      "&:hover": {
                        //backgroundColor: state.hasValue ? "white" : "gray-300", // Изменение фона при наведении курсора
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      borderTop: "none",
                      marginTop: 0, // Устраняем верхний отступ
                      borderRadius: 0, // Устраняем скругление углов
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="text-[13px] mb-1 text-custom-gray-filter">
          Фильтрация по вакансиям
        </div>
        <Select
          isMulti
          options={vacancyOptions}
          value={state.selectedFilters.vacancies}
          onChange={handleFilterChange("vacancies")}
          placeholder="Активные по умолчанию"
          isClearable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option, MultiValueRemove }}
          styles={customSelectStyles}
        />
      </div>

      <div>
        <div className="text-[13px] mb-1 text-custom-gray-filter">
          Фильтрация по рекрутерам
        </div>
        <Select
          isMulti
          options={recruiterOptions}
          value={state.selectedFilters.recruiters}
          onChange={handleFilterChange("recruiters")}
          placeholder=" "
          isClearable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option, MultiValueRemove }}
          styles={customSelectStyles}
        />
      </div>

      <hr className="my-4" />

      <div className="flex flex-col items-start">
        <button
          onClick={applyFiltersHandler}
          //type="submit"
          className="px-4 py-2 bg-custom-gray-filter-dark text-sm text-white rounded"
        >
          Применить фильтры
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="px-4 py-2 mt-2 text-sm text-custom-gray-filter-light border border-custom-gray-filter-light rounded"
        >
          Сбросить фильтры
        </button>
      </div>
    </form>
  );
};

export default ChatsFilter;
