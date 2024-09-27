import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { apiClient } from "@/lib";

import { useAppStore } from "@/store";
import { SingInInput, SingInPayload } from "@/types";
import { SIGNIN_ROUTES } from "@/utils";

const handleInputErrors = ({ email, password }: SingInInput) => {
  if (!email.length) {
    toast.error("Email is required");
    return false;
  }

  if (!password.length) {
    toast.error("Password is required");
    return false;
  }

  return true;
};

const useSignin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setUserInfo } = useAppStore();

  const navigate = useNavigate();

  const signIn = async (input: SingInInput) => {
    const isValidInput = handleInputErrors(input);

    if (!isValidInput) return;

    setLoading(true);

    try {
      const res = await apiClient.post(SIGNIN_ROUTES, input, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const { user } = res.data as SingInPayload;

        if (user) {
          setUserInfo(user);
        }
        if (user?._id && user?.isProfileSetup) return navigate("/chat");

        return navigate("/profile");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    loading,
  };
};

export default useSignin;
