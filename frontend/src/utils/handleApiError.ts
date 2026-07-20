import axios from 'axios';
import { toast } from 'react-hot-toast';

export const handleApiError = (
  error: unknown,
  customMessage: string,
  toastId?: string
) => {
  console.error(error);
  const toastOptions = toastId ? { id: toastId } : undefined;

  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message || error.response?.data?.error;
    const message = responseMessage || error.message || customMessage;
    toast.error(message, toastOptions);
  } else if (error instanceof Error) {
    toast.error(error.message, toastOptions);
  } else {
    toast.error(customMessage, toastOptions);
  }
};
