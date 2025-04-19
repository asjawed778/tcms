export const useHandleFileUpload = () => {
  const handleFileUpload = async (file: File): Promise<{ fileUrl: string | null; error?: string }> => {
    try {
      if (!file) throw new Error("No file selected");

      const fileType = file.type; 

      // First request to get the signed URL
      const res = await fetch('http://localhost:4000/api/common/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileType: fileType,
        }),
        credentials: 'include',  // Ensure credentials are sent
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to get signed URL: ${res.status} - ${errorText}`);
      }

      const json = await res.json();
      const { uploadUrl, fileUrl } = json;
      if (!uploadUrl || !fileUrl) throw new Error("Incomplete response from backend");

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileType,  
        },
        body: file,  
      });

      if (!uploadRes.ok) {
        const uploadText = await uploadRes.text();
        throw new Error(`S3 upload failed: ${uploadRes.status} - ${uploadText}`);
      }

      return { fileUrl };

    } catch (error: any) {
      console.error("Upload Error:", error.message);
      return { fileUrl: null, error: error.message };
    }
  };

  return { handleFileUpload };
};
