import { create } from "zustand";
import createAuthSlice, { AuthState } from "./slices/auth-slice";
import createChatSlice, { ChatState } from "./slices/chat-slice";

export type AppState = AuthState; // Combine any other slices here in the future
export type ChatAppState = ChatState;

export const useAppStore = create<AppState & ChatAppState>((set, get) => ({
  ...createAuthSlice(set),
  ...createChatSlice(set, get),
}));
