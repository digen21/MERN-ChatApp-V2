import { useState } from "react";
import { apiClient } from "@/lib";
import { GET_FILE } from "@/utils";

const useGetFile = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const getFile = async (messageId: string, filename: string) => {
    setLoading(true);

    try {
      const res = (await apiClient.get(GET_FILE, {
        withCredentials: true,
        params: { id: messageId },
      })) as any;

      if (res.status === 200) {
        const fileUrl = res.data.fileUrl;

        // Fetch the actual file using the file URL
        const fileRes = await fetch(fileUrl);
        const blob = await fileRes.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); // Set the file name
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      console.error("Error downloading file: ", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    getFile,
    loading,
  };
};

export default useGetFile;
