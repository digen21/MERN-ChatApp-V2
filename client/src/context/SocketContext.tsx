import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { useAppStore } from "@/store";
import { SendChannelMessage, SendMessage, User } from "@/types";

export interface SocketContextType {
  socket: Socket | null;
  sendMessage: (message: SendMessage) => void;
  sendChannelMessage: (message: SendChannelMessage) => void;
}

interface Message {
  sender: User;
  recipient: User;
  channelId?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL as string;

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket | null>(null);
  const { selectedChatData, selectedChatType, addMessage } = useAppStore();

  const { userInfo, addChannelInChannelList, addMessageInDirectMessageList } =
    useAppStore();

  useEffect(() => {
    if (userInfo) {
      //connection to server

      socket.current = io(API_BASE_URL, {
        query: { userId: userInfo._id },
        withCredentials: true,
      });

      socket.current.on("connect", () => {
        console.log("Server connected");
      });

      const handleReceiveChannelMessage = (message: Message) => {
        if (
          selectedChatType !== undefined &&
          selectedChatData?._id === message.channelId
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      const handleReceiveMessage = (message: Message) => {
        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message.sender._id ||
            selectedChatData?._id === message.recipient._id)
        ) {
          addMessage(message);
        }
        addMessageInDirectMessageList(message);
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveChannelMessage", handleReceiveChannelMessage);

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo, selectedChatData]);

  const sendMessage = (message: any) => {
    if (socket.current) {
      socket.current.emit("sendMessage", message);
    }
  };

  const sendChannelMessage = (message: any) => {
    if (socket.current) {
      socket.current.emit("sendChannelMessage", message);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket: socket.current, sendMessage, sendChannelMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
};
