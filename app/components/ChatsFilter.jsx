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
    <div {...props.innerProps}>
      <div className="p-1">
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

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  return (
    <form className="space-y-2">
      <div className="flex flex-row justify-between mt-2">
        <div className="text-custom-gray-dark text-[15px] align-top font-semibold">
          Фильтры
        </div>
        <button className="text-custom-gray-dark m-0 p-0" onClick={onClose}>
          <CrossIconFilter />
        </button>
      </div>
      <div>
        <div className="text-[13px] mb-1 text-custom-gray-filter">
          Фильтрация по клиентам
        </div>
        <Select
          isMulti
          options={clientOptions}
          value={state.selectedFilters.clients}
          onChange={handleFilterChange("clients")}
          placeholder="Все по умолчанию"
          isClearable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option, MultiValueRemove }}
          styles={customSelectStyles}
        />
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
