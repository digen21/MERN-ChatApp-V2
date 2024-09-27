import { useState } from "react";

import { apiClient } from "@/lib";
import { GET_CHANNELS_MESSAGES, GET_MESSAGES } from "@/utils";

const useGetMessages = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const getMessages = async (recipient: string) => {
    setLoading(true);

    try {
      const res = await apiClient.get(GET_MESSAGES, {
        withCredentials: true,
        params: { recipient },
      });

      if (res.status === 200) {
        const data = res.data as any;
        return data?.messages || [];
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getChannelMessages = async (channelId: string) => {
    setLoading(true);

    try {
      const res = await apiClient.get(GET_CHANNELS_MESSAGES, {
        withCredentials: true,
        params: { id: channelId },
      });

      if (res.status === 200) {
        const data = res.data as any;
        return data?.messages || [];
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    getMessages,
    getChannelMessages,
    loading,
  };
};

export default useGetMessages;
