import { toast } from "react-toastify";
export const useGlobalError = () => {
  const error = toast.error;
  return error;
};
