import {ACTION_SHOW_ALERT} from '../actions';

export default function alertReducer(state = {
    message: '',
    active: false,
}, action) {
  switch(action.type) {

    case ACTION_SHOW_ALERT: {
      const { message } = action.payload;

      return {
        ...state,
        message,
        active: true,
      }
    }

    default: {
      return state;
    }
  }
}
