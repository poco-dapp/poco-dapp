export const downloadFileUsingDataUri = (dataUri: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUri;
  link.style.opacity = "0";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadFileUsingBytes = (uint8array: Uint8Array, fileType: string, name: string) => {
  const blob = new Blob([uint8array], { type: fileType });
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  reader.onload = function () {
    downloadFileUsingDataUri(reader.result as string, name);
  };
};
