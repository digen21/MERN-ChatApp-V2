import { useState } from "react";

import { apiClient } from "@/lib";
import { useAppStore } from "@/store";
import { UpdateUserInput } from "@/types";
import { UPDATE_USER_INFO } from "@/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const validateInput = (input: UpdateUserInput) => {
  if (!input.firstName) {
    toast.error("First name is required");
    return false;
  }

  if (!input.lastName) {
    toast.error("Last name is required");
    return false;
  }

  return true;
};

const useUpdateUserInfo = () => {
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState<Boolean>(false);

  const navigate = useNavigate();

  const updateUserInfo = async (updateUserInput: UpdateUserInput) => {
    const isValidInput = validateInput(updateUserInput);
    if (!isValidInput) return;

    setLoading(true);
    try {
      const res = (await apiClient.put(UPDATE_USER_INFO, updateUserInput, {
        withCredentials: true,
      })) as any;

      if (res.status === 200 && res.data?.user) {
        setUserInfo({ ...res.data.user });
        toast.success("Profile updated successfully...");
        navigate("/chat");
      }
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserInfo,
    loading,
  };
};

export default useUpdateUserInfo;
