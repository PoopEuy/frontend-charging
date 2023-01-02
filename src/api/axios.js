import axios from "axios";

const baseURLBackEnd = process.env.REACT_APP_BASE_URL_BACKEND;
// const baseURLFRAME = process.env.REACT_APP_BASE_URL_FRAME;
console.log("baseURL_BE = " + baseURLBackEnd);

export const instanceBackEnd = axios.create({
  baseURL: baseURLBackEnd,
});

// export const instanceFrame = axios.create({
//   baseURL: baseURLFRAME,
// });
