// utils/formatDate.js
export const formatMessageDate = (isoString) => {
  const date = new Date(isoString);
  const options = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  };

  const [day, month, weekday, time] = date
    .toLocaleString("ru-RU", options)
    .replace(",", "")
    .split(" ");

  return `${day} ${month} ${weekday} ${time}`;
};
