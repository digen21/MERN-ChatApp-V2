import { useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib";
import { useAppStore } from "@/store";
import { UPDATE_PROFILE_IMAGE } from "@/utils";

const useUpdateProfileImage = () => {
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState<Boolean>(false);

  const updateProfileImage = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = (await apiClient.put(UPDATE_PROFILE_IMAGE, formData, {
        withCredentials: true,
      })) as any;

      if (res.status === 200 && res.data?.user) {
        setUserInfo({ ...res.data.user });
        toast.success("Profile Imaged updated successfully...");
      }
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfileImage,
    loading,
  };
};

export default useUpdateProfileImage;
