import axios from "axios";
import { BACKEND_URL, LOCAL_STORAGE_KEYS } from "../config";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});


export const getRequest = async ({ route, disableHandleError }) => {
  return new Promise(async (res, rej) => {
    try {
      const response = await api.get(route);
      res(response.data);
    } catch (error) {
      console.error("API error: ", error.response?.data || error.message);
      if(!disableHandleError){
        handleApiError(error);
      }
      rej(error);

    }
  });
};


export const postRequest = async ({ route, body, disableHandleError }) => {
  return new Promise(async (res, rej) => {
    const sendBody = body ? body : {};
    try {

      const response = await api.post(route, sendBody);
      res(response.data);
    } catch (error) {
      console.error("API error: ", error.response?.data || error.message);
      if(!disableHandleError){
        handleApiError(error);
      }
      rej(error);
    }
  });
};



export const authRef = { logout: null };
export const setAuthRef = (logoutFn) => {
  authRef.logout = logoutFn;
};


function handleApiError(error) {
  const status = error.response?.status;
  const detail = error.response?.data?.detail || "";
  if (
    status === 401 ||
    status === 400 ||
    detail.includes("401") ||
    detail.includes("400")
  ) {
    if (authRef.logout) authRef.logout();
    console.log("auth ref logout: ", authRef.logout);
  }
}
