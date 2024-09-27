import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { MdFolderZip } from "react-icons/md";

import { useGetFile, useGetMessages } from "@/hooks";
import { useAppStore } from "@/store";
import { ChannelMessages, ChatType, Messages } from "@/types";
import { IoCloseOutline } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getColor } from "@/lib";

const MessageContainer = () => {
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
  } = useAppStore();

  const { getFile } = useGetFile();

  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);

  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);
  const { getMessages, getChannelMessages } = useGetMessages();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Messages when chat data changes
  useEffect(() => {
    const messageId = selectedChatData?._id as string;

    if (selectedChatData && selectedChatType === ChatType.CONTACT) {
      getMessages(messageId)
        .then((messages) => {
          setSelectedChatMessages(messages);
          setIsInitialScrollDone(false); // Reset the scroll flag
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    } else if (selectedChatData && selectedChatType === ChatType.CHANNEL) {
      getChannelMessages(messageId)
        .then((messages) => {
          setSelectedChatMessages(messages);
          setIsInitialScrollDone(false); // Reset the scroll flag
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [selectedChatData?._id, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current && !isInitialScrollDone) {
      scrollRef.current.scrollIntoView({
        behavior: "auto",
      });
      setIsInitialScrollDone(true);
    }
  }, [selectedChatMessages, isInitialScrollDone]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedChatMessages.length]);

  const extractFileName = (fileUrl: string) => {
    const parts = fileUrl.split("/");
    return parts[parts.length - 1];
  };

  const downloadFile = async (messageID: string, fileUrl: string) => {
    const fileName = extractFileName(fileUrl);
    await getFile(messageID, fileName);
  };

  const checkIfImage = (filePath: string) => {
    const imageRegex = /\.(jpg|jpeg|png|bmp|tiff|tif|webp|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderDMMessages = (message: Messages) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData?._id ? "text-left" : "text-right"
        }`}
      >
        {message?.messageType === ChatType.TEXT && (
          <div
            className={`${
              message?.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message?.content}
          </div>
        )}

        {message?.messageType === ChatType.FILE && (
          <div
            className={`${
              message?.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message?.fileUrl ?? "") ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl ?? "");
                  setMessageId(message?._id);
                }}
              >
                <img src={message.fileUrl} height={300} width={300} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{(message?.fileUrl ?? "").split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() =>
                    downloadFile(message?._id, message?.fileUrl ?? "")
                  }
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(message.createdAt).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (messageData: ChannelMessages) => {
    return (
      <div
        className={`mt-5 ${
          messageData?.sender?._id === userInfo?._id
            ? "text-right"
            : "text-left"
        }`}
      >
        {messageData?.messageType === ChatType.TEXT && (
          <div
            className={`${
              messageData?.sender._id !== userInfo?._id
                ? "bg-[#2a2b33]/5 text-white/80 border-white/20"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {messageData?.content}
          </div>
        )}

        {messageData?.sender?._id !== userInfo?._id ? (
          <div className="flex items-center justify-start gap-3 my-1">
            <Avatar className="w-8 h-8 rounded-full overflow-hidden">
              {messageData?.sender?.avatar && (
                <AvatarImage
                  src={messageData?.sender?.avatar}
                  className="object-cover w-full h-full bg-black"
                />
              )}

              <AvatarFallback
                className={`uppercase h-8 w-8 text-sm border-[1px] flex items-center justify-center ${getColor(
                  messageData?.sender?.color || 0
                )}`}
              >
                {messageData?.sender?.firstName
                  ? String(messageData?.sender.firstName).charAt(0)
                  : (messageData?.sender?.email ?? "").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm text-white/60">
                {`${messageData?.sender.firstName} ${messageData?.sender.lastName}`}
              </span>
              <span className="text-xs text-gray-600 ml-2">
                {moment(messageData?.createdAt).format("LT")}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-600 ml-2">
            {moment(messageData?.createdAt).format("LT")}
          </div>
        )}

        {messageData?.messageType === ChatType.FILE && (
          <div>
            <div
              className={`${
                messageData?.sender?._id !== userInfo?._id
                  ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                  : "bg-[#2a2b33]/5 text-white/80 border-white/20"
              } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
            >
              {messageData?.fileUrl && checkIfImage(messageData.fileUrl) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageURL(messageData.fileUrl ?? "");
                    setMessageId(messageData?._id);
                  }}
                >
                  <img src={messageData.fileUrl} height={300} width={300} />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                    <MdFolderZip />
                  </span>
                  <span>{(messageData?.fileUrl ?? "").split("/").pop()}</span>
                  <span
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    onClick={() =>
                      downloadFile(messageData?._id, messageData?.fileUrl ?? "")
                    }
                  >
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate: string | null = null;
    return selectedChatMessages.map((message: any, index: number) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");

      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div>
              <div className="text-center text-gray-500 my-2">
                {moment(message.createdAt).format("LL")}
              </div>
            </div>
          )}

          {selectedChatType === ChatType.CONTACT && renderDMMessages(message)}
          {selectedChatType === ChatType.CHANNEL &&
            renderChannelMessages(message)}
          {/* Assign the ref to the last message */}
          {index === selectedChatMessages.length - 1 && <div ref={scrollRef} />}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[80vw] xl:w=[80vw] w-full">
      {renderMessages()}
      {
        <div ref={scrollRef}>
          {showImage && (
            <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
              <div>
                <img
                  src={String(imageURL)}
                  className="h-[80vh] w-full bg-cover"
                  alt=""
                />
              </div>
              <div className="flex gap-5 fixed top-0 mt-5">
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() =>
                    downloadFile(String(messageId), String(imageURL))
                  }
                >
                  <IoMdArrowRoundDown />
                </span>

                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setShowImage(false);
                    setImageURL(null);
                  }}
                >
                  <IoCloseOutline />
                </span>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default MessageContainer;
