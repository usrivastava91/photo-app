//redux imports
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./appReducers";
// import { rootSaga } from "./appSagas";

export type AppStore = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

// __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ is a field that is available on the window object only if
// the redux devtools is installed. It is not a standard field - therefore, Typescript complains about it.
// This is the reason we are putting a @ts-ignore
// @ts-ignore
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
if (process.env.REACT_APP_BUILD_ENV === "production") {
  // If deploying to production, don't connect to the redux devtools extension.
  composeEnhancers = compose;
}

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// sagaMiddleware.run(rootSaga);
