import EmojiPicker, { Theme } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";

import { useSocket } from "@/context";
import { useUploadFile } from "@/hooks";
import { useAppStore } from "@/store";
import { ChatType } from "@/types";
import { UPLOAD_FILE_FORMAT } from "@/utils";
import Loader from "../Loader";
import { Input } from "../ui/input";

const MessageBar = () => {
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const { uploadFile, loading } = useUploadFile();

  const { sendMessage, socket, sendChannelMessage } = useSocket() || {};

  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleAddEmoji = ({ emoji }: { emoji: string }) => {
    setMessage((msg) => msg + emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = async () => {
    if (selectedChatType === ChatType.CONTACT) {
      if (message.trim() === "") {
        return;
      }

      const messageData = {
        sender: String(userInfo?._id),
        content: message,
        recipient: String(selectedChatData?._id),
        messageType: ChatType.TEXT,
        fileUrl: undefined,
      };

      if (sendMessage) {
        sendMessage(messageData);
        setMessage("");
      }
    } else if (selectedChatType === ChatType.CHANNEL) {
      if (message.trim() === "") {
        return;
      }

      if (sendChannelMessage) {
        sendChannelMessage({
          sender: String(userInfo?._id),
          content: message,
          channelId: String(selectedChatData?._id),
          messageType: ChatType.TEXT,
          fileUrl: undefined,
        });
        setMessage("");
      }
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  const handleAttachmentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const fileURL = await uploadFile(formData);

    if (fileURL && selectedChatType === ChatType.CONTACT) {
      socket?.emit("sendMessage", {
        sender: userInfo?._id,
        content: undefined,
        recipient: selectedChatData?._id,
        messageType: ChatType.FILE,
        fileUrl: fileURL,
      });
    } else if (fileURL && selectedChatType === ChatType.CHANNEL) {
      socket?.emit("sendChannelMessage", {
        sender: userInfo?._id,
        content: undefined,
        channelId: selectedChatData?._id,
        messageType: ChatType.FILE,
        fileUrl: fileURL,
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Loader message="Uploading..." />
      </div>
    );
  }

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-5 gap-3">
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <Input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-white border-none outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>

        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <input
            type="file"
            name="file"
            className="hidden"
            ref={fileInputRef}
            accept={UPLOAD_FILE_FORMAT}
            onChange={handleAttachmentChange}
          />

          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme={Theme.DARK}
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] rounded-md hover:bg-[#741bda] focus:bg-[#741bda] flex items-center justify-center p-2 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
      >
        <IoMdSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
