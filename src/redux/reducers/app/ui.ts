import { UI_ERROR, UI_LOADING, UI_RESET, UI_UPDATE_STATE } from "../../actions";
import { Action } from "../../types";

export interface UIState {
  errors: any;
  loading: any;
}
export const UIDefaultState: UIState = {
  errors: {},
  loading: {},
};

const uiReducer = (state = UIDefaultState, action: Action) => {
  switch (action.type) {
    case UI_UPDATE_STATE:
      return { ...state, layout: { ...action.payload } };
    case UI_RESET: {
      return UIDefaultState;
    }
    case UI_LOADING.START:
      return getNewLoadingState(state, action, true);
    case UI_LOADING.END:
      return getNewLoadingState(state, action, false);
    case UI_ERROR:
      return Object.assign({}, state, {
        errors: { ...state.errors, [action.key]: action.value },
      });
    default:
      return state;
  }
};

export default uiReducer;

function getNewLoadingState(
  currentState: any = {},
  action: Action,
  value: any
) {
  const { key } = action;
  return Object.assign({}, currentState, {
    loading: { ...currentState.loading, [key]: value },
  });
}
