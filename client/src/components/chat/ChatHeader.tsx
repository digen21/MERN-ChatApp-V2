import { RiCloseFill } from "react-icons/ri";

import { getColor } from "@/lib";
import { useAppStore } from "@/store";
import { ChatType } from "@/types";
import { Avatar, AvatarImage } from "../ui/avatar";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-2 items-center justify-center">
          <div className="h-12 w-12 relative">
            {selectedChatType === ChatType.CONTACT ? (
              <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                {selectedChatData?.avatar ? (
                  <AvatarImage
                    src={selectedChatData.avatar}
                    className="object-cover w-12 h-12 bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[2px] flex items-center rounded-full justify-center ${getColor(
                      selectedChatData?.color || 0
                    )}`}
                  >
                    {selectedChatData?.firstName
                      ? String(selectedChatData.firstName).charAt(0)
                      : (selectedChatData?.email ?? "").charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>

          {selectedChatType === ChatType.CHANNEL && `${selectedChatData?.name}`}

          {selectedChatType === "contact" &&
            `${selectedChatData?.firstName} ${selectedChatData?.lastName}`}
        </div>
        <div className="flex item-center justify-center gap-5">
          <button
            onClick={closeChat}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
