import store from "../store";

export const dispatchAction = (type, payload = null) => {
    store.dispatch({
        type: type,
        payload: payload,
    });
};