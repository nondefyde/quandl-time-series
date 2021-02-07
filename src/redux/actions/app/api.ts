import { createActionType } from "../../../_shared/utils";

export const API_REQUEST = createActionType("API_REQUEST", "APP");

export type ApiRequest = {
  /**
   * REST API request method
   */
  method?: "get" | "post" | "put" | "delete" | "patch";
  /**
   * Request URL
   */
  url?: string;
  /**
   * Request Key (identification, used to handle loading state and error state)
   */
  key?: string;
  /**
   * Data sent to the API
   */
  payload?: any;
  /**
   * Function called after request returns with an error
   * @param error
   */
  onError?: ((error?: any) => void) | string;
  /**
   * Success message
   */
  successMessage?: string;
  /**
   * URL query parameters
   */
  params?: any;

  /**
   * Function called after request returns with an successfully
   * @param data
   */
  onSuccess?: ((data?: any) => void) | string;

  /**
   * Used to handle redirect after a successful request
   */
  nextRoute?: string;
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * Used to prevent a success message after an API request
   */
  noSuccessMessage?: boolean;
  /**
   * Used to prevent a error message after an API request
   */
  noErrorMessage?: boolean;
  /**
   * Function is called after an error is met
   */
  onAfterError?: Function;
};

export const apiRequest = (meta: ApiRequest) => ({
  type: API_REQUEST.START,
  meta,
});
