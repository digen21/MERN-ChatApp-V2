import { useEffect, useState } from "react";

import { apiClient } from "@/lib";
import { GET_CONTACTS } from "@/utils";

const useSearchContacts = (searchTerm: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<any[] | []>([]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm.trim()) {
        getContacts(searchTerm);
      } else {
        setContacts([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const getContacts = async (search: string) => {
    setLoading(true);

    try {
      const res = await apiClient.get(GET_CONTACTS, {
        withCredentials: true,
        params: { searchTerms: search },
      });

      if (res.status === 200) {
        const data = res.data as any;
        setContacts(data.contacts);
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    setContacts,
    loading,
  };
};

export default useSearchContacts;
