import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { apiClient } from "@/lib";
import { useAppStore } from "@/store";
import { SingUpInput, SingUpPayload } from "@/types";
import { SIGNUP_ROUTES } from "@/utils";

const handleInputErrors = ({
  email,
  password,
  confirmPassword,
}: SingUpInput) => {
  if (!email.length) {
    toast.error("Email is required");
    return false;
  }

  if (!password.length) {
    toast.error("Password is required");
    return false;
  }

  if (confirmPassword && !confirmPassword.length) {
    toast.error("Confirm Password is required");
    return false;
  }

  if (confirmPassword !== password) {
    toast.error("Confirm password must be same as password");
    return false;
  }

  return true;
};

const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const signUp = async (input: SingUpInput) => {
    const isValidInput = handleInputErrors(input);

    if (!isValidInput) return;

    delete input.confirmPassword;

    setLoading(true);

    try {
      const res = await apiClient.post(SIGNUP_ROUTES, input, {
        withCredentials: true,
      });

      if (res.status === 201) {
        const { user } = res.data as SingUpPayload;

        if (user) {
          setUserInfo(user);
          navigate("/profile");
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
  };
};

export default useSignup;
