
import { Alert } from 'react-native';
import { channel } from 'redux-saga';
import { take, put, call } from 'redux-saga/effects';

export const alertChannel = channel()

import {ACTION_SHOW_ALERT, ACTION_PUT, ACTION_CALL} from '../actions';

let _alertIsRunning = false
  , _preventNestedAlerts = true;

export function * watchAlertChannel() {
  while (true) {
    const action = yield take(alertChannel)

    try {
        switch(action.type) {
            case ACTION_SHOW_ALERT:
                const {message, title, buttons, options} = action.payload;

                if(_alertIsRunning && _preventNestedAlerts) break; // prevent nested alerts
                _alertIsRunning = true;

                Alert.alert(title, message, buttons, options)
                break;

            case ACTION_PUT:
                _alertIsRunning = false;

                yield put(action.payload)
                break;

            case ACTION_CALL:
                _alertIsRunning = false;

                const {method, args} = action.payload;
                yield call(method, args);
                break;
        }
    } catch(err) {
        console.log("Error", err)
    }
  }
}

export function * preventNestedAlerts(prevent) {
    _preventNestedAlerts = prevent;
}

export function * alert(title, message, buttons = [], options ) {
    const _buttons = buttons.map( b => {
        return {
            text: b.text,
            style: b.hasOwnProperty('style')? b.style : 'default',
            onPress: _createAction(b)
        }
    });

    alertChannel.put({type: ACTION_SHOW_ALERT, payload: {message, title, buttons: _buttons, options}})
}

function _createAction(button) {
    if(typeof button.actions === 'object' && Array.isArray(button.actions)) {
        const actions = button.actions.map( action => _createAction(action) )
        return () => {
            actions.forEach( action => action() )
        }
    }

    if(typeof button.put === 'object' && button.put !== null) {
        return () => alertChannel.put({type: ACTION_PUT, payload: button.put})
    }
    if(typeof button.call === 'function' && button.call !== null) {
        return () => alertChannel.put({type: ACTION_CALL, payload: {method: button.call}});
    }
    if(typeof button.call === 'object' && button.call !== null) {
        return () => alertChannel.put({type: ACTION_CALL, payload: button.call});
    }
}
