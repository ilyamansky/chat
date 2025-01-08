// selectStyles.js

export const customSelectStyles = {
  multiValue: (provided) => ({
    ...provided,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: "0.375rem",
    padding: "px",
    marginRight: "px",
    border: "1px solid #64748B",
  }),
  placeholder: (base, state) => ({
    ...base,
    color: "#CACACA",
    fontSize: "15px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    marginRight: "mr-2",
    //marginLeft: "1px",
    color: "#64748B",
    fontSize: "13px",
    backgroundColor: "white",
    margin: "1px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: "pointer",
    color: "gray-500",
  }),
  control: (provided, state) => ({
    ...provided,
    outline: "none",
    border: "custom-bg-gray",
    boxShadow: "none",
    backgroundColor: state.hasValue || state.isFocused ? "white" : "gray-100", // Изменение фона в зависимости от наличия значения
    borderColor: state.isFocused ? "inherit" : "inherit",
    "&:hover": {
      backgroundColor: state.hasValue ? "white" : "gray-300", // Изменение фона при наведении курсора
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: "none",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
