import { useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib";
import { UPLOAD_FILE } from "@/utils";
import { useAppStore } from "@/store";

const useUploadFile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    setIsUploading,
    setFileUploadInProgress,
    fileUploadInProgress,
    isUploading,
  } = useAppStore();

  const uploadFile = async (formData: FormData) => {
    setLoading(true);
    setIsUploading(true);
    try {
      const res = (await apiClient.post(UPLOAD_FILE, formData, {
        withCredentials: true,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          setFileUploadInProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      } as any)) as any;

      if (res.status === 200 && res.data) {
        setIsUploading(false);
        return res.data.fileUrl;
      }
    } catch (error: any) {
      toast.error(error?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    fileUploadInProgress,
    loading,
  };
};

export default useUploadFile;
