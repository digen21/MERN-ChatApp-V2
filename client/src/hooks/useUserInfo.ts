import { useEffect, useState } from "react";

import { apiClient } from "@/lib";
import { useAppStore } from "@/store";
import { GET_USER_INFO } from "@/utils";
import { toast } from "sonner";

const useUserInfo = () => {
  const { setUserInfo, userInfo } = useAppStore();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = (await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        })) as any;

        if (res.status === 200 && res.data?.user) {
          setUserInfo(res.data.user);
        } else {
          toast.error(res?.data?.message || "Failed to fetch user info.");
        }
      } catch (error: any) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo || userInfo === null) {
      getUserInfo();
    } else {
      setLoading(false); // If userInfo is already set, stop loading
    }
  }, [userInfo, setUserInfo]);

  return { userInfo, loading };
};

export default useUserInfo;
