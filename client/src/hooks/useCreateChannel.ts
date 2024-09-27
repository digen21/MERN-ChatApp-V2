import { useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib";
import { CreateChannelInput, CreateChannelPayload } from "@/types";
import { CREATE_CHANNEL } from "@/utils";

const handleInputErrors = ({ members, name }: CreateChannelInput) => {
  if (!members.length) {
    toast.error("Members are required");
    return false;
  }

  if (!name || name.trim().length < 0) {
    toast.error("Channel name is required");
    return false;
  }

  return true;
};

const useCreateChannel = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const createChannels = async (input: CreateChannelInput) => {
    const isValidInput = handleInputErrors(input);

    if (!isValidInput) return;

    setLoading(true);

    try {
      const res = await apiClient.post(CREATE_CHANNEL, input, {
        withCredentials: true,
      });

      if (res.status === 201) {
        const { channel } = res.data as CreateChannelPayload;
        return channel;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createChannels,
    loading,
  };
};

export default useCreateChannel;
