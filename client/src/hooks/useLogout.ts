import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { apiClient } from "@/lib";
import { useAppStore } from "@/store";
import { LOGOUT_ROUTES } from "@/utils";

export default () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const { setUserInfo } = useAppStore();

  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);

    try {
      const res = await apiClient.post(
        LOGOUT_ROUTES,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setUserInfo(undefined);
        return navigate("/auth");
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
  };
};
