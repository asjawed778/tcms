
interface ValidationOptions {
  allowedTypes: string[];
  maxSizeInMB: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const useValidateUploadingFile = () => {
  const validateUploadingFile = (
    file: File,
    options: ValidationOptions
  ): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const { allowedTypes, maxSizeInMB, maxWidth, maxHeight } = options;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        return resolve({
          isValid: false,
          error: `File too large. Max size is ${maxSizeInMB}MB.`,
        });
      }

      if (!allowedTypes.includes(file.type)) {
        return resolve({ isValid: false, error: 'Unsupported file type.' });
      }

      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          if (maxWidth && img.width > maxWidth) {
            return resolve({
              isValid: false,
              error: `Image width too large. Max width is ${maxWidth}px.`,
            });
          }

          if (maxHeight && img.height > maxHeight) {
            return resolve({
              isValid: false,
              error: `Image height too large. Max height is ${maxHeight}px.`,
            });
          }

          resolve({ isValid: true });
        };
        img.onerror = () => resolve({ isValid: false, error: 'Error loading image.' });
        img.src = URL.createObjectURL(file);  // Load the image and check its dimensions
      } else {
        resolve({ isValid: true });  // Non-image files are automatically valid
      }
    });
  };

  return { validateUploadingFile };
};

