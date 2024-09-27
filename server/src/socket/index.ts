import { Server } from "http";

import { startSession } from "mongoose";
import { Socket, Server as SocketIOServer } from "socket.io";
import { ChannelService, MessagesService } from "../services";

interface SocketMessage {
  sender: string;
  recipient?: string;
  channelId?: string;
  messageType: string;
  fileUrl?: string;
  content?: string;
}

const setUpSocket = (server: Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [String(process.env.CLIENT_URL)],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // sendChannelMessage;
  const userSocketMap = new Map<string, string>();

  const handleDisconnect = (socket: Socket): void => {
    console.info(`Client Disconnected ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`Removed User: ${userId} from Socket Map`);
        break;
      }
    }
  };

  const sendMessage = async (message: SocketMessage) => {
    const senderSocketId = userSocketMap.get(message.sender);

    const recipientSocketId = userSocketMap.get(String(message.recipient));

    delete message.channelId;

    const createdMessage = await MessagesService.create({
      ...message,
      recipient: String(message.recipient),
    });

    const messageData = await MessagesService.get({
      _id: createdMessage?._id as string,
    });

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData[0]);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData[0]);
    }
  };

  const sendChannelMessage = async (message: SocketMessage) => {
    const channelId = String(message.channelId);

    const session = await startSession();
    session.startTransaction();

    try {
      const createdMessage = await MessagesService.create({
        ...message,
        recipient: null,
      });

      if (createdMessage) {
        const messageData = (await MessagesService.get({
          _id: createdMessage?._id as string,
        })) as any;

        await ChannelService.updateById(channelId, {
          messages: [String(createdMessage._id)],
        });

        const channel = await ChannelService.findById(channelId);
        const finalData = { ...messageData[0]?._doc, channelId };

        if (channel && channel.members) {
          channel.members.forEach((member: any) => {
            const memberSocketId = userSocketMap.get(String(member?._id));

            if (memberSocketId) {
              io.to(memberSocketId).emit("receiveChannelMessage", finalData);
            }

            const adminSocketId = userSocketMap.get(String(channel.admin));

            if (adminSocketId) {
              io.to(adminSocketId).emit("receiveChannelMessage", finalData);
            }
          });
        }
      }

      await session.commitTransaction();
    } catch (error) {
      session.abortTransaction();
      console.log("Socket Send Channel Message Error: ", error);
    } finally {
      await session.endSession();
    }
  };

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.query?.userId as string;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with SocketId: ${socket.id}`);
    } else {
      console.info("User ID not provided...");
    }

    socket.on("sendMessage", (message: SocketMessage) => {
      sendMessage(message);
    });

    socket.on("sendChannelMessage", (message: SocketMessage) => {
      sendChannelMessage(message);
    });

    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

export default setUpSocket;
