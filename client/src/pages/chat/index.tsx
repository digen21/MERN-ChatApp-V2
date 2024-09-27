import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  ChatContainer,
  ContactContainer,
  EmptyChatContainer,
} from "@/components";
import { useAppStore } from "@/store";

const Chat: React.FC = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileDownloadProgress,
    fileUploadInProgress,
  } = useAppStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.isProfileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen text-white overflow-hidden">
      {isUploading && (
        <div className="h-screen w-screen fixed top-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Uploading File...</h5>
          {fileUploadInProgress}%
        </div>
      )}

      {isDownloading && (
        <div className="h-screen w-screen fixed top-0 z-10 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
          <h5 className="text-5xl animate-pulse">Downloading File...</h5>
          {fileDownloadProgress}%
        </div>
      )}
      <ContactContainer />

      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
