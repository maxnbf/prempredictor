import { SIGN_UP_RESPONSE, SIGN_IN_RESPONSE, RESET_STORE } from '../types/authTypes.js';

const initialState = { user_info: {}, isAuthenticated: false};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case SIGN_UP_RESPONSE:
            return {
                ...state,
                user_info: action.payload,
                isAuthenticated: !(action.payload === {})
            };
        case SIGN_IN_RESPONSE:
            return {
                ...state,
                user_info: action.payload,
                isAuthenticated: !(action.payload === {})
            };
        case RESET_STORE:
                return{
                  ...state
                  //currently do nothing for authentication reducers
                }
        default:
            return state;
    }
}