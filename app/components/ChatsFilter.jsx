"use client";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import {
  setFilters,
  applyFilters,
  resetFilters,
  toggleIsOpen,
  fetchFilteredChats,
  fetchCompanies,
  fetchVacancies,
  fetchUsers, // Import Redux actions
} from "../redux/chatSlice"; // Import Redux actions
import CrossIconFilter from "../ui/icons/CrossIconFilter";
import CrossIconSelect from "../ui/icons/CrossIconSelect";
import { customSelectStyles } from "../ui/selectStyles";
import TickIconFilter from "../ui/icons/TickIconFilter";
import clsx from "clsx";
import CustomScrollbar from "../ui/CustomScrollbar";
import MenuList from "../ui/MenuList";

// Options for selectors
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
  { value: "zovulkina", label: "Зовулькина Дарья" },
  { value: "nemov", label: "Михаил Немов" },
];

const MultiValueRemove = (props) => {
  return (
    <div className="m-0 p-0" {...props.innerProps}>
      <div className="m-0 p-0 overflow-hidden">
        <CrossIconSelect />
      </div>
    </div>
  );
};

const CustomControl = ({ children, ...props }) => (
  <components.Control {...props}>
    {/* Only show the input, not the selected values */}
    {props.selectProps.inputProps.children}
    {children}
  </components.Control>
);

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
  const dispatch = useDispatch();
  const { selectedFilters } = useSelector((state) => state.chat); // Access Redux state

  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState([]); // State for selected values

  const handleFilterChange = (filterType) => (selectedOptions) => {
    dispatch(setFilters({ [filterType]: selectedOptions || [] })); // Use Redux action
  };

  const filterRef1 = useRef(null);

  {
    /*const loadCompanies = async (inputValue) => {
    const { payload } = await dispatch(fetchCompanies());
    console.log(payload, "payload");
    return payload
      .map((company) => ({
        value: company.customerid,
        label: company.name,
        description: company.description,
      }))
      .filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  };*/
  }
  const loadCompanies = async (inputValue) => {
    try {
      // Fetch companies from API
      const { payload } = await dispatch(fetchCompanies());
      console.log(payload, "CompaniesPaylod");

      // Check if payload contains clients array
      if (!payload?.clients) return [];

      // Transform API response to react-select options
      return payload.clients.map((company) => ({
        value: company.customerId, // Note the capital D in customerId
        label: company.name,
        description: company.description || "", // Handle null descriptions
        // Add additional fields if needed:
        region: company.region?.name,
        contacts: company.contacts,
      }));
      //.filter(company =>
      //company.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      //(company.description && company.description.toLowerCase().includes(inputValue.toLowerCase()))
    } catch (error) {
      console.error("Error loading companies:", error);
      return [];
    }
  };

  {
    /*const loadVacancies = async (inputValue) => {
    console.log(inputValue);
    const selectedCompanies = selectedFilters.clients.map((c) => c.value);
    if (selectedCompanies.length === 0) return [];

    const { payload } = await dispatch(fetchVacancies(selectedCompanies));
    console.log(payload[0].items, "payloadVacancies");
    const x = payload[0].items
      .map((vacancy) => ({
        value: vacancy.id,
        label: vacancy.name,
      }))
      .filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
    console.log(x, "x");
  };*/
  }
  {
    /*const loadVacancies = async (inputValue) => {
    const selectedCompanies = selectedFilters.clients.map((c) => c.value);
    if (selectedCompanies.length === 0) return [];

    try {
      const { payload } = await dispatch(fetchVacancies(selectedCompanies));

      // Handle API response structure
      if (!payload || !payload[0]?.items) return [];

      return payload[0].items
        .filter(
          (vacancy) =>
            vacancy.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            selectedCompanies.includes(vacancy.customerId)
        )
        .map((vacancy) => ({
          value: vacancy.jobId, // Using jobId instead of id based on response
          label: vacancy.name,
          customerId: vacancy.customerId,
          description: vacancy.description,
        }));
    } catch (error) {
      console.error("Error loading vacancies:", error);
      return [];
    }
  };*/
  }
  const loadVacancies = async (inputValue) => {
    const selectedCompanies = selectedFilters.clients.map((c) => c.value);
    if (selectedCompanies.length === 0) return [];

    try {
      const { payload } = await dispatch(fetchVacancies(selectedCompanies));

      if (!payload || !payload[0]?.items) return [];

      // Show all vacancies when input is empty, filter when typing
      const searchTerm = inputValue.toLowerCase();
      return payload[0].items
        .filter(
          (vacancy) =>
            !searchTerm || vacancy.name.toLowerCase().includes(searchTerm)
        )
        .map((vacancy) => ({
          value: vacancy.jobId,
          label: vacancy.name,
          description: vacancy.description,
        }));
    } catch (error) {
      console.error("Error loading vacancies:", error);
      return [];
    }
  };

  const loadRecruiters = async (inputValue) => {
    const { payload } = await dispatch(fetchUsers());
    return payload
      .map((user) => ({
        value: user.id,
        label: user.name,
      }))
      .filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
  };

  {
    /*useEffect(() => {
    //dispatch(fetchClients());
    dispatch(fetchUsers()).then((result) => {
      console.log(result);
      if (result.meta.requestStatus === "fulfilled") {
        console.log("Users data:", result.payload);
      }
    });
  }, [dispatch]); */
  }

  {
    /*useEffect(() => {
    const loadInitialVacancies = async () => {
      const selectedCompanyIds = selectedFilters.clients.map((c) => c.value);
      if (selectedCompanyIds.length > 0) {
        await dispatch(fetchVacancies(selectedCompanyIds));
      }
    };
    loadInitialVacancies();
  }, [selectedFilters.clients, dispatch]);*/
  }
  useEffect(() => {
    const loadVacanciesForSelectedCompanies = async () => {
      const selectedCompanyIds = selectedFilters.clients.map((c) => c.value);
      if (selectedCompanyIds.length > 0) {
        await dispatch(fetchVacancies(selectedCompanyIds));
      }
    };

    loadVacanciesForSelectedCompanies();
  }, [selectedFilters.clients, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterButton1 = document.querySelector(".filter-toggle-button1");
      if (
        filterRef1.current &&
        !filterRef1.current.contains(event.target) &&
        !filterButton1.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const currentCompanyIds = selectedFilters.clients.map((c) => c.value);
    const filteredVacancies = selectedFilters.vacancies.filter((v) =>
      currentCompanyIds.includes(v.customerId)
    );

    if (filteredVacancies.length !== selectedFilters.vacancies.length) {
      dispatch(setFilters({ vacancies: filteredVacancies }));
    }
  }, [selectedFilters.clients, dispatch]);

  //const applyFiltersHandler = (e) => {
  //e.preventDefault();
  //dispatch(applyFilters()); // Use Redux action
  //onClose();
  //dispatch(
  {
    /*applyFilters({
        clients: selectedFilters.clients.map((option) => option.value),
        vacancies: selectedFilters.vacancies.map((option) => option.value),
        recruiters: selectedFilters.recruiters.map((option) => option.value),
      })*/
  }

  // ); // Use Redux action
  //};
  {
    /*const applyFiltersHandler = (e) => {
    e.preventDefault();
    const { clients, vacancies, recruiters } = selectedFilters;

    const filters = {
      employerIds: clients.map((c) => c.value),
      vacancyIds: vacancies.map((v) => v.value),
      userIds: recruiters.map((r) => r.value),
    };
    console.log(applyFilters(filters));

    dispatch(fetchFilteredChats(filters));
    onClose();
  };*/
  }

  const applyFiltersHandler = (e) => {
    e.preventDefault();
    dispatch(applyFilters()); // Dispatch the async thunk
    onClose();
  };

  const handleRemoveValue = (removedValue) => {
    setValue(value.filter((v) => v.value !== removedValue.value)); // Remove value from array
  };

  const resetFiltersHandler = () => {
    dispatch(resetFilters()); // Use Redux action
    onClose();
  };

  const setIsOpenFilter = (e) => {
    e.preventDefault();
    dispatch(toggleIsOpen()); // Use Redux action
  };

  return (
    <form ref={filterRef1} className="space-y-2 flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <div className="text-custom-gray-dark text-[15px] font-semibold">
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
            className="w-full min-h-10 flex flex-wrap p-1 rounded bg-white border border-[#E3E3E3] hover:border-[#94A3B8]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen((prev) => {
                // Close immediately if already open
                if (prev) return false;
                // Open and load companies only when opening
                dispatch(fetchCompanies());
                (prev) => !prev;
                return true;
              });
            }}
          >
            {selectedFilters.clients.length > 0 ? (
              selectedFilters.clients.map((client) => (
                <div
                  key={client.value}
                  className="flex items-center m-1 px-2 py-1 bg-gray-100 rounded text-sm text-[#64748B]"
                >
                  {client.label}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(
                        setFilters({
                          clients: selectedFilters.clients.filter(
                            (c) => c.value !== client.value
                          ),
                        })
                      );
                      //setIsOpen(false);
                    }}
                    className="ml-2 text-[#94A3B8] hover:text-[#64748B]"
                  >
                    ×
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[#CACACA] pl-1">Все по умолчанию</span>
            )}
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1">
              <AsyncSelect
                autoFocus
                isMulti
                defaultOptions
                loadOptions={loadCompanies}
                value={selectedFilters.clients}
                onChange={(selected) => {
                  dispatch(setFilters({ clients: selected || [] }));
                  setIsOpen(false);
                }}
                //onMenuClose={() => setIsOpen(false)}
                menuIsOpen={true}
                components={{
                  //Control: CustomControl,
                  Option,
                  MenuList,
                  MultiValue: () => null,
                  DropdownIndicator: null,
                  IndicatorSeparator: null,
                }}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "1px solid #94A3B8",
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    marginTop: 0,
                    borderRadius: "6px",
                    border: "1px solid #94A3B8",
                  }),
                  input: (provided) => ({
                    ...provided,
                    padding: "8px",
                    color: "#64748B",
                  }),
                }}
                placeholder="Поиск компаний..."
              />
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="text-[13px] mb-1 text-custom-gray-filter">
          Фильтрация по вакансиям
        </div>
        {/*<Select
          isMulti
          options={vacancyOptions}
          value={selectedFilters.vacancies}
          onChange={handleFilterChange("vacancies")}
          placeholder="Активные по умолчанию"
          isClearable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option, MultiValueRemove, MenuList }}
          styles={customSelectStyles}
        />*/}
        <AsyncSelect
          key={selectedFilters.clients.map((c) => c.value).join(",")}
          isMulti
          cacheOptions
          defaultOptions={true} // This is crucial for initial load
          loadOptions={loadVacancies}
          value={selectedFilters.vacancies}
          onChange={handleFilterChange("vacancies")}
          placeholder="Активные по умолчанию"
          components={{ Option, MultiValueRemove, MenuList }}
          styles={customSelectStyles}
          noOptionsMessage={({ inputValue }) =>
            selectedFilters.clients.length
              ? inputValue
                ? "Нет совпадений"
                : "Нет вакансий"
              : "Сначала выберите компанию"
          }
          onMenuOpen={() => {
            // Trigger load when menu opens
            if (selectedFilters.clients.length > 0) {
              dispatch(
                fetchVacancies(selectedFilters.clients.map((c) => c.value))
              );
            }
          }}
        />
      </div>

      <div>
        <div className="text-[13px] mb-1 text-custom-gray-filter">
          Фильтрация по рекрутерам
        </div>
        {/*<Select
          isMulti
          options={recruiterOptions}
          value={selectedFilters.recruiters}
          onChange={handleFilterChange("recruiters")}
          placeholder=" "
          isClearable={false}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option, MultiValueRemove, MenuList }}
          styles={customSelectStyles}
        />*/}
        <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={loadRecruiters}
          value={selectedFilters.recruiters}
          onChange={handleFilterChange("recruiters")}
          placeholder="Все рекрутеры"
          components={{ Option, MultiValueRemove, MenuList }}
          styles={customSelectStyles}
        />
      </div>

      <hr className="my-4" />

      <div className="flex flex-col items-start">
        <button
          onClick={applyFiltersHandler}
          //onClick={onClose}
          className="px-4 py-2 bg-custom-gray-filter-dark text-sm border border-custom-gray-filter-dark text-white rounded"
        >
          Применить фильтры
        </button>
        <button
          type="button"
          onClick={resetFiltersHandler}
          className="px-4 py-2 mt-2 text-sm text-custom-gray-filter-light border border-custom-gray-filter-light rounded"
        >
          Сбросить фильтры
        </button>
      </div>
    </form>
  );
};

export default ChatsFilter;
