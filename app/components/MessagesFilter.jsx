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
      <div className="text-custom-gray-dark text-[15px] font-medium">
        {data.label}
      </div>
      <div>{isSelected && <TickIconFilter />}</div>
    </div>
  );
};

export default function MessagesFilter({ onClose }) {
  return (
    <div className="flex flex-row justify-between w-[608px] border p-4 rounded-lg">
      <div className="flex flex-row gap-2 pb-4">
        <div>
          <FilterIcon />
        </div>
        <div className="flex flex-col w-[524px]">
          <p className="font-semibold text-sm text-custom-gray-dark mb-2">
            Фильтры
          </p>
          <div className="mb-4">
            <div className="text-[13px] text-custom-gray-filter mb-1">
              Фильтрация по авторам сообщений
            </div>
            <Select
              isMulti
              options={nameOptions}
              //value={state.selectedFilters.clients}
              //onChange={handleFilterChange("clients")}
              placeholder="Введите имя автора"
              isClearable={false}
              closeMenuOnSelect={false}
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
              options={clientOptions}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option, MultiValueRemove }}
              styles={customSelectStyles}
              placeholder="Введите название канала"
              isClearable={false}
            />
          </div>
          <hr className="my-4" />
          <div className="space-x-2">
            <button
              //onClick={applyFiltersHandler}
              //type="submit"
              className="px-4 py-2 bg-custom-gray-filter-dark text-sm text-white rounded"
            >
              Применить фильтры
            </button>
            <button
              type="button"
              //onClick={resetFilters}
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
