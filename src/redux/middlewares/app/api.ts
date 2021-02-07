import { isEmpty, isFunction, isString } from "lodash";
import {
  API_REQUEST,
  startUILoading,
  stopUILoading,
  updateUIError,
} from "../../actions";

import { createAPIRequest } from "../../../services/restful";
import { Dispatch, AnyAction } from "redux";
import { message } from "antd";
import { batch } from "react-redux";

export const alertSuccess = (successMessage: string, key: string) => {
  message.success({ content: successMessage, key, duration: 6 });
};

export const alertError = (errorMessage: string, key: string) => {
  message.error({ content: errorMessage, key, duration: 4 });
};

export const handleErrors = (
  error: any,
  dispatch: Function,
  key: string,
  noErrorMessage: boolean,
  errorMessage: string
) => {
  if (!errorMessage) {
    dispatch(updateUIError(key, error?.message));
    if (!noErrorMessage && isString(error?.message)) {
      alertError(error?.message, key || "");
    }

    if (!isEmpty(error?.messages)) {
      Object.values(error?.messages || {})
        .flat()
        .map((message: any) => {
          alertError(message, key || "");
        });
    }
  } else {
    dispatch(updateUIError(key, errorMessage));
    alertError(errorMessage, key || "");
  }
};

const apiRequest = ({
  dispatch,
}: {
  dispatch: Dispatch<AnyAction>;
  getState: any;
}) => (next: Function) => (action: { type: string; meta?: any }) => {
  if (action.type === API_REQUEST.START) {
    const {
      method,
      url,
      key,
      payload,
      onError,
      successMessage,
      params,
      onSuccess,
      errorMessage,
      noSuccessMessage = false,
      noErrorMessage,
      onAfterError,
    } = action.meta;
    const config: any = { method, url };
    if (payload && (!isEmpty(payload) || payload instanceof FormData)) {
      config.data = payload;
    }
    if (params && !isEmpty(params)) {
      config.params = params;
    }

    batch(() => {
      dispatch(updateUIError(key, null));
      dispatch(startUILoading(key));
    });
    console.log("%cError", "font-size: 30px; color: pink", config);
    createAPIRequest(config)
      .then((response: any) => {
        batch(() => {
          if (onSuccess) {
            if (typeof onSuccess === "function") {
              onSuccess(response);
            } else {
              dispatch({ type: onSuccess, payload: response });
            }
          }
          dispatch(stopUILoading(key));
          const notificationMessage = successMessage || response?.message;
          if (!noSuccessMessage && notificationMessage) {
            alertSuccess(notificationMessage, key || "");
          }
        });
      })
      .catch((e) => {
        console.log("%cError", "font-siz: 30px;", e);
        batch(() => {
          if (onError) {
            if (isFunction(onError)) {
              onError(e);
            } else {
              handleErrors(e, dispatch, key, noErrorMessage, errorMessage);
            }
          } else {
            const error =
              (e && e.data && e.data.meta && e.data.meta.error) ||
              (e && e.error) ||
              e;
            handleErrors(error, dispatch, key, noErrorMessage, errorMessage);
          }
          dispatch(stopUILoading(key));
          if (isFunction(onAfterError)) {
            onAfterError(e);
          }
        });
      });
  }
  return next(action);
};

const middleware = [apiRequest];
export default middleware;
