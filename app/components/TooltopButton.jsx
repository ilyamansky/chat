import { Tooltip } from "@material-tailwind/react";
import { useContext } from "react";
import { ChatContext } from "../chatState";

export default function TooltipButton({ selectedId }) {
  const { state, dispatch } = useContext(ChatContext);
  return (
    <Tooltip
      className="bg-white opacity-100 w-[320px] p-2 -mt-3.5"
      content={
        <div className="flex flex-col text-sm opacity-100 text-custom-gray-filter-light">
          <p className="opacity-100 bg-opacity-100">Вакансии в разработке:</p>
          {state.chats[selectedId]?.vacancies.map((v) => (
            <div key={v}>{v}</div>
          ))}
        </div>
      }
    >
      <button>Btn</button>
    </Tooltip>
  );
}
