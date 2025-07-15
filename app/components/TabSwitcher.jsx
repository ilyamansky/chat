// components/TabSwitcher.js
import React, { useState } from "react";

export default function TabSwitcher({ activeTab, setActiveTab }) {
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);

  return (
    <div className="absolute top-2 left-2 z-50 bg-custom-bg-gray  hover:bg-gray-50 border border-[#6E9DD033] rounded-md p-1">
      <div className="relative">
        <button
          className="flex items-center text-black text-[13px] font-medium p-[1px]"
          onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
        >
          {activeTab === "chats" ? "Чаты" : "Калькулятор"}
          <svg
            className={`ml-2 w-4 h-4 transition-transform ${
              isTabDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isTabDropdownOpen && (
          <div className="absolute top-full -left-1 mt-2 w-[320px] bg-white shadow-lg border border-gray-200 rounded-md z-30">
            <div className="p-2">
              <button
                className={`w-full text-left px-3 py-2 rounded text-sm mb-1 hover:bg-gray-50 ${
                  activeTab === "chats"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("chats");
                  setIsTabDropdownOpen(false);
                }}
              >
                <div className="font-medium">Чаты</div>
                <div className="text-xs text-gray-500">
                  Омниканальное взаимодействие с кандидатами через каналы связи
                </div>
              </button>

              <button
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50 ${
                  activeTab === "calculator"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("calculator");
                  setIsTabDropdownOpen(false);
                }}
              >
                <div className="font-medium">Калькулятор</div>
                <div className="text-xs text-gray-500">
                  Автоматический расчет ставки сотрудника с учетом
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
