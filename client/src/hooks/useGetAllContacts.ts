import { useEffect, useState } from "react";

import { apiClient } from "@/lib";
import { GET_ALL_CONTACTS } from "@/utils";

interface UserData {
  label: string;
  value: string;
}

const useGetAllContacts = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [allContacts, setAllContacts] = useState<UserData[] | []>([]);

  useEffect(() => {
    const getAllContacts = async () => {
      setLoading(true);

      try {
        const res = await apiClient.get(GET_ALL_CONTACTS, {
          withCredentials: true,
        });

        if (res.status === 200) {
          const data = res.data as any;

          setAllContacts(data?.contacts || []);
        }
      } catch (error: any) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getAllContacts();
  }, []);

  return {
    allContacts,
    loading,
  };
};

export default useGetAllContacts;
