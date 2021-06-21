import {toast} from "react-toastify";

export function showError(msg: string) : void {
    toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
    });

    return;
}