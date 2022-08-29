import data from "./data";

export const fetchData = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  return data;
};