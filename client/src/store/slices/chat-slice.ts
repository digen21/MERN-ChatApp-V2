import { Channel, ChatType, User } from "@/types";

export interface Message {
  sender: User;
  recipient: User;
  channelId?: string;
}

export interface ChatState {
  userInfo?: User;
  selectedChatType: ChatType | undefined;
  selectedChatData: Channel | null;
  selectedChatMessages: any[];
  directMessageContacts: any[];
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadInProgress: number;
  fileDownloadProgress: number;

  channels: any[];

  setSelectedChatType: (selectedChatType: ChatType | undefined) => void;
  setSelectedChatData: (selectedChatData: Channel | null) => void;
  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;
  setDirectMessageContacts: (directMessageContacts: any[]) => void;
  closeChat: () => void;
  addMessage: (message: Message) => void;
  setIsUploading: (isUploading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setFileUploadInProgress: (fileUploadInProgress: number) => void;
  setFileDownloadProgress: (fileDownloadProgress: number) => void;
  setChannels: (channels: Channel[]) => void;
  addChannel: (channels: Channel) => void;
  addChannelInChannelList: (message: Message) => void;
  addMessageInDirectMessageList: (message: any) => void;
}

// Define the setter function type
type ChatStateSetter = (
  updater: (state: ChatState) => Partial<ChatState>
) => void;

const createChatSlice = (
  set: ChatStateSetter,
  get: () => ChatState
): ChatState => ({
  //initial values
  selectedChatType: undefined,
  selectedChatData: null,
  selectedChatMessages: [],
  directMessageContacts: [],
  isDownloading: false,
  isUploading: false,
  fileDownloadProgress: 0,
  fileUploadInProgress: 0,
  channels: [],

  setIsUploading: (isUploading: boolean) =>
    set((state) => ({ ...state, isUploading })),

  setSelectedChatType: (selectedChatType: ChatType | undefined) =>
    set((state) => ({ ...state, selectedChatType })),

  setSelectedChatData: (selectedChatData: Channel | null) =>
    set((state) => ({ ...state, selectedChatData })),

  setSelectedChatMessages: (selectedChatMessages: Message[]) =>
    set((state) => ({ ...state, selectedChatMessages })),

  setDirectMessageContacts: (directMessageContacts: any[]) =>
    set((state) => ({ ...state, directMessageContacts })),

  closeChat: () =>
    set(() => ({
      selectedChatType: undefined,
      selectedChatData: null,
      selectedChatMessages: [],
    })),

  addMessage: (message: Message) => {
    const { selectedChatType } = get();

    const newMessage = {
      ...message,

      recipient:
        selectedChatType === ChatType.CHANNEL
          ? message.recipient
          : message.recipient?._id,

      sender:
        selectedChatType === ChatType.CHANNEL
          ? message.sender
          : message.sender?._id,
    };

    set((state) => ({
      selectedChatMessages: [...state.selectedChatMessages, newMessage],
    }));
  },

  setIsDownloading: (isDownloading: boolean) =>
    set((state) => ({ ...state, isDownloading })),

  setFileUploadInProgress: (isFileUploadInProgress: number) =>
    set((state) => ({ ...state, isFileUploadInProgress })),

  setFileDownloadProgress: (isFileDownloadProgress: number) =>
    set((state) => ({ ...state, isFileDownloadProgress })),

  setChannels: (channels: Channel[]) =>
    set((state) => ({ ...state, channels })),

  addChannel: (channel: Channel) => {
    set((state) => ({
      channels: [...state.channels, channel],
    }));
  },

  // when new message send in channel, then moving the element in top of the array
  addChannelInChannelList: (message: Message) => {
    const channels = get().channels;
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );

    if (index !== -1) {
      const [movedChannel] = channels.splice(index, 1);
      channels.unshift(movedChannel);
    }
  },
  addMessageInDirectMessageList: (message: any) => {
    const userId = get().userInfo?._id;

    const fromId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;

    const directMessageContact =
      message.sender._id === userId ? message.recipient : message.sender;

    const dmContacts = get().directMessageContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);

    if (index !== -1) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(directMessageContact);
    }

    set((_) => ({
      directMessageContacts: [...dmContacts],
    }));
  },
});

export default createChatSlice;
