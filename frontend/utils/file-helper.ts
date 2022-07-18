export const FILE_TYPE_JPG = "image/jpeg";
export const FILE_TYPE_PNG = "image/png";
export const FILE_TYPE_PDF = "application/pdf";

export const convertFileToBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const isValidFile = (file: File | undefined): boolean => {
  if (!file) {
    return false;
  }

  const isValidFileType =
    file.type === FILE_TYPE_JPG || file.type === FILE_TYPE_PNG || file.type === FILE_TYPE_PDF;

  const isValidFileSize = file.size / 1024 / 1024 < 5;

  return isValidFileType && isValidFileSize;
};
