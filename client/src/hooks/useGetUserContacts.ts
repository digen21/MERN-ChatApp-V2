import { useEffect, useState } from "react";

import { apiClient } from "@/lib";
import { GET_CHANNELS, GET_USER_CONTACTS } from "@/utils";
import { useAppStore } from "@/store";

const useGetUserContacts = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { setDirectMessageContacts, setChannels } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      setLoading(true);

      try {
        const res = await apiClient.get(GET_USER_CONTACTS, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const data = res.data as any;

          setDirectMessageContacts(data?.contacts || []);
        }
      } catch (error: any) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    const getChannels = async () => {
      setLoading(true);

      try {
        const res = await apiClient.get(GET_CHANNELS, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const data = res.data as any;

          setChannels(data?.channels || []);
        }
      } catch (error: any) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getContacts();
    getChannels();
  }, [setDirectMessageContacts, setChannels]);

  return {
    loading,
  };
};

export default useGetUserContacts;
