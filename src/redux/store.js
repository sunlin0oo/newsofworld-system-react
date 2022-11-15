import { combineReducers, legacy_createStore as createStore } from "redux";
import { CollapsedReducer } from "./reducers/CollapsedReducer";
// 将众多reducer进行切片，然后再合并到一个reducer里面进行操作
const reducer = combineReducers({
    CollapsedReducer
})
const store = createStore(reducer)

export default store

/**
 * store.dispatch() 发送==>要求进行修改
 * 
 * store.subsribe() 订阅==>修改进行同步
 */