import { toast } from "react-toastify";

export const useToast = () => {
  const displayError = (message: string) => {
    toast.error(message);
  };

  return { displayError };
};
