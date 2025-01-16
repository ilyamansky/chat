import { useState } from "react";
import Select from "react-select";

const SearchableDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState([]); // Состояние для хранения выбранных значений

  const options = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    // ... добавьте больше штатов
  ];

  const handleRemoveValue = (removedValue) => {
    setValue(value.filter((v) => v.value !== removedValue.value)); // Удаляем значение из массива
  };

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border rounded-md flex flex-wrap items-center"
      >
        {value.length > 0
          ? value.map((v) => (
              <span key={v.value} className="flex items-center mr-2">
                {v.label}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Останавливаем всплытие события, чтобы не закрыть меню
                    handleRemoveValue(v);
                  }}
                  className="ml-1 text-red-500 cursor-pointer"
                >
                  &times; {/* Крестик для удаления */}
                </span>
              </span>
            ))
          : "Вакансии по умолчанию"}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute w-full mt-1 z-20">
            <Select
              isMulti // Включаем множественный выбор
              autoFocus
              backspaceRemovesValue={false}
              components={{ DropdownIndicator: null, IndicatorSeparator: null }}
              controlShouldRenderValue={false}
              hideSelectedOptions={false}
              isClearable={false}
              menuIsOpen
              onChange={(selectedOptions) => {
                setValue(selectedOptions); // Сохраняем массив выбранных значений
                setIsOpen(false);
              }}
              options={options}
              placeholder="Поиск..."
              tabSelectsValue={false}
              value={value} // Передаем массив выбранных значений
              className="rounded-md shadow-lg"
              classNamePrefix="select"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchableDropdown;
