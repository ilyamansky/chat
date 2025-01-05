"use client";
import React, { useContext, useState } from "react";
import Select from "react-select";
import { ChatContext } from "../chatState";
import CrossIconFilter from "../ui/icons/CrossIconFilter";

// Опции для селекторов
const clientOptions = [
  { value: "sberbank", label: "Сбер" },
  { value: "alfabank", label: "Альфа Банк" },
  { value: "tbank", label: "Т-банк" },
  { value: "vtb", label: "ВТБ Банк" },
  { value: "rosbank", label: "Росбанк" },
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
    <form className="space-y-4">
      <div className="flex flex-row justify-between mt-2">
        <div className="text-custom-gray-dark text-[15px] align-top font-medium">
          Фильтры
        </div>
        <button className="text-custom-gray-dark m-0 p-0" onClick={onClose}>
          <CrossIconFilter />
        </button>
      </div>
      <div>
        <div className="text-[13px] text-custom-gray-filter">
          Фильтрация по клиентам
        </div>
        <Select
          isMulti
          options={clientOptions}
          value={state.selectedFilters.clients}
          onChange={handleFilterChange("clients")}
          placeholder="Все по умолчанию"
          isClearable={false}
          styles={{
            multiValue: (provided) => ({
              ...provided,
              display: "flex",
              alignItems: "left",
              backgroundColor: "#e5e7eb", // Tailwind gray-200
              borderRadius: "0.375rem", // Tailwind rounded
              padding: "0.25rem",
              marginRight: "0.25rem",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              marginRight: "0.5rem",
              color: "gray",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              cursor: "pointer",
              color: "gray", // Tailwind red-600
            }),
            control: (provided, state) => ({
              ...provided,
              outline: "none",
              border: "none",
              boxShadow: state.isFocused ? "none" : "none",
              borderColor: state.isFocused ? "transparent" : "inherit",
              ":focus": {
                outline: "none",
                boxShadow: "none",
                border: "none",
              },
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              display: "none", // Убираем крестик
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
          }}
        />
      </div>

      <div>
        <div className="text-[13px] text-custom-gray-filter">
          Фильтрация по вакансиям
        </div>
        <Select
          isMulti
          options={vacancyOptions}
          value={state.selectedFilters.vacancies}
          onChange={handleFilterChange("vacancies")}
          placeholder="Активные по умолчанию"
          isClearable={false}
          styles={{
            control: (provided, state) => ({
              ...provided,
              outline: "none",
              border: "none",
              boxShadow: state.isFocused ? "none" : "none",
              borderColor: state.isFocused ? "transparent" : "inherit",
              ":focus": {
                outline: "none",
                boxShadow: "none",
                border: "none",
              },
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              backgroundColor: "#e5e7eb", // Tailwind gray-200
              borderRadius: "0.375rem", // Tailwind rounded
              padding: "0.25rem",
              marginRight: "0.25rem",
              fontSize: "15px",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              marginRight: "0.5rem",
              color: "gray",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              cursor: "pointer",
              color: "gray", // Tailwind red-600
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              display: "none", // Убираем крестик
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
          }}
        />
      </div>

      <div>
        <div className="text-[13px] text-custom-gray-filter">
          Фильтрация по рекрутерам
        </div>
        <Select
          isMulti
          options={recruiterOptions}
          value={state.selectedFilters.recruiters}
          onChange={handleFilterChange("recruiters")}
          placeholder=" "
          isClearable={false}
          styles={{
            control: (provided, state) => ({
              ...provided,
              outline: "none",
              border: "none",
              boxShadow: state.isFocused ? "none" : "none",
              borderColor: state.isFocused ? "transparent" : "inherit",
              ":focus": {
                outline: "none",
                boxShadow: "none",
                border: "none",
              },
            }),
            multiValue: (provided) => ({
              ...provided,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              backgroundColor: "#e5e7eb", // Tailwind gray-200
              borderRadius: "0.375rem", // Tailwind rounded
              padding: "0.25rem",
              marginRight: "0.25rem",
              color: "gray",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              marginRight: "0.5rem",
              color: "gray",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              cursor: "pointer",
              color: "gray", // Tailwind red-600
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              display: "none", // Убираем крестик
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
          }}
        />
      </div>

      <div className="flex flex-col">
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
