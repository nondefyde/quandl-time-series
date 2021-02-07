import { createActionString, createActionType } from "../../../_shared/utils";

const entity: string = "APP";
export const UI_UPDATE_STATE = createActionString("UPDATE_UI_STATE", entity);
export const UI_RESET = createActionString("UI_RESET", entity);
export const UI_LOADING = createActionType("UI_LOADING", entity);
export const UI_ERROR = createActionString("UI_ERROR", entity);

export const resetUI = () => ({
  type: UI_RESET,
});

export const startUILoading = (key: string) => ({
  type: UI_LOADING.START,
  key,
});

export const stopUILoading = (key: string) => ({
  type: UI_LOADING.END,
  key,
});

export const updateUIError = (
  key: string,
  value: string | null | React.ReactNode
) => ({
  type: UI_ERROR,
  key,
  value,
});

export const updateUIState = (payload: any) => ({
  type: UI_UPDATE_STATE,
  payload,
});
