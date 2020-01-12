//redux imports
import { combineReducers, Reducer } from "redux";
import {ImageReducer} from "../store/images/reducers";

export const rootReducer = combineReducers({
...ImageReducer
});
