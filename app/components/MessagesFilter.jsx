import CrossIconFilter from "../ui/icons/CrossIconFilter";
import FilterIcon from "../ui/icons/FilterIcon";
import Select from "react-select";

export default function MessagesFilter({ onClose }) {
  return (
    <div className="flex flex-row justify-between w-[608px] border p-4 rounded-lg">
      <div className="flex flex-row gap-2 pb-4">
        <div>
          <FilterIcon />
        </div>
        <div className="flex flex-col">
          <p>Фильтры</p>
          <div>
            <div className="text-[13px] text-custom-gray-filter">
              Фильтрация по авторам сообщений
            </div>
            <Select
              isMulti
              //options={clientOptions}
              //value={state.selectedFilters.clients}
              //onChange={handleFilterChange("clients")}
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
              Фильтрация по каналу
            </div>
            <Select
              isMulti
              //options={clientOptions}
              //value={state.selectedFilters.clients}
              //onChange={handleFilterChange("clients")}
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
          <div className="">
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
              className="px-4 py-2 mt-2 text-sm text-custom-gray-filter-light border border-custom-gray-filter-light rounded"
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
