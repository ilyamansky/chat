"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import AsyncSelect from "react-select/async";
import { selectStylesTranscription } from "../ui/selectStylesTranscription";
import { LinearProgress } from "@mui/material";
import FileIcon from "../ui/icons/FileIcon";
import FileAttachIcon from "../ui/icons/FileAttachIcon";
import FileAttachmentCloseIcon from "../ui/icons/FileAttachmentCloseIcon";
import TickIconFilter from "../ui/icons/TickIconFilter";
import { jwtDecode } from "jwt-decode";
import clsx from "clsx";
import {
  uploadTranscription,
  fetchVacanciesWithQuestionnaires,
} from "../redux/chatSlice";

const exampleVacancies = [
  { label: "Вакансия 1", value: "vacancy1" },
  { label: "Вакансия 2", value: "vacancy2" },
  { label: "Вакансия 3", value: "vacancy3" },
];

const Option = (props) => {
  const { innerProps, isSelected, data } = props;

  return (
    <div
      className={clsx("flex justify-between my-2 p-2 hover:opacity-70", {
        "bg-custom-bg-gray": isSelected,
      })}
      {...innerProps}
    >
      <div>
        <div className="text-custom-gray-dark text-[15px] font-medium">
          {data.customerName}
        </div>
        <div className="text-custom-gray-dark text-[12px] font-medium">
          {data.label}
        </div>
      </div>

      <div>{isSelected && <TickIconFilter />}</div>
    </div>
  );
};

export default function TranscriptionTab() {
  const dispatch = useDispatch();
  const { selectedChat: selectedChatState } = useSelector(
    (state) => state.chat
  );
  const token = useSelector((state) => state.auth.token);
  const decodedToken = jwtDecode(token);
  const currentUser = decodedToken?.user_id;
  const vacanciesWithQuestionnaires = useSelector(
    (state) => state.chat.vacanciesWithQuestionnaires
  );
  const [file, setFile] = useState(null);
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const [isAttaching, setIsAttaching] = useState(false);
  const [isAttached, setIsAttached] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [submitStatusSuccess, setSubmitStatusSuccess] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        //setIsLoadingVacancies(true);
        await dispatch(fetchVacanciesWithQuestionnaires()).unwrap();
        //setUploadStatus("Выберите вакансию и загрузите аудио");
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        //setUploadStatus("Ошибка загрузки вакансий");
      } finally {
        //setIsLoadingVacancies(false);
      }
    };

    fetchVacancies();
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!selectedVacancy || !file) return;

    try {
      setIsSubmitting(true);
      //setUploadStatus("Отправка файла на обработку...");

      await dispatch(
        uploadTranscription({
          candidateId: selectedChatState?.id,
          vacancyId: selectedVacancy.value,
          currentUser: currentUser,
          audioFile: file,
        })
      ).unwrap();

      setSubmitStatusSuccess("Файл успешно загружен! ");

      // Сброс формы после успешной отправки
      setTimeout(() => {
        handleReset();
        setIsSubmitting(false);
        setSubmitStatusSuccess("");
      }, 2000);
    } catch (error) {
      //alert("Ошибка отправки:", error.message);
      setSubmitStatus(`Ошибка: попробуйте еще раз!`);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsAttaching(true);
      setIsAttached(false);
      setAttachmentProgress(0);
      setUploadStatus("");

      const interval = setInterval(() => {
        setAttachmentProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setAttachmentProgress(100);
        setIsAttaching(false);
        setIsAttached(true);
        setFile(selectedFile);
        setUploadStatus(`Файл ${selectedFile.name} успешно загружен!`);
      }, 2000);
    }
  };
  const handleReset = () => {
    setFile(null);
    setSelectedVacancy(null);
    setIsAttached(false);
    setAttachmentProgress(0);
    setUploadStatus("");
    setSubmitStatus("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFormReady = selectedVacancy && file && !isAttaching;
  return (
    <div className="">
      <p className="text-[22px] text-black pt-2 pl-4">Транскрибация</p>
      <p className="pl-4 text-black">{selectedChatState?.name}</p>
      <p className="p-2 pt-1 pl-4 text-[13px] text-[#858585]">
        Преобразовывайте общение с кандидатом в заполненные формы опроса
      </p>
      <div className="bg-white m-4 mb-0 mr-2 rounded">
        <p className="text-[13px] text-[#858585] p-2 pb-0 pl-4">
          Выберите вакансию
        </p>
        <div className="p-2 pl-4 pr-4 pt-2 ">
          <AsyncSelect
            isDisabled={isSubmitting}
            options={exampleVacancies}
            isClearable={false}
            cacheOptions={true}
            value={selectedVacancy}
            onChange={setSelectedVacancy}
            defaultOptions={vacanciesWithQuestionnaires} // This is crucial for initial load
            //loadOptions={vacancies}
            //value={selectedFilters.recruiters}
            //onChange={handleFilterChange("recruiters")}
            placeholder="Вакансия не выбрана"
            styles={selectStylesTranscription}
            components={{ Option }}
          />

          {file && !isAttaching && isAttached && (
            <div>
              <div className="text-[13px] text-[#858585] mt-2">
                Файл прикреплен
              </div>
              <div className="flex items-start justify-between rounded mt-2">
                <div className="flex items-start">
                  <FileIcon className="w-6 h-6" />
                  <div>
                    <p className="ml-1 text-[14px] text-black">
                      {file.name.slice(0, 23)}
                      <span>...</span>
                    </p>{" "}
                    <p className="ml-1 text-[12px] text-black">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setIsAttached(false);
                  }}
                  className="text-[#9E6D2D]"
                >
                  {!isSubmitting && <FileAttachmentCloseIcon />}
                </button>
              </div>
            </div>
          )}
          {!file && (
            <div className="flex items-center mt-4 pt-0">
              <label className="cursor-pointer flex items-center">
                <div className="flex flex-col">
                  {!file && (
                    <p className="text-[#858585] text-[13px]">
                      Добавьте файл общения
                    </p>
                  )}
                  {!file && (
                    <div className="flex items-center">
                      <div className="mt-1">
                        <FileAttachIcon />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        key={file ? "file-selected" : "no-file"}
                      />
                      <span className="ml-2 mt-1 text-[#939393] text-[13px]">
                        Файл не выбран
                      </span>
                    </div>
                  )}
                  {!file && (
                    <span className="text-[#BCBCBC] text-[13px] mt-2">
                      Допускаются только аудиофайлы размером не более 100MB
                    </span>
                  )}
                </div>
              </label>
            </div>
          )}
          {isAttaching && (
            <div className="pr-2 mb-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="mb-2">
                    <FileIcon />
                  </div>
                  <span className="ml-2 mb-2 text-[#939393] text-[13px]">
                    Attaching file...
                  </span>
                </div>
              </div>
              <LinearProgress
                variant="determinate"
                value={attachmentProgress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    backgroundColor: "#3b82f6",
                  },
                }}
              />
              <p>{uploadStatus}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 ml-4 mt-2">
        <button
          disabled={!isFormReady || isSubmitting}
          onClick={handleSubmit}
          className={`mt-2 px-2 py-2 text-sm rounded ${
            isFormReady && !isSubmitting
              ? "bg-[#626782] text-white hover:bg-[#525672]"
              : "bg-[#94A3B8] text-white cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Отправка..." : "Загрузить"}
        </button>

        {(selectedVacancy || file) && !isSubmitting && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 px-2 py-2 text-sm text-[#94A3B8] border border-[#94A3B8] rounded hover:bg-gray-50"
          >
            Сбросить
          </button>
        )}
      </div>
      <p className="ml-4 mt-1 text-[13px] text-red-600">{submitStatus}</p>
      <p className="ml-4 mt-1 text-[13px] text-black">{submitStatusSuccess}</p>
      <p className="text-[13px] text-[#858585] px-4 pt-2">
        Результаты распознавания добавятся в историю общения с кандидатом
      </p>
    </div>
  );
}
