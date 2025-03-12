"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const loginData = {
      login: username,
      password: password,
    };

    try {
      const response = await fetch(
        "https://prokrinilik.beget.app/webhook/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      // Проверяем, успешно ли выполнен запрос
      if (response.ok) {
        const data = await response.json();
        const token = await data[0].token; // Читаем ответ сервераs
        dispatch(setCredentials(token));
        localStorage.setItem("jwtToken", token);
        const decoded = jwtDecode(token);
        const name = decoded.user_id;
        router.push(`/users/${name}`);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log("Ошибка при выполнении запроса");
    }
  }

  return (
    <div className="flex flex-col w-[380px] px-4 py-3 bg-white rounded-md">
      <div className="mb-3 text-[#64748B] font-semibold">Авторизация</div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Email"
          className="p-2 text-[#64748B] placeholder:text-[#CACACA] placeholder:text-[15px] border border-[#CACACA] rounded outline-none mb-3"
        />

        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Пароль"
          className="p-2 text-[#64748B] placeholder:text-[#CACACA] placeholder:text-[15px] border border-[#CACACA] rounded outline-none mb-3"
        />
        {isErrorVisible && (
          <p className="text-[12px] text-red-800">Неверный email или пароль</p>
        )}
        {!isErrorVisible && <hr className="w-6" />}

        <button
          className="bg-[#626782] hover:opacity-70 text-white rounded mt-3 py-2"
          type="submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
