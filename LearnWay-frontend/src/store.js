import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { loginReducer, registerReducer } from "./reducers/authReducer";
import { categoriesReducer } from "./reducers/categoriesReducer";

const reducer = combineReducers({
  loginReducer: loginReducer,
  registerReducer: registerReducer,
  categoriesReducer: categoriesReducer,
});

const middleware = [thunk];
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
