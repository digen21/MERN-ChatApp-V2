import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { Loader } from "@/components";
import { useUserInfo } from "@/hooks";
import { useAppStore } from "@/store";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAppStore();
  const { loading } = useUserInfo();

  if (loading) {
    return <Loader message="Loading..." />;
  }

  const isAuthenticated = !!userInfo;

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
