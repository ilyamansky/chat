import { useContext } from "react";
import { ChatContext } from "../chatState";

export default function ChatDetails() {
  const { state } = useContext(ChatContext);
  console.log(state.selectedChat?.contacts);
  const selectedChat = state.selectedChat;
  const contacts = state.selectedChat?.contacts;

  if (!selectedChat) return null;

  return (
    <div className="w-[300px] border-l p-4 overflow-y-auto">
      <p className="font-bold mb-2">Контактная информация:</p>
      <ul>
        <li>
          <strong>Telegram:</strong> {contacts.telegram}
        </li>
        <li>
          <strong>Email:</strong> {contacts.email}
        </li>
        <li>
          <strong>WhatsApp:</strong> {contacts.whatsapp}
        </li>
        <li>
          <strong>Телефон:</strong> {contacts.phone}
        </li>
      </ul>
    </div>
  );
}
