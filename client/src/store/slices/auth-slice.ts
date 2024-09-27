import { User } from "@/types";

export interface AuthState {
  userInfo: User | undefined;
  setUserInfo: (userInfo: User | undefined) => void;
}

const createAuthSlice = (
  set: (updater: (state: AuthState) => Partial<AuthState>) => void
) => ({
  userInfo: undefined, // Initialize with undefined
  setUserInfo: (userInfo: User | undefined) =>
    set((state) => ({ ...state, userInfo })), // Update userInfo correctly
});

export default createAuthSlice;
