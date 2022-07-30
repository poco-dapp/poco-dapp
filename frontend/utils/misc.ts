export const sleep = async (sec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, sec * 1000);
  });
};
