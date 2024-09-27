import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppStore } from "@/store";

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAppStore();

  const isAuthenticated = !!userInfo;

  return isAuthenticated ? <Navigate to="/chat" /> : <>{children}</>;
};

export default AuthRoute;
