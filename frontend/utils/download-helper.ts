export const downloadFile = (dataUri: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = dataUri;
  link.style.opacity = "0";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
