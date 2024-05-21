import { toast } from "react-toastify";
import { SUCCESSFUL, CREATED } from "store/constants/statusCodes";

export const withTryCatch = async (tryObj, catchFunc, finallyFunc) => {
  const { tryFunc, success } = tryObj;
  try {
    const response = await tryFunc?.();
    if (response?.status === SUCCESSFUL || response.status === CREATED) {
      success?.(response);
    } else {
      toast?.error(response?.data?.message);
    }
  } catch (err) {
    catchFunc?.(err);
    const messages =
      err?.response?.data?.message ??
      err?.response?.data?.errors ??
      err?.response?.data.error;
    if (Array.isArray(messages)) {
      messages?.forEach((msg) => toast?.error(msg));
    } else {
      toast?.error(messages);
    }
  } finally {
    finallyFunc?.();
  }
};
