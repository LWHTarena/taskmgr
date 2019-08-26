import {Auth} from '../domain';
import * as actions from '../actions/auth.action';
import {Err} from '../domain/err.model';

export const initialState: Auth = {};

export function reducer(state: Auth = initialState, action: actions.Actions): Auth {
    switch (action.type) {
        case actions.ActionTypes.LOGIN_SUCCESS:
        case actions.ActionTypes.REGISTER_SUCCESS: {
            const auth = <Auth>action.payload;
            return {
                user: auth.user,
                token: auth.token,
                userId: auth.user.id
            };
        }
        case actions.ActionTypes.LOGIN_FAIL:
        case actions.ActionTypes.REGISTER_FAIL: {
            return {err: <Err>action.payload};
        }
        default: {
            return state;
        }
    }
}

export const getAuth = (state: Auth) => state;
