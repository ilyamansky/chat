const API_BASE = "https://prokrinilik.beget.app/webhook";

const fetchWithToken = async (url, options) => {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchUsersTest = async () => {
  const result = await fetchWithToken(
    "https://prokrinilik.beget.app/webhook/get_messages",
    {
      method: "GET",
      //body: JSON.stringify(filters), // Убедитесь, что сервер поддерживает тело для GET-запросов
      headers: {
        //"Content-Type": "application/json",
      },
    }
  );
  console.log(result);
  return result;
};
