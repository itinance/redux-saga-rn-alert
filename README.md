# redux-saga-rn-alert

Ever wanted to use Alert.alert() with callbacks within a side-effect or generator function? This library help along!

It allows us to show a typical alert-modal while we can pass callbacks
for the user-action the redux-saga-way with `yield put()` or `yield put()`.
Other side-effects like `fork` or `spawn` aren't implemented yet. Feel
free to contribute if you need it!

# Installation

```bash
yarn add redux-saga-rn-alert
```
or
```bash
npm install redux-saga-rn-alert --save
```

# Setup

In the root reducer add the alert-reducer. For instance:

**reducer.js:**

```javascript
import { alertReducer } from 'redux-saga-rn-alert';

const appReducer = combineReducers({
  appStates,
  routes,
  ...
  alertReducer
});
```

In the root saga spawn the channel watcher:

**saga.js**

```javascript
export default function * rootSaga() {
  yield [
    // ... all your sagas here
    spawn(watchAlertChannel),
  ];
}
```

# Usage

The alert-function has the same signature as the official [alert-method](https://facebook.github.io/react-native/docs/alert.html#alert)
of reacht-native.

```javascript
static alert(title, message?, buttons?, options?) {}
```

## Example 1

Show an alert with 2 Buttons and put some actions:

```javascript
  const buttons = [
      {text: 'Cancel', put: {type: ACTIONS.S_CANCEL_EDIT}},
      {text: 'OK', call: RouterActions.pop},
  ]

  yield call(alert, 'Error', 'Foobar message', buttons)
```

In this example an alert-box will be shown with two buttons "Cancel"
and "ok". If the user taps on "cancel", a ```yield put()``` will be
executed with a user-defined action, while "ok" raises a ```yield call````
to the pop-method of the Router from [react-native-router-flux] (https://github.com/itinance/react-native-router-flux).

Instead of executing a "plain" function, you can also call a method passing
arguments:

## Example 2

```javascript
  const buttons = [
      {text: 'Cancel', put: {type: ACTIONS.S_CANCEL_EDIT}},
      {text: 'OK', call: {method: myMethod, args: {name: '', street: ''}},
  ]

  yield call(alert, 'Error', 'Happy to call alert with callbacks within a generator function', buttons)
```

## Example 3

It is also allowed to pass an array of several side effects:

```javascript
  const buttons = [
      {text: 'Cancel', actions:
        [
            {put: {type: ACTIONS.S_CANCEL_EDIT}},
            {call: RouterActions.pop},
        ],
      },
      {text: 'OK', call: RouterActions.pop},
  ]

  yield call(alert, 'Error', 'Foobar message', buttons)
```

In this example, the callback-function of the Cancel-button will
first "yield put" an action to our reducers and then call the pop()-method 
of the router.