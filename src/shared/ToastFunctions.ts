import { toast, ToastOptions } from "react-toastify";

const options: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
};

export function showError(msg: string): void {
  toast.error(msg, options);
}

export function showWarning(msg: string): void {
  toast.warn(msg, options);
}
